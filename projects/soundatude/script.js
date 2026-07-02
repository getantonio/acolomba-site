const audio = document.querySelector("#sampleAudio");
const playerPanel = document.querySelector("#sample");
const playButton = document.querySelector("#playButton");
const loopPicker = document.querySelector("#loopPicker");
const loopTrigger = document.querySelector("#loopTrigger");
const loopWheel = document.querySelector("#loopWheel");
const selectedLoop = document.querySelector("#selectedLoop");
const previousLoop = document.querySelector("#previousLoop");
const nextLoop = document.querySelector("#nextLoop");
const modeButtons = [...document.querySelectorAll(".mode-toggle button")];
const volumeControl = document.querySelector("#volumeControl");
const shuffleButton = document.querySelector("#shuffleButton");
const loopAllButton = document.querySelector("#loopAllButton");
const playlistSelect = document.querySelector("#playlistSelect");
const createPlaylistButton = document.querySelector("#createPlaylistButton");
const fileLoader = document.querySelector("#fileLoader");
const playlistEditor = document.querySelector("#playlistEditor");
const playlistTitle = document.querySelector("#playlistTitle");
const playlistCount = document.querySelector("#playlistCount");
const pageRail = document.querySelector(".page-rail");
const pageDots = [...document.querySelectorAll(".page-dots span")];
const openPlaylistButton = document.querySelector("#openPlaylistButton");
const openPlayerButton = document.querySelector("#openPlayerButton");
const consoleMeter = document.querySelector(".console-meter");
const previewAudio = new Audio();
const PLAYLIST_STORAGE_KEY = "sound-a-tude-playlists-v1";
const METER_BAR_COUNT = 56;

const choices = {
  loop: [
    { title: "Attitude & Effort", file: "assets/audio/positive_affirmations1.mp3" },
    { title: "Negative Thoughts to Positive Action", file: "assets/audio/positive_affirmations2.mp3" },
    { title: "I Show Up Anyway", file: "assets/audio/positive_affirmations3.mp3" },
    { title: "Mistakes Help Me Grow", file: "assets/audio/positive_affirmations4.mp3" },
    { title: "I Can Try Again", file: "assets/audio/positive_affirmations5.mp3" },
    { title: "Focus and Discipline", file: "assets/audio/positive_affirmations6.mp3" },
    { title: "Confidence Before a Challenge", file: "assets/audio/positive_affirmations7.mp3" },
    { title: "Big or Small, I Give My Best", file: "assets/audio/positive_affirmations8.mp3" },
    { title: "Calm Effort", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Morning Mindset Reset", file: "assets/audio/attitude-effort-sample.mp3" },
  ],
  conversation: [
    { title: "Attitude Check-In", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Thought to Action Talk", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Show Up Conversation", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Mistake Reset", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Try Again Talk", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Focus Conversation", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Before the Challenge", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Give My Best Talk", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Calm Effort Conversation", file: "assets/audio/attitude-effort-sample.mp3" },
    { title: "Morning Reset Conversation", file: "assets/audio/attitude-effort-sample.mp3" },
  ],
};

let currentMode = "loop";
let selectedIndexByMode = {
  loop: 0,
  conversation: 0,
};
Object.entries(choices).forEach(([mode, modeChoices]) => {
  modeChoices.forEach((choice, index) => {
    choice.id = `${mode}-starter-${index}`;
    choice.source = "starter";
  });
});

let activePlaylistIdByMode = {
  loop: "loop-starter",
  conversation: "conversation-starter",
};
let playlistsByMode = {
  loop: [
    {
      id: "loop-starter",
      name: "Starter mix",
      itemIds: choices.loop.map((choice) => choice.id),
    },
  ],
  conversation: [
    {
      id: "conversation-starter",
      name: "Starter talks",
      itemIds: choices.conversation.map((choice) => choice.id),
    },
  ],
};
let loopOptions = [];
let scrollFrame = null;
let scrollSettleTimer = null;
let pageFrame = null;
let queueMode = "single";
let previewingId = null;
let audioContext = null;
let analyser = null;
let meterSource = null;
let meterData = null;
let meterFrame = null;
let meterBars = [];
let meterLevels = [];

loadSavedPlaylistConfiguration();

function currentChoices() {
  return currentPlaylist().itemIds
    .map((itemId) => findChoice(itemId))
    .filter(Boolean);
}

function currentPlaylist() {
  const playlists = playlistsByMode[currentMode];
  return playlists.find((playlist) => playlist.id === activePlaylistIdByMode[currentMode]) ?? playlists[0];
}

function findChoice(itemId) {
  return choices[currentMode].find((choice) => choice.id === itemId);
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[character]));
}

