/* Blender Progress Tracker — client-side rendering.
   Reads ./progress-data.json and renders the status card, curriculum
   and daily log. No uploads, no edits — read-only. */
(function () {
  "use strict";

  var tracker = document.getElementById("tracker");
  var loadError = document.getElementById("load-error");

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

  function load() {
    fetch("./progress-data.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        renderStatus(data);
        renderCurriculum(data);
        renderLog(data);
      })
      .catch(function () {
        loadError.hidden = false;
      });
  }

  tracker.hidden = false;
  load();
})();
