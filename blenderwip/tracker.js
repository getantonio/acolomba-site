/* Blender Progress Tracker — client-side rendering.
   Reads ./progress-data.json and renders the status card, curriculum
   and daily log. The upload form posts a still or playblast to the
   upload endpoint, which files it under the chosen lesson. */
(function () {
  "use strict";

  var tracker = document.getElementById("tracker");
  var loadError = document.getElementById("load-error");
  var UPLOAD_URL = "https://blender-tracker-upload.vercel.app/api/upload";
  var currentData = null;
  var uploadWired = false;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fmtDate(iso) {
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  }

  function lessonState(phaseNo, lessonNo, current) {
    if (phaseNo < current.phase) return "done";
    if (phaseNo > current.phase) return "upcoming";
    if (lessonNo < current.nextLesson) return "done";
    if (lessonNo === current.nextLesson) return "next";
    return "upcoming";
  }

  function renderStatus(data) {
    var cur = data.current;
    var start = new Date(data.trackingStarted + "T00:00:00");
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var daysElapsed = Math.max(0, Math.round((today - start) / 86400000));
    var expected = daysElapsed; // sessions due before today (one per day)
    var logged = data.log.length;
    var behindBy = expected - logged;

    var paceBadge, paceText;
    if (behindBy <= 0) {
      paceBadge = "on-track";
      paceText = logged === 0 && daysElapsed === 0
        ? "On track — day 1, first session today at 3 PM"
        : "On track";
    } else {
      paceBadge = "behind";
      paceText = "Behind by " + behindBy + " day" + (behindBy === 1 ? "" : "s") + " — time to catch up";
    }

    var lastSession = logged > 0 ? fmtDate(data.log[0].date) : "None yet";
    var pct = cur.totalLessons > 0 ? Math.round((cur.lessonsCompleted / cur.totalLessons) * 100) : 0;

    document.getElementById("status-course").textContent = cur.phaseTitle;
    document.getElementById("status-phase").textContent = "Phase " + cur.phase + " · Section " + cur.section + " — " + cur.sectionTitle;
    document.getElementById("status-next").textContent = "Lesson " + cur.nextLesson + " — " + cur.nextLessonTitle;
    document.getElementById("status-count").textContent = cur.lessonsCompleted + " / " + cur.totalLessons + " lessons";
    document.getElementById("status-bar").style.width = pct + "%";
    document.getElementById("status-pct").textContent = pct + "%";
    var paceEl = document.getElementById("status-pace");
    paceEl.textContent = paceText;
    paceEl.className = "pace " + paceBadge;
    document.getElementById("status-sessions").textContent = "Sessions logged: " + logged + " · Expected by now: " + expected + " · Last session: " + lastSession;
  }

  function renderCurriculum(data) {
    var cur = data.current;
    var html = "";
    data.curriculum.forEach(function (phase) {
      var doneInPhase = 0;
      if (phase.phase < cur.phase) doneInPhase = phase.lessons;
      else if (phase.phase === cur.phase) doneInPhase = cur.lessonsCompleted;
      var phaseOpen = phase.phase === cur.phase ? " open" : "";
      html += '<details class="phase"' + phaseOpen + '><summary><h3>Phase ' + phase.phase + " — " + esc(phase.title) + "</h3>";
      html += '<span class="phase-meta">' + phase.lessons + " lessons · " + doneInPhase + " done</span></summary>";
      if (phase.blurb) html += '<p class="muted">' + esc(phase.blurb) + "</p>";
      phase.sections.forEach(function (sec) {
        var secOpen = (phase.phase === cur.phase && sec.section === cur.section) ? " open" : "";
        html += '<details class="phase-section"' + secOpen + '><summary><h4>Section ' + sec.section + " — " + esc(sec.title) + "</h4></summary>";
        if (sec.lessons) {
          html += '<ol class="lessons">';
          sec.lessons.forEach(function (lesson) {
            var state = lessonState(phase.phase, lesson.n, cur);
            var label = state === "done" ? "Done" : state === "next" ? "Next" : "Upcoming";
            html += '<li class="' + state + '"><span class="lesson-no">' + lesson.n + '</span> <span class="lesson-title">' + esc(lesson.title) + '</span> <span class="lesson-state">' + label + "</span></li>";
          });
          html += "</ol>";
        } else {
          html += '<p class="muted">Lesson list coming when this phase starts.</p>';
        }
        html += "</details>";
      });
      html += "</details>";
    });
    document.getElementById("curriculum").innerHTML = html;
  }

  function renderLog(data) {
    var log = data.log.slice().sort(function (a, b) { return b.date < a.date ? -1 : b.date > a.date ? 1 : 0; });
    var html = "";
    if (log.length === 0) {
      html = "<p class=\"muted\">No sessions logged yet — the first session starts today at 3 PM. Each day's proof (a screenshot or a playblast of the Blender work) will appear here.</p>";
    } else {
      log.forEach(function (entry) {
        html += '<article class="log-entry"><h4>' + fmtDate(entry.date) + "</h4>";
        if (entry.lessons && entry.lessons.length) {
          var names = entry.lessons.map(function (n, i) {
            var t = entry.lessonTitles && entry.lessonTitles[i] ? " — " + entry.lessonTitles[i] : "";
            return "Lesson " + n + t;
          }).join(", ");
          html += "<p><strong>Worked on:</strong> " + esc(names) + "</p>";
        }
        if (entry.lastVideoWatched) html += "<p><strong>Last video:</strong> " + esc(entry.lastVideoWatched) + "</p>";
        if (entry.progressInVideo) html += "<p><strong>Progress in video:</strong> " + esc(entry.progressInVideo) + "</p>";
        if (entry.proof) {
          if (entry.proof.type === "video") {
            html += '<video controls preload="metadata" src="' + esc(entry.proof.src) + '"' + (entry.proof.poster ? ' poster="' + esc(entry.proof.poster) + '"' : "") + "></video>";
          } else {
            html += '<img src="' + esc(entry.proof.src) + '" alt="' + esc(entry.proof.alt || "Blender work screenshot") + '" loading="lazy">';
          }
          if (entry.proof.caption) html += '<p class="muted">' + esc(entry.proof.caption) + "</p>";
        }
        html += "</article>";
      });
    }
    document.getElementById("log").innerHTML = html;
  }

  function findLessonTitle(data, n) {
    for (var i = 0; i < data.curriculum.length; i++) {
      var phase = data.curriculum[i];
      for (var j = 0; j < phase.sections.length; j++) {
        var sec = phase.sections[j];
        for (var k = 0; k < (sec.lessons || []).length; k++) {
          if (sec.lessons[k].n === n) return sec.lessons[k].title;
        }
      }
    }
    return "";
  }

  function setUploadStatus(msg, ok) {
    var el = document.getElementById("upload-status");
    el.hidden = false;
    el.textContent = msg;
    el.className = ok ? "ok" : "err";
  }

  function setupUpload(data) {
    var lessonInput = document.getElementById("upload-lesson");
    var titleEl = document.getElementById("upload-lesson-title");
    var btn = document.getElementById("upload-btn");
    var fileInput = document.getElementById("upload-file");
    if (!lessonInput || !btn) return;

    function refreshTitle() {
      var n = parseInt(lessonInput.value, 10);
      var t = isNaN(n) ? "" : findLessonTitle(currentData, n);
      titleEl.textContent = t ? " — " + t : "";
    }
    lessonInput.value = data.current.nextLesson;
    refreshTitle();
    if (uploadWired) return;
    uploadWired = true;
    lessonInput.addEventListener("change", refreshTitle);
    btn.addEventListener("click", function () { doUpload(currentData); });
    fileInput.addEventListener("change", function () {
      document.getElementById("upload-status").hidden = true;
    });
  }

  function doUpload(data) {
    var fileInput = document.getElementById("upload-file");
    var lessonInput = document.getElementById("upload-lesson");
    var btn = document.getElementById("upload-btn");
    var file = fileInput.files && fileInput.files[0];
    var lesson = parseInt(lessonInput.value, 10);
    if (!file) { setUploadStatus("Pick a still or a playblast first.", false); return; }
    if (!lesson || lesson < 1 || lesson > 305) { setUploadStatus("Lesson number must be between 1 and 305.", false); return; }
    if (file.size > 4000000) {
      setUploadStatus("That file is too big to upload here (over ~4 MB). Send the playblast to bud in chat instead.", false);
      return;
    }
    var title = findLessonTitle(data, lesson) || ("Lesson " + lesson);
    btn.disabled = true;
    setUploadStatus("Uploading…", true);
    var reader = new FileReader();
    reader.onerror = function () {
      btn.disabled = false;
      setUploadStatus("Could not read that file. Try again.", false);
    };
    reader.onload = function () {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(",")[1] || "";
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var dd = String(today.getDate()).padStart(2, "0");
      fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "",
          base64: base64,
          lesson: lesson,
          lessonTitle: title,
          date: yyyy + "-" + mm + "-" + dd,
          lastVideoWatched: title,
          progressInVideo: "finished",
        }),
      })
        .then(function (res) { return res.json().then(function (j) { return { status: res.status, body: j }; }); })
        .then(function (r) {
          btn.disabled = false;
          if (r.body && r.body.ok) {
            setUploadStatus("Uploaded — filed under Lesson " + lesson + " — " + title + ".", true);
            fileInput.value = "";
            load();
          } else {
            setUploadStatus("Upload failed: " + ((r.body && r.body.error) || ("HTTP " + r.status)) + ".", false);
          }
        })
        .catch(function () {
          btn.disabled = false;
          setUploadStatus("Upload failed — network error. Try again, or send it to bud in chat.", false);
        });
    };
    reader.readAsDataURL(file);
  }

  function load() {
    fetch("./progress-data.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        currentData = data;
        renderStatus(data);
        renderCurriculum(data);
        renderLog(data);
        setupUpload(data);
      })
      .catch(function () {
        loadError.hidden = false;
      });
  }

  tracker.hidden = false;
  load();
})();