function loadSavedPlaylistConfiguration() {
  try {
    const savedState = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY));
    if (!savedState) return;

    ["loop", "conversation"].forEach((mode) => {
      const validIds = new Set(choices[mode].map((choice) => choice.id));
      const savedPlaylists = savedState.playlistsByMode?.[mode];
      if (!Array.isArray(savedPlaylists)) return;

      const normalizedPlaylists = savedPlaylists
        .map((playlist) => ({
          id: typeof playlist.id === "string" ? playlist.id : `${mode}-custom-${Date.now()}`,
          name: typeof playlist.name === "string" && playlist.name.trim() ? playlist.name.trim() : "Playlist",
          itemIds: Array.isArray(playlist.itemIds)
            ? playlist.itemIds.filter((itemId) => validIds.has(itemId))
            : [],
        }))
        .filter((playlist) => playlist.itemIds.length);

      if (!normalizedPlaylists.length) return;

      playlistsByMode[mode] = normalizedPlaylists;
      activePlaylistIdByMode[mode] = normalizedPlaylists.some((playlist) => playlist.id === savedState.activePlaylistIdByMode?.[mode])
        ? savedState.activePlaylistIdByMode[mode]
        : normalizedPlaylists[0].id;
    });
  } catch {
    localStorage.removeItem(PLAYLIST_STORAGE_KEY);
  }
}

function savePlaylistConfiguration() {
  const savedPlaylists = {};

  ["loop", "conversation"].forEach((mode) => {
    const starterIds = new Set(choices[mode].filter((choice) => choice.source === "starter").map((choice) => choice.id));
    savedPlaylists[mode] = playlistsByMode[mode]
      .map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        itemIds: playlist.itemIds.filter((itemId) => starterIds.has(itemId)),
      }))
      .filter((playlist) => playlist.itemIds.length);
  });

  localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify({
    activePlaylistIdByMode,
    playlistsByMode: savedPlaylists,
  }));
}

function clampSelectedIndex() {
  const optionCount = currentChoices().length;
  selectedIndexByMode[currentMode] = Math.min(Math.max(selectedIndexByMode[currentMode], 0), optionCount - 1);
}

function updateVolume() {
  audio.volume = Number(volumeControl.value) / 100;
  previewAudio.volume = audio.volume;
}

updateVolume();

function idleMeterLevel(index) {
  const phase = (index / METER_BAR_COUNT) * Math.PI * 4;
  return 0.08 + Math.pow(Math.sin(phase) * 0.5 + 0.5, 2) * 0.08;
}

function renderAudioMeter() {
  if (!consoleMeter) return;

  consoleMeter.style.setProperty("--meter-bars", METER_BAR_COUNT);
  meterLevels = Array.from({ length: METER_BAR_COUNT }, (_, index) => idleMeterLevel(index));
  consoleMeter.innerHTML = meterLevels
    .map((level) => `<span style="--level: ${level.toFixed(3)}"></span>`)
    .join("");
  meterBars = [...consoleMeter.querySelectorAll("span")];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function primeAudioMeter() {
  if (!consoleMeter || !window.AudioContext && !window.webkitAudioContext) return;

  try {
    if (!audioContext) {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextConstructor();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.68;
      meterData = new Uint8Array(analyser.fftSize);
      meterSource = audioContext.createMediaElementSource(audio);
      meterSource.connect(analyser);
      analyser.connect(audioContext.destination);
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  } catch {
    return;
  }

  startMeterAnimation();
}

function startMeterAnimation() {
  if (meterFrame || !meterBars.length) return;
  meterFrame = requestAnimationFrame(updateAudioMeter);
}

function updateAudioMeter() {
  const hasLiveAudio = analyser && meterData && !audio.paused && !audio.ended;
  const time = performance.now() / 1000;

  if (hasLiveAudio) {
    analyser.getByteTimeDomainData(meterData);
  }

  let highestLevel = 0;
  const samplesPerBar = meterData ? Math.max(1, Math.floor(meterData.length / METER_BAR_COUNT)) : 1;

  meterBars.forEach((bar, index) => {
    let nextLevel = idleMeterLevel(index + time * 0.45);

    if (hasLiveAudio) {
      let sum = 0;
      const sampleStart = index * samplesPerBar;
      const sampleEnd = Math.min(sampleStart + samplesPerBar, meterData.length);

      for (let sampleIndex = sampleStart; sampleIndex < sampleEnd; sampleIndex += 1) {
        const centeredSample = (meterData[sampleIndex] - 128) / 128;
        sum += centeredSample * centeredSample;
      }

      const rms = Math.sqrt(sum / Math.max(sampleEnd - sampleStart, 1));
      nextLevel = clamp(0.08 + rms * 4.8, 0.08, 1);
    }

    const previousLevel = meterLevels[index] ?? nextLevel;
    const smoothing = nextLevel > previousLevel ? 0.56 : 0.2;
    const smoothedLevel = previousLevel + (nextLevel - previousLevel) * smoothing;

    meterLevels[index] = smoothedLevel;
    highestLevel = Math.max(highestLevel, smoothedLevel);
    bar.style.setProperty("--level", smoothedLevel.toFixed(3));
  });

  if (hasLiveAudio || highestLevel > 0.18) {
    meterFrame = requestAnimationFrame(updateAudioMeter);
    return;
  }

  meterFrame = null;
}

function setPlayingState(isPlaying) {
  playerPanel.classList.toggle("is-playing", isPlaying);
  playButton.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute("aria-label", isPlaying ? "Stop" : "Play");
  if (isPlaying) {
    startMeterAnimation();
  }
}

function applyAudioLooping() {
  audio.loop = currentMode === "loop" && queueMode === "single";
}

function updateQueueButtons() {
  const isShuffle = queueMode === "shuffle";
  const isLoopAll = queueMode === "all";

  shuffleButton.classList.toggle("is-active", isShuffle);
  shuffleButton.setAttribute("aria-pressed", String(isShuffle));
  loopAllButton.classList.toggle("is-active", isLoopAll);
  loopAllButton.setAttribute("aria-pressed", String(isLoopAll));
}

function setQueueMode(mode) {
  queueMode = queueMode === mode ? "single" : mode;
  applyAudioLooping();
  updateQueueButtons();
}

function updatePageDots() {
  const pageIndex = Math.round(pageRail.scrollLeft / Math.max(pageRail.clientWidth, 1));
  pageDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === pageIndex);
  });
}

function goToPage(pageIndex) {
  pageRail.scrollTo({
    left: pageRail.clientWidth * pageIndex,
    behavior: "smooth",
  });
}

function centerSelectedOption(behavior = "smooth") {
  const selectedOption = loopOptions.find((option) => option.getAttribute("aria-selected") === "true");
  selectedOption?.scrollIntoView({ block: "center", behavior });
}

function selectLoop(option) {
  const shouldResume = !audio.paused;

  selectedIndexByMode[currentMode] = Number(option.dataset.index);
  syncSelection({ scrollBehavior: "smooth", updateAudio: true });

  if (shouldResume) {
    audio.currentTime = 0;
    audio.play().catch(() => setPlayingState(false));
  }
}

function renderWheel() {
  const activeChoices = currentChoices();
  loopWheel.setAttribute("aria-label", currentMode === "loop" ? "Select loop" : "Select conversation");
  loopWheel.innerHTML = activeChoices
    .map((choice, index) => {
      const selected = index === selectedIndexByMode[currentMode] ? ' aria-selected="true"' : "";
      return `<button type="button" role="option"${selected} data-index="${index}" data-title="${choice.title}">${choice.title}</button>`;
    })
    .join("");

  loopOptions = [...loopWheel.querySelectorAll("button")];
  syncSelection({ scrollBehavior: "auto" });
}

function syncSelection({ scrollBehavior = "auto", center = true, updateAudio = true } = {}) {
  clampSelectedIndex();
  const activeChoices = currentChoices();
  const selectedIndex = selectedIndexByMode[currentMode];
  const selectedChoice = activeChoices[selectedIndex];

  loopOptions.forEach((loopOption) => {
    loopOption.setAttribute("aria-selected", String(Number(loopOption.dataset.index) === selectedIndex));
  });

  selectedLoop.textContent = selectedChoice.title;
  if (updateAudio) {
    updateAudioSource(selectedChoice.file);
  }
  applyAudioLooping();
  updateLoopNeighbors();
  if (center) {
    requestAnimationFrame(() => centerSelectedOption(scrollBehavior));
  }
}

function updateSelectionFromScroll({ updateAudio = false } = {}) {
  if (!loopOptions.length) return;

  const wheelCenter = loopWheel.getBoundingClientRect().top + loopWheel.clientHeight / 2;
  let closestOption = loopOptions[0];
  let closestDistance = Number.POSITIVE_INFINITY;

  loopOptions.forEach((option) => {
    const rect = option.getBoundingClientRect();
    const optionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(optionCenter - wheelCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestOption = option;
    }
  });

  const nextIndex = Number(closestOption.dataset.index);
  const didChange = selectedIndexByMode[currentMode] !== nextIndex;
  selectedIndexByMode[currentMode] = nextIndex;

  syncSelection({
    center: false,
    updateAudio,
  });
}

function updateAudioSource(file) {
  if (audio.getAttribute("src") === file) return;

  audio.setAttribute("src", file);
  audio.load();
}

function updateLoopNeighbors() {
  const activeChoices = currentChoices();
  const selectedIndex = selectedIndexByMode[currentMode];
  const optionCount = activeChoices.length;
  const previousIndex = (selectedIndex - 1 + optionCount) % optionCount;
  const nextIndex = (selectedIndex + 1) % optionCount;

  previousLoop.textContent = activeChoices[previousIndex].title;
  nextLoop.textContent = activeChoices[nextIndex].title;
}

function setMode(mode) {
  if (mode === currentMode) return;

  currentMode = mode;
  audio.pause();
  audio.currentTime = 0;
  setPlayingState(false);
  stopPreview();
  applyAudioLooping();

  modeButtons.forEach((button) => {
    const isSelected = button.dataset.mode === currentMode;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  renderWheel();
  renderPlaylistEditor();
  renderPlaylistControls();
}

function nextQueuedIndex() {
  const optionCount = currentChoices().length;
  const currentIndex = selectedIndexByMode[currentMode];

  if (queueMode === "shuffle" && optionCount > 1) {
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * optionCount);
    }
    return nextIndex;
  }

  return (currentIndex + 1) % optionCount;
}

function renderPlaylistControls() {
  const playlists = playlistsByMode[currentMode];
  playlistSelect.innerHTML = playlists
    .map((playlist) => {
      const selected = playlist.id === currentPlaylist().id ? " selected" : "";
      return `<option value="${playlist.id}"${selected}>${escapeHTML(playlist.name)}</option>`;
    })
    .join("");
}

function renderPlaylistEditor() {
  const activePlaylist = currentPlaylist();
  const activeSet = new Set(activePlaylist.itemIds);

  playlistTitle.textContent = activePlaylist.name;
  playlistCount.textContent = `${activePlaylist.itemIds.length} file${activePlaylist.itemIds.length === 1 ? "" : "s"}`;
  playlistEditor.innerHTML = choices[currentMode]
    .map((choice) => {
      const isIncluded = activeSet.has(choice.id);
      const isLastIncluded = isIncluded && activePlaylist.itemIds.length === 1;
      const isPreviewing = previewingId === choice.id;
      return `
        <div class="playlist-track${isIncluded ? " is-included" : ""}" data-item-id="${choice.id}">
          <button class="playlist-preview" type="button" aria-label="${isPreviewing ? "Stop" : "Play"} ${escapeHTML(choice.title)}">
            <span class="${isPreviewing ? "stop-mini-icon" : "play-mini-icon"}" aria-hidden="true"></span>
          </button>
          <span>${escapeHTML(choice.title)}</span>
          <button
            class="playlist-membership"
            type="button"
            aria-label="${isIncluded ? "Remove" : "Add"} ${escapeHTML(choice.title)}"
            aria-pressed="${isIncluded}"
            ${isLastIncluded ? "disabled" : ""}
          >
            ${isIncluded ? "−" : "+"}
          </button>
        </div>
      `;
    })
    .join("");
}

function togglePlaylistItem(itemId) {
  const activePlaylist = currentPlaylist();
  const isIncluded = activePlaylist.itemIds.includes(itemId);

  if (isIncluded && activePlaylist.itemIds.length === 1) {
    return;
  }

  const selectedItemId = activePlaylist.itemIds[selectedIndexByMode[currentMode]];
  const wasPlaying = !audio.paused;
  const wasPreviewingRemovedItem = previewingId === itemId;

  if (isIncluded) {
    activePlaylist.itemIds = activePlaylist.itemIds.filter((activeItemId) => activeItemId !== itemId);
  } else {
    activePlaylist.itemIds = [...activePlaylist.itemIds, itemId];
  }

  if (wasPreviewingRemovedItem) {
    stopPreview();
  }

  const nextSelectedIndex = activePlaylist.itemIds.indexOf(selectedItemId);
  selectedIndexByMode[currentMode] = nextSelectedIndex >= 0 ? nextSelectedIndex : 0;

  renderWheel();
  renderPlaylistEditor();
  savePlaylistConfiguration();

  if (wasPlaying) {
    audio.currentTime = 0;
    audio.play().catch(() => setPlayingState(false));
  }
}

function createPlaylist() {
  const playlists = playlistsByMode[currentMode];
  const playlistNumber = playlists.length + 1;
  const prefix = currentMode === "loop" ? "Loop" : "Conversation";
  const firstChoice = currentChoices()[selectedIndexByMode[currentMode]] ?? choices[currentMode][0];
  const playlist = {
    id: `${currentMode}-custom-${Date.now()}`,
    name: `${prefix} playlist ${playlistNumber}`,
    itemIds: firstChoice ? [firstChoice.id] : [],
  };

  playlists.push(playlist);
  activePlaylistIdByMode[currentMode] = playlist.id;
  selectedIndexByMode[currentMode] = 0;
  stopPreview();
  renderPlaylistControls();
  renderWheel();
  renderPlaylistEditor();
  savePlaylistConfiguration();
}

function switchPlaylist(playlistId) {
  activePlaylistIdByMode[currentMode] = playlistId;
  selectedIndexByMode[currentMode] = 0;
  stopPreview();
  renderWheel();
  renderPlaylistEditor();
  savePlaylistConfiguration();
}

function loadFiles(files) {
  const activePlaylist = currentPlaylist();
  const newChoices = [...files]
    .filter((file) => file.type.startsWith("audio/"))
    .map((file) => {
      const title = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim() || "Loaded audio";
      return {
        id: `${currentMode}-loaded-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        file: URL.createObjectURL(file),
        source: "loaded",
      };
    });

  if (!newChoices.length) return;

  choices[currentMode].push(...newChoices);
  activePlaylist.itemIds.push(...newChoices.map((choice) => choice.id));
  renderWheel();
  renderPlaylistEditor();
  fileLoader.value = "";
  savePlaylistConfiguration();
}

function stopPreview() {
  previewAudio.pause();
  previewAudio.currentTime = 0;
  previewingId = null;
}

async function playPreview(itemId) {
  const choice = findChoice(itemId);
  if (!choice) return;

  if (previewingId === itemId && !previewAudio.paused) {
    stopPreview();
    renderPlaylistEditor();
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  setPlayingState(false);
  stopPreview();
  previewingId = itemId;
  previewAudio.src = choice.file;
  previewAudio.volume = audio.volume;
  previewAudio.currentTime = 0;

  try {
    await previewAudio.play();
  } catch {
    previewingId = null;
  }

  renderPlaylistEditor();
}

async function playQueuedTrack() {
  selectedIndexByMode[currentMode] = nextQueuedIndex();
  syncSelection({ scrollBehavior: "smooth", updateAudio: true });
  audio.currentTime = 0;

  try {
    await audio.play();
    setPlayingState(true);
  } catch {
    setPlayingState(false);
  }
}

playButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      primeAudioMeter();
      await audio.play();
      setPlayingState(true);
    } catch {
      setPlayingState(false);
    }
  } else {
    audio.pause();
    audio.currentTime = 0;
    setPlayingState(false);
    startMeterAnimation();
  }
});

loopTrigger.addEventListener("click", () => centerSelectedOption("smooth"));

loopWheel.addEventListener("click", (event) => {
  const option = event.target.closest("[role='option']");
  if (option) {
    selectLoop(option);
  }
});

loopWheel.addEventListener("scroll", () => {
  if (scrollFrame) {
    cancelAnimationFrame(scrollFrame);
  }

  scrollFrame = requestAnimationFrame(() => {
    updateSelectionFromScroll({ updateAudio: false });
  });

  clearTimeout(scrollSettleTimer);
  scrollSettleTimer = setTimeout(() => {
    updateSelectionFromScroll({ updateAudio: true });
    centerSelectedOption("smooth");
  }, 140);
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

shuffleButton.addEventListener("click", () => setQueueMode("shuffle"));
loopAllButton.addEventListener("click", () => setQueueMode("all"));
openPlaylistButton.addEventListener("click", () => goToPage(1));
openPlayerButton.addEventListener("click", () => goToPage(0));
playlistSelect.addEventListener("change", () => switchPlaylist(playlistSelect.value));
createPlaylistButton.addEventListener("click", createPlaylist);
fileLoader.addEventListener("change", () => loadFiles(fileLoader.files));

playlistEditor.addEventListener("click", (event) => {
  const track = event.target.closest(".playlist-track");
  if (!track) return;

  if (event.target.closest(".playlist-preview")) {
    playPreview(track.dataset.itemId);
    return;
  }

  if (event.target.closest(".playlist-membership")) {
    togglePlaylistItem(track.dataset.itemId);
  }
});

previewAudio.addEventListener("ended", () => {
  previewingId = null;
  renderPlaylistEditor();
});

pageRail.addEventListener("scroll", () => {
  if (pageFrame) {
    cancelAnimationFrame(pageFrame);
  }

  pageFrame = requestAnimationFrame(updatePageDots);
});

volumeControl.addEventListener("input", updateVolume);
volumeControl.addEventListener("change", updateVolume);
audio.addEventListener("play", () => {
  primeAudioMeter();
  setPlayingState(true);
});
audio.addEventListener("pause", startMeterAnimation);

renderAudioMeter();
applyAudioLooping();
updateQueueButtons();
renderPlaylistControls();
renderWheel();
renderPlaylistEditor();
updatePageDots();

if (
  "serviceWorker" in navigator &&
  (location.protocol === "https:" || location.hostname === "localhost")
) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

document.addEventListener("click", (event) => {
  if (!loopPicker.contains(event.target)) {
    centerSelectedOption("smooth");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    centerSelectedOption("smooth");
    loopWheel.focus({ preventScroll: true });
  }
});

audio.addEventListener("ended", () => {
  if (queueMode === "single") {
    setPlayingState(false);
    return;
  }

  playQueuedTrack();
});
