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
const voiceSelect = document.querySelector("#voiceSelect");
const voiceStatus = document.querySelector("#voiceStatus");
const voiceControl = document.querySelector(".voice-control");
const conversationSeek = document.querySelector("#conversationSeek");
const conversationCurrentTime = document.querySelector("#conversationCurrentTime");
const conversationDuration = document.querySelector("#conversationDuration");
const openVoiceRecorderButton = document.querySelector("#openVoiceRecorderButton");
const voiceRecorderDialog = document.querySelector("#voiceRecorderDialog");
const closeVoiceRecorderButton = document.querySelector("#closeVoiceRecorderButton");
const recorderCategorySelect = document.querySelector("#recorderCategorySelect");
const recorderModeButtons = [...document.querySelectorAll("[data-recorder-mode]")];
const recorderCustomFields = document.querySelector("#recorderCustomFields");
const recorderCustomCategorySelect = document.querySelector("#recorderCustomCategorySelect");
const recorderNewCategoryField = document.querySelector("#recorderNewCategoryField");
const recorderCustomCategoryInput = document.querySelector("#recorderCustomCategoryInput");
const recorderCustomPhraseInput = document.querySelector("#recorderCustomPhraseInput");
const examplePhraseSetSelect = document.querySelector("#examplePhraseSetSelect");
const loadExamplePhraseSetButton = document.querySelector("#loadExamplePhraseSetButton");
const clearPhraseQueueButton = document.querySelector("#clearPhraseQueueButton");
const deleteCustomCategoryButton = document.querySelector("#deleteCustomCategoryButton");
const recorderProgressText = document.querySelector("#recorderProgressText");
const recorderProgressBar = document.querySelector("#recorderProgressBar");
const recorderPositionText = document.querySelector("#recorderPositionText");
const recorderPhraseState = document.querySelector("#recorderPhraseState");
const recorderPhraseHandle = document.querySelector("#recorderPhraseHandle");
const recorderPhraseTitle = document.querySelector("#recorderPhraseTitle");
const recorderPhraseText = document.querySelector("#recorderPhraseText");
const previousRecorderPhraseButton = document.querySelector("#previousRecorderPhraseButton");
const recordPhraseButton = document.querySelector("#recordPhraseButton");
const nextRecorderPhraseButton = document.querySelector("#nextRecorderPhraseButton");
const playRecordedPhraseButton = document.querySelector("#playRecordedPhraseButton");
const retakeRecordedPhraseButton = document.querySelector("#retakeRecordedPhraseButton");
const recorderMessage = document.querySelector("#recorderMessage");
const useRecordedVoiceButton = document.querySelector("#useRecordedVoiceButton");
const volumeDownButton = document.querySelector("#volumeDownButton");
const volumeControl = document.querySelector("#volumeControl");
const volumeUpButton = document.querySelector("#volumeUpButton");
const speedDownButton = document.querySelector("#speedDownButton");
const speedControl = document.querySelector("#speedControl");
const speedUpButton = document.querySelector("#speedUpButton");
const shuffleButton = document.querySelector("#shuffleButton");
const repeatModeButton = document.querySelector("#repeatModeButton");
const repeatModeLabel = document.querySelector("#repeatModeLabel");
const nextButton = document.querySelector("#nextButton");
const playlistSelect = document.querySelector("#playlistSelect");
const createPlaylistButton = document.querySelector("#createPlaylistButton");
const fileLoader = document.querySelector("#fileLoader");
const playlistEditor = document.querySelector("#playlistEditor");
const playlistTitle = document.querySelector("#playlistTitle");
const playlistCount = document.querySelector("#playlistCount");
const mainCategorySelect = document.querySelector("#mainCategorySelect");
const selectAllButton = document.querySelector("#selectAllButton");
const randomCountInput = document.querySelector("#randomCountInput");
const randomSelectionButton = document.querySelector("#randomSelectionButton");
const pageRail = document.querySelector(".page-rail");
const pageDots = [...document.querySelectorAll(".page-dots button")];
const openPlaylistButton = document.querySelector("#openPlaylistButton");
const openPlayerFooterButton = document.querySelector("#openPlayerFooterButton");
const openRecorderFooterButton = document.querySelector("#openRecorderFooterButton");
const openPlayerButton = document.querySelector("#openPlayerButton");
const openGuideButton = document.querySelector("#openGuideButton");
const closeGuideButton = document.querySelector("#closeGuideButton");
const openSettingsButton = document.querySelector("#openSettingsButton");
const closeSettingsButton = document.querySelector("#closeSettingsButton");
const footerNavButtons = [openPlayerFooterButton, openPlaylistButton, openRecorderFooterButton, openGuideButton, openSettingsButton];
const flowingWaveformToggle = document.querySelector("#flowingWaveformToggle");
const consoleMeter = document.querySelector(".console-meter");
let flowingWaveform = document.querySelector("#flowingWaveform");
const previewAudio = new Audio();
const recorderPreviewAudio = new Audio();
const PLAYLIST_STORAGE_KEY = "sound-a-tude-playlists-v2";
const VOICE_STORAGE_KEY = "sound-a-tude-voice-v1";
const PLAYBACK_STORAGE_KEY = "sound-a-tude-playback-v1";
const WAVEFORM_STYLE_STORAGE_KEY = "sound-a-tude-waveform-style-v1";
const LEGACY_RECORDER_STORAGE_KEYS = ["sound-a-tude-recorder-v1"];
const RECORDER_STORAGE_KEY = "sound-a-tude-recorder-v2";
const RECORDED_VOICE_DB_NAME = "sound-a-tude-recorded-voices";
const RECORDED_VOICE_STORE = "recordings";
const BROWSER_RECORDED_VOICE_ID = "browser-my-voice-v001";
const BROWSER_RECORDED_FALLBACK_VOICE_ID = "af_nicole";
const CUSTOM_RECORDED_SOURCE = "browser-recorded-custom";
const DEFAULT_CUSTOM_RECORDED_CATEGORY = "My Affirmations";
const NEW_CUSTOM_CATEGORY_VALUE = "__new-custom-recording-category__";
const METER_BAR_COUNT = 192;
const METER_LEVEL_CEILING = 0.98;
const METER_VISUAL_AMPLITUDE = 0.75;
const RECORDER_AUDIO_CONSTRAINTS = {
  echoCancellation: { ideal: true },
  noiseSuppression: { ideal: true },
  autoGainControl: { ideal: true },
  channelCount: { ideal: 1 },
  sampleRate: { ideal: 48000 },
  sampleSize: { ideal: 16 },
};
const RECORDER_MIC_WARMUP_MS = 320;
const RECORDER_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/aac",
];
const STARTER_CUSTOM_PHRASE_LIMIT = 10;
const EXAMPLE_CUSTOM_PHRASE_SETS = {
  "never-quit": {
    title: "I Never Quit",
    category: "I Never Quit",
    phrases: [
      "1. I never give up on myself.",
      "2. I keep going even when it gets hard.",
      "3. Every setback makes me stronger.",
      "4. I choose persistence over doubt.",
      "5. I rise after every fall.",
      "6. I am stronger than my fears.",
      "7. I refuse to let go of hope.",
      "8. I stay committed to my path.",
      "9. I am capable of handling anything.",
      "10. I keep moving forward with faith.",
    ].join("\n"),
  },
  "quit-smoking": {
    title: "Quit Smoking",
    category: "Quit Smoking",
    phrases: [
      "1. I release the urge to rely on unhealthy habits.",
      "2. My determination to heal grows stronger each day.",
      "3. I fill my life with activities that support my well-being.",
      "4. I choose freedom over addiction with every decision I make.",
      "5. My mind and body are aligned in the pursuit of health.",
      "6. I trust the process of change and embrace it fully.",
      "7. My inner strength is greater than any external temptation.",
      "8. I am proud of the person I am becoming.",
      "9. I am surrounded by support and love on my journey to recovery.",
      "10. I do not like the taste of cigarettes.",
    ].join("\n"),
  },
};

clearLegacyRecorderState();

const choices = {
  loop: [
    { title: "Attitude & Effort", file: "assets/audio/positive_affirmations1.mp3", phraseId: "sat-p021" },
    { title: "Negative Thoughts to Positive Action", file: "assets/audio/positive_affirmations2.mp3", phraseId: "sat-p042" },
    { title: "I Show Up Anyway", file: "assets/audio/positive_affirmations3.mp3", phraseId: "sat-p032" },
    { title: "Mistakes Help Me Grow", file: "assets/audio/positive_affirmations4.mp3", phraseId: "sat-p004" },
    { title: "I Can Try Again", file: "assets/audio/positive_affirmations5.mp3", phraseId: "sat-p018" },
    { title: "Focus and Discipline", file: "assets/audio/positive_affirmations6.mp3", phraseId: "sat-p006" },
    { title: "Confidence Before a Challenge", file: "assets/audio/positive_affirmations7.mp3", phraseId: "sat-p024" },
    { title: "Big or Small, I Give My Best", file: "assets/audio/positive_affirmations8.mp3", phraseId: "sat-p031" },
    { title: "Calm Effort", file: "assets/audio/attitude-effort-sample.mp3", phraseId: "sat-p009" },
    { title: "Morning Mindset Reset", file: "assets/audio/attitude-effort-sample.mp3", phraseId: "sat-p041" },
  ],
  conversation: [
    {
      title: "Attitude & Effort",
      file: "assets/audio/conversations/sat-c002-attitude-effort-conversation-mara-v001-theo-v001-mix-v001.mp3",
      category: "Attitude & Effort",
    },
    {
      title: "Confidence & Connection",
      file: "assets/audio/conversations/sat-c001-confidence-connection-conversation-mara-v001-theo-v001-mix-v003.mp3",
      category: "Confidence & Connection",
    },
  ],
};

const attitudeEffortPhraseIds = Object.freeze(Array.from({ length: 51 }, (_, index) => (
  `sat-p${String(index + 1).padStart(3, "0")}`
)));
const connectionPhraseIds = Object.freeze(Array.from({ length: 50 }, (_, index) => (
  `sat-p${String(index + 152).padStart(3, "0")}`
)));
const phraseIds = Object.freeze([...attitudeEffortPhraseIds, ...connectionPhraseIds]);

const phraseLibrary = [
  ["sat-p001", "Ready starts with one honest rep."],
  ["sat-p002", "Name the thought, then take the next step."],
  ["sat-p003", "Showing up counts before feeling ready."],
  ["sat-p004", "A mistake is feedback, not a final answer."],
  ["sat-p005", "Try again, smaller and steadier."],
  ["sat-p006", "Bring your attention back to one thing."],
  ["sat-p007", "Confidence grows while you move."],
  ["sat-p008", "Your best can be quiet and still count."],
  ["sat-p009", "Calm effort is still strong effort."],
  ["sat-p010", "Start with the next right action."],
  ["sat-p011", "I choose a positive attitude and steady effort in everything I do."],
  ["sat-p012", "My attitude shapes my direction, and my effort moves me forward."],
  ["sat-p013", "I meet challenges with patience, focus, and consistent effort."],
  ["sat-p014", "I can control my attitude, and I can strengthen my effort."],
  ["sat-p015", "Every day, I bring a willing attitude and give my best effort."],
  ["sat-p016", "I grow when I stay optimistic and keep working."],
  ["sat-p017", "My effort matters, especially when things feel difficult."],
  ["sat-p018", "I face setbacks with a strong attitude and the courage to try again."],
  ["sat-p019", "I am proud of the effort I give and the mindset I build."],
  ["sat-p020", "With the right attitude and honest effort, I can keep improving."],
  ["sat-p021", "I approach all challenges with a positive attitude and always apply my best effort to every task, big or small."],
  ["sat-p022", "I approach every challenge with a positive attitude and give my best effort to each task, big or small."],
  ["sat-p023", "I bring a strong attitude and steady effort to everything I do, even when the work is difficult."],
  ["sat-p024", "I choose to face challenges with confidence, patience, and my very best effort."],
  ["sat-p025", "I apply myself fully to every task and keep a positive attitude from start to finish."],
  ["sat-p026", "I meet obstacles with a hopeful mindset and the effort needed to keep moving forward."],
  ["sat-p027", "I give my best effort in all that I do and trust that my attitude helps me grow."],
  ["sat-p028", "I approach each responsibility with focus, positivity, and a willingness to work hard."],
  ["sat-p029", "I stay positive through challenges and put honest effort into every step I take."],
  ["sat-p030", "I bring determination, patience, and my best effort to every opportunity before me."],
  ["sat-p031", "I face big and small tasks with a positive attitude, strong effort, and a commitment to improve."],
  ["sat-p032", "I show up with a positive attitude and give my full effort, no matter how simple or challenging the task may be."],
  ["sat-p033", "I believe in my ability to improve, and I put effort into every step with a confident attitude."],
  ["sat-p034", "I bring energy, focus, and a positive mindset to each challenge I face."],
  ["sat-p035", "I give my best effort with a willing heart and a determined attitude."],
  ["sat-p036", "I choose to stay positive, work hard, and keep trying until I grow stronger."],
  ["sat-p037", "I approach every task with purpose, patience, and the effort needed to succeed."],
  ["sat-p038", "I turn challenges into opportunities by keeping a strong attitude and giving steady effort."],
  ["sat-p039", "I am capable of great progress when I combine a positive mindset with consistent effort."],
  ["sat-p040", "I take pride in showing up, staying focused, and giving my best in all I do."],
  ["sat-p041", "I meet each day with optimism, determination, and the effort to become better than I was yesterday."],
  ["sat-p042", "I can turn negative thoughts into a positive attitude and meet each task with earnest effort."],
  ["sat-p043", "When doubt appears, I choose a hopeful mindset and give my best effort anyway."],
  ["sat-p044", "I release discouraging thoughts and replace them with patience, confidence, and steady effort."],
  ["sat-p045", "I have the power to shift my mindset and approach challenges with honest effort."],
  ["sat-p046", "When my thoughts feel heavy, I choose positivity and take one strong step forward."],
  ["sat-p047", "I transform frustration into focus and bring sincere effort to whatever is in front of me."],
  ["sat-p048", "I do not have to believe every negative thought; I can choose a better attitude and keep trying."],
  ["sat-p049", "I turn I cannot into I will try, and I support that choice with real effort."],
  ["sat-p050", "I meet negative thoughts with courage, a positive attitude, and the willingness to do my best."],
  ["sat-p051", "I can change my inner voice, strengthen my attitude, and give earnest effort one moment at a time."],
  ["sat-p152", "I can meet new people with kindness, confidence, and a steady belief that I belong."],
  ["sat-p153", "I am brave enough to say hello and open enough to let real connection grow."],
  ["sat-p154", "I bring warmth, respect, and confidence into the way I talk with others."],
  ["sat-p155", "I can be myself and still make space for new friendships to form."],
  ["sat-p156", "I choose to show up with a friendly attitude and a brave, open heart."],
  ["sat-p157", "I am learning how to connect with others through kindness, listening, and steady courage."],
  ["sat-p158", "I can start small conversations with confidence and let them grow naturally."],
  ["sat-p159", "I trust that my kindness, humor, and effort can help people feel comfortable around me."],
  ["sat-p160", "I am determined to keep showing up as someone friendly, respectful, and real."],
  ["sat-p161", "I can look for common ground and build connection one honest moment at a time."],
  ["sat-p162", "I speak with confidence, listen with care, and treat others with respect."],
  ["sat-p163", "I can join in with courage and bring good energy to the people around me."],
  ["sat-p164", "I am worthy of friendship, belonging, and people who appreciate the real me."],
  ["sat-p165", "I can be patient while friendships grow and still stay confident in who I am."],
  ["sat-p166", "I bring courage to introductions and kindness to every conversation."],
  ["sat-p167", "I can make others feel seen by listening, smiling, and being present."],
  ["sat-p168", "I choose connection over hiding and confidence over holding myself back."],
  ["sat-p169", "I am becoming more comfortable starting conversations and sharing who I am."],
  ["sat-p170", "I can offer kindness first and trust that good friendships can grow from small moments."],
  ["sat-p171", "I carry myself with quiet confidence and invite connection through how I treat people."],
  ["sat-p172", "I can be friendly without forcing anything, and open without changing who I am."],
  ["sat-p173", "I am determined to practice friendship skills with patience, courage, and care."],
  ["sat-p174", "I can ask thoughtful questions and listen closely to the answers."],
  ["sat-p175", "I bring a confident smile, a kind voice, and a willing attitude into new spaces."],
  ["sat-p176", "I can find my people by being honest, kind, and brave enough to connect."],
  ["sat-p177", "I respect myself, respect others, and build friendships from that strong place."],
  ["sat-p178", "I can share my thoughts with confidence and make room for others to share too."],
  ["sat-p179", "I am allowed to take up space in a group with kindness and confidence."],
  ["sat-p180", "I can choose friends who bring out my best and help me feel safe to be myself."],
  ["sat-p181", "I bring steady determination to becoming a better friend and a more confident person."],
  ["sat-p182", "I can connect through shared interests, simple questions, and genuine attention."],
  ["sat-p183", "I believe my presence can add something good to the room."],
  ["sat-p184", "I can practice being approachable by staying relaxed, kind, and open."],
  ["sat-p185", "I am strong enough to be kind first and confident enough to keep trying."],
  ["sat-p186", "I can build real friendships through trust, respect, laughter, and time."],
  ["sat-p187", "I choose to notice opportunities to connect and take one brave step toward them."],
  ["sat-p188", "I can bring positive energy without pretending to be anyone else."],
  ["sat-p189", "I am learning that friendship grows best when I am patient, honest, and kind."],
  ["sat-p190", "I can stand in my confidence while still being gentle with other people."],
  ["sat-p191", "I bring courage to joining in and determination to keep growing socially."],
  ["sat-p192", "I can make a good first move by being friendly, curious, and respectful."],
  ["sat-p193", "I trust that the right friendships can grow as I keep being kind and real."],
  ["sat-p194", "I can include others, welcome others, and help connection feel easier."],
  ["sat-p195", "I am confident enough to be myself and caring enough to notice others."],
  ["sat-p196", "I can keep my heart open while choosing friendships with respect and care."],
  ["sat-p197", "I show courage when I reach out, listen well, and give friendship a chance."],
  ["sat-p198", "I can grow more confident in groups by taking one calm, friendly step at a time."],
  ["sat-p199", "I bring value to friendships by being loyal, thoughtful, and true to myself."],
  ["sat-p200", "I am ready to connect with courage, speak with kindness, and belong as myself."],
  ["sat-p201", "I choose confidence, determination, and genuine connection in the way I meet the world."],
];

const phraseDisplayTitles = [
  "Ready Starts",
  "Name The Thought",
  "Show Up Anyway",
  "Mistakes Are Feedback",
  "Try Again Smaller",
  "One Thing",
  "Confidence Grows",
  "Quiet Best",
  "Calm Effort",
  "Next Right Action",
  "Positive Attitude",
  "Direction And Effort",
  "Patient Focus",
  "Strengthen Effort",
  "Willing Attitude",
  "Stay Optimistic",
  "Effort Matters",
  "Strong Setback",
  "Proud Effort",
  "Keep Improving",
  "Best Effort",
  "Every Challenge",
  "Strong And Steady",
  "Confidence And Patience",
  "Finish Positive",
  "Keep Moving",
  "Trust The Effort",
  "Focus And Positivity",
  "Honest Effort",
  "Determination",
  "Big Or Small",
  "Show Up Fully",
  "Believe And Improve",
  "Energy And Focus",
  "Willing Heart",
  "Keep Trying",
  "Purpose And Patience",
  "Challenges To Opportunity",
  "Great Progress",
  "Take Pride",
  "Better Than Yesterday",
  "Thoughts To Effort",
  "Doubt To Hope",
  "Release Discouragement",
  "Shift Mindset",
  "One Strong Step",
  "Frustration To Focus",
  "Choose Better",
  "I Will Try",
  "Courage And Effort",
  "Change Inner Voice",
  "Kind Belonging",
  "Say Hello",
  "Warm Respect",
  "Be Myself",
  "Friendly Heart",
  "Listening Courage",
  "Small Conversations",
  "Comfortable Around Me",
  "Friendly And Real",
  "Common Ground",
  "Speak And Listen",
  "Join In",
  "Worthy Of Friendship",
  "Patient Friendships",
  "Kind Introductions",
  "Make Others Seen",
  "Choose Connection",
  "Share Who I Am",
  "Kindness First",
  "Quiet Confidence",
  "Friendly Without Forcing",
  "Friendship Skills",
  "Thoughtful Questions",
  "New Spaces",
  "Find My People",
  "Respect Builds",
  "Share And Make Room",
  "Take Up Space",
  "Safe To Be Myself",
  "Better Friend",
  "Shared Interests",
  "Add Good",
  "Approachable",
  "Kind First",
  "Real Friendships",
  "Brave Step",
  "Positive Energy",
  "Patient And Kind",
  "Confident And Gentle",
  "Growing Socially",
  "Good First Move",
  "Right Friendships",
  "Include Others",
  "Caring Confidence",
  "Open Heart",
  "Reach Out",
  "Confident In Groups",
  "Loyal And True",
  "Belong As Myself",
  "Meet The World",
];

const phraseSubcategories = [
  {
    id: "readiness",
    title: "Readiness & next action",
    category: "Attitude & Effort",
    phraseIds: attitudeEffortPhraseIds.slice(0, 10),
  },
  {
    id: "attitude-foundation",
    title: "Attitude foundation",
    category: "Attitude & Effort",
    phraseIds: attitudeEffortPhraseIds.slice(10, 20),
  },
  {
    id: "challenge-response",
    title: "Challenge response",
    category: "Attitude & Effort",
    phraseIds: attitudeEffortPhraseIds.slice(20, 31),
  },
  {
    id: "showing-up",
    title: "Showing up & growth",
    category: "Attitude & Effort",
    phraseIds: attitudeEffortPhraseIds.slice(31, 41),
  },
  {
    id: "thought-reset",
    title: "Thought reset",
    category: "Attitude & Effort",
    phraseIds: attitudeEffortPhraseIds.slice(41, 51),
  },
  {
    id: "connection-starting",
    title: "Starting connection",
    category: "Confidence & Connection",
    phraseIds: connectionPhraseIds.slice(0, 10),
  },
  {
    id: "conversation-care",
    title: "Conversation & care",
    category: "Confidence & Connection",
    phraseIds: connectionPhraseIds.slice(10, 20),
  },
  {
    id: "friendship-growth",
    title: "Friendship growth",
    category: "Confidence & Connection",
    phraseIds: connectionPhraseIds.slice(20, 30),
  },
  {
    id: "belonging-energy",
    title: "Belonging & energy",
    category: "Confidence & Connection",
    phraseIds: connectionPhraseIds.slice(30, 40),
  },
  {
    id: "social-courage",
    title: "Social courage",
    category: "Confidence & Connection",
    phraseIds: connectionPhraseIds.slice(40, 50),
  },
];
const phraseSubcategoryByPhraseId = new Map(
  phraseSubcategories.flatMap((subcategory) => (
    subcategory.phraseIds.map((phraseId) => [phraseId, subcategory])
  ))
);

function slugifyPhraseTitle(value) {
  return value
    .toLowerCase()
    .replace(/\bi\b/g, "")
    .replace(/\bmy\b/g, "")
    .replace(/\bthe\b/g, "")
    .replace(/\ba\b/g, "")
    .replace(/\ban\b/g, "")
    .replace(/\bcannot\b/g, "cant")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .filter(Boolean)
    .slice(0, 4)
    .join("-");
}

function phraseHandle(phraseId, title) {
  const connectionIndex = connectionPhraseIds.indexOf(phraseId);
  if (connectionIndex >= 0) {
    return `cc-${String(connectionIndex + 1).padStart(4, "0")}-${slugifyPhraseTitle(title)}`;
  }

  const attitudeEffortIndex = attitudeEffortPhraseIds.indexOf(phraseId);
  return `ae-${String(attitudeEffortIndex + 1).padStart(4, "0")}-${slugifyPhraseTitle(title)}`;
}

const sourceCutGroups = [
  { trackId: "sat-l001", title: "Attitude & Effort", count: 11 },
  { trackId: "sat-l002", title: "Negative to Action", count: 7 },
  { trackId: "sat-l003", title: "Show Up", count: 10 },
  { trackId: "sat-l004", title: "Mistakes Grow", count: 11 },
  { trackId: "sat-l005", title: "Try Again", count: 4 },
  { trackId: "sat-l006", title: "Focus", count: 11 },
  { trackId: "sat-l009", title: "Calm Effort Source", count: 30 },
];

const sourceCutChoices = sourceCutGroups.flatMap((group) => (
  Array.from({ length: group.count }, (_, index) => {
    const cutNumber = String(index + 1).padStart(3, "0");
    return {
      id: `loop-source-${group.trackId}-cut-${cutNumber}`,
      title: `${group.title} cut ${index + 1}`,
      file: `assets/audio/voices/source-mp3-v001/${group.trackId}-source-mp3-v001-cut-${cutNumber}.mp3`,
      source: "source-cut",
    };
  })
));

const brianPhraseFiles = Object.fromEntries(
  phraseIds.map((phraseId) => {
    return [
      phraseId,
      `assets/audio/voices/brian-v001/${phraseId}-brian-v001-take-v001-norm.mp3`,
    ];
  })
);

const phraseLibraryChoices = phraseLibrary.map(([phraseId, title], index) => ({
  id: `loop-phrase-${phraseId}`,
  title: phraseHandle(phraseId, title),
  displayTitle: phraseDisplayTitles[index],
  phraseText: title,
  file: brianPhraseFiles[phraseId],
  phraseId,
  category: phraseSubcategoryByPhraseId.get(phraseId)?.category ?? "Attitude & Effort",
  subcategory: phraseSubcategoryByPhraseId.get(phraseId)?.title ?? "Attitude & Effort",
  subcategoryId: phraseSubcategoryByPhraseId.get(phraseId)?.id ?? "attitude-effort",
  source: "phrase-library",
}));
const phraseLibraryChoiceIds = phraseLibraryChoices.map((choice) => choice.id);
const phraseLibraryByPhraseId = new Map(phraseLibraryChoices.map((choice) => [choice.phraseId, choice]));
let customRecordedChoices = [];

function phraseChoiceIdsForPhraseIds(ids) {
  return ids.map((phraseId) => `loop-phrase-${phraseId}`);
}

function phraseChoiceIdsForCategory(category) {
  return [...phraseLibraryChoices, ...customRecordedChoices]
    .filter((choice) => choice.category === category)
    .map((choice) => choice.id);
}

const builtInMainCategories = [
  { id: "attitude-effort", title: "Attitude & Effort", playlistId: "loop-phrase-library" },
  { id: "confidence-connection", title: "Confidence & Connection", playlistId: "loop-confidence-connection-library" },
];
let mainCategories = [...builtInMainCategories];

const categoryCueWordsByTitle = {
  "Attitude & Effort": ["attitude", "effort"],
  "Confidence & Connection": ["confidence", "connection"],
};
const cuePrimaryPalette = [
  "oklch(62% 0.165 32)",   // anger red
  "oklch(82% 0.125 94)",   // caution yellow
  "oklch(62% 0.088 246)",  // calm blue
  "oklch(60% 0.118 300)",  // attitude purple
  "oklch(76% 0.105 86)",   // effort gold
  "oklch(66% 0.078 205)",  // cyan
  "oklch(82% 0.032 89)",   // warm white
];
const cueWordColors = {
  anger: cuePrimaryPalette[0],
  caution: cuePrimaryPalette[1],
  attitude: cuePrimaryPalette[3],
  effort: cuePrimaryPalette[4],
  confidence: cuePrimaryPalette[2],
  connection: "oklch(65% 0.270 285)",
  default: cuePrimaryPalette[6],
};
const cueWordStopWords = new Set(["and", "or", "the", "a", "an", "my", "i", "to", "of", "in", "with"]);
const CUE_WORD_SECONDS = 0.68;

function displayTitleForChoice(choice) {
  const phraseChoice = choice.phraseId ? phraseLibraryByPhraseId.get(choice.phraseId) : null;
  return phraseChoice?.displayTitle ?? choice.displayTitle ?? choice.title;
}

function cueWordsForCategory(categoryTitle) {
  const builtInWords = categoryCueWordsByTitle[categoryTitle];
  if (builtInWords) return builtInWords;

  return normalizeWhitespace(categoryTitle)
    .toLowerCase()
    .match(/[a-z]+/g)
    ?.filter((word, index, words) => (
      word.length > 2
      && !cueWordStopWords.has(word)
      && words.indexOf(word) === index
    ))
    .slice(0, 3) || ["focus"];
}

function cueWordsForChoice(choice) {
  const categoryWords = cueWordsForCategory(choice?.category || activePhraseCategory());
  const sourceText = normalizeWhitespace([
    choice?.phraseText,
    choice?.displayTitle,
    choice?.title,
  ].filter(Boolean).join(" ")).toLowerCase();
  const spokenWords = sourceText.match(/[a-z]+/g) || [];
  const matchedWords = spokenWords.filter((word) => categoryWords.includes(word));

  return matchedWords.length ? matchedWords : categoryWords;
}

function setActiveCueWords(choice) {
  activeCueWords = cueWordsForChoice(choice);
  activeCueStep = -1;
  activeCueWord = null;
  cueWordIntensity = 0;
  consoleMeter?.style.setProperty("--word-tip-intensity", "0");
}

function cueWordColor(word) {
  if (cueWordColors[word]) return cueWordColors[word];

  const hash = [...String(word || "focus")].reduce((total, character) => (
    (total * 31 + character.charCodeAt(0)) % 360
  ), 0);
  return cuePrimaryPalette[hash % cuePrimaryPalette.length];
}

function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function clearLegacyRecorderState() {
  try {
    LEGACY_RECORDER_STORAGE_KEYS.forEach((storageKey) => {
      localStorage.removeItem(storageKey);
    });
  } catch {
    // If storage is unavailable, the recorder can still run with in-memory state.
  }
}

function decodeRtfUnicodeEscapes(text) {
  return text.replace(/\\u(-?\d+)\??/g, (_, value) => {
    const codePoint = Number(value);
    const normalizedCodePoint = codePoint < 0 ? codePoint + 65536 : codePoint;
    return Number.isFinite(normalizedCodePoint) ? String.fromCharCode(normalizedCodePoint) : "";
  });
}

function stripRtfMarkup(text) {
  let plainText = decodeRtfUnicodeEscapes(String(text ?? ""));
  plainText = plainText
    .replace(/\\'[0-9a-fA-F]{2}/g, " ")
    .replace(/\\(?:par|line)\b-?\d* ?/g, "\n")
    .replace(/\\tab\b-?\d* ?/g, " ")
    .replace(/\\[a-zA-Z]+-?\d* ?/g, "")
    .replace(/\\[^a-zA-Z0-9]/g, "")
    .replace(/[{}]/g, "");

  return plainText;
}

function phraseFileText(file, text) {
  const fileName = file?.name || "";
  const fileType = file?.type || "";
  const hasRtfSignature = /^\s*{\s*\\rtf/i.test(text);
  const isRtf = /\.rtf$/i.test(fileName) || /rtf/i.test(fileType) || hasRtfSignature;

  return isRtf ? stripRtfMarkup(text) : String(text ?? "");
}

function customPhraseInputText(value) {
  const text = String(value ?? "");
  return /^\s*{\s*\\rtf/i.test(text)
    ? normalizeWhitespace(phraseFileText({ name: "pasted.rtf", type: "text/rtf" }, text))
    : text;
}

function savedCustomPhraseText(value) {
  return normalizeWhitespace(customPhraseInputText(value));
}

function titleCaseFromWords(value) {
  const words = normalizeWhitespace(value).split(" ").filter(Boolean).slice(0, 5);
  if (!words.length) return "Custom Phrase";

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function customCategoryId(title) {
  return `recorded-${slugifyPhraseTitle(title) || "affirmations"}`;
}

function customPlaylistId(title) {
  return `loop-${customCategoryId(title)}`;
}

function customRecordedCategoryTitles() {
  return [...new Set(customRecordedChoices.map((choice) => choice.category).filter(Boolean))];
}

function categoryTitlesForCustomRecorder() {
  const activeCustomCategory = normalizeWhitespace(recorderCustomCategory);
  const activeCategoryShouldStayVisible = (
    activeCustomCategory
    && activeCustomCategory !== NEW_CUSTOM_CATEGORY_VALUE
    && activeCustomCategory !== DEFAULT_CUSTOM_RECORDED_CATEGORY
    && !builtInMainCategories.some((category) => category.title === activeCustomCategory)
  );

  return [
    DEFAULT_CUSTOM_RECORDED_CATEGORY,
    ...builtInMainCategories.map((category) => category.title),
    ...(activeCategoryShouldStayVisible ? [activeCustomCategory] : []),
    ...customRecordedCategoryTitles(),
  ].filter((title, index, titles) => title && titles.indexOf(title) === index);
}

function syncMainCategories() {
  const customCategories = customRecordedCategoryTitles().map((title) => ({
    id: customCategoryId(title),
    title,
    playlistId: customPlaylistId(title),
  }));

  mainCategories = [...builtInMainCategories, ...customCategories];
}

function syncCustomRecordedPlaylists() {
  syncMainCategories();

  const customCategoryTitles = customRecordedCategoryTitles();
  const activeCustomPlaylistIds = new Set(customCategoryTitles.map((category) => customPlaylistId(category)));
  playlistsByMode.loop = playlistsByMode.loop.filter((playlist) => (
    !playlist.id.startsWith("loop-recorded-") || activeCustomPlaylistIds.has(playlist.id)
  ));

  customCategoryTitles.forEach((category) => {
    const playlistId = customPlaylistId(category);
    const itemIds = customRecordedChoices
      .filter((choice) => choice.category === category)
      .map((choice) => choice.id);
    const existingPlaylist = playlistsByMode.loop.find((playlist) => playlist.id === playlistId);

    if (existingPlaylist) {
      existingPlaylist.name = category;
      existingPlaylist.category = category;
      existingPlaylist.itemIds = itemIds;
      return;
    }

    playlistsByMode.loop.push({
      id: playlistId,
      name: category,
      category,
      itemIds,
    });
  });

  if (!playlistsByMode.loop.some((playlist) => playlist.id === activePlaylistIdByMode.loop)) {
    activePlaylistIdByMode.loop = playlistsByMode.loop[0].id;
  }
}

const kokoroAmericanVoices = [
  { id: "af_bella", label: "Bella", shortLabel: "Bella", group: "Female" },
  { id: "af_heart", label: "Heart", shortLabel: "Heart", group: "Female" },
  { id: "af_jessica", label: "Jessica", shortLabel: "Jessica", group: "Female" },
  { id: "af_sarah", label: "Sarah", shortLabel: "Sarah", group: "Female" },
  { id: "am_echo", label: "Echo", shortLabel: "Echo", group: "Male" },
  { id: "am_eric", label: "Eric", shortLabel: "Eric", group: "Male" },
  { id: "am_michael", label: "Michael", shortLabel: "Michael", group: "Male" },
  { id: "am_puck", label: "Puck", shortLabel: "Puck", group: "Male" },
];

const coreVoiceAliases = [
  { id: "core-mara-v001", label: "Mara", shortLabel: "Mara", group: "Female", sourceVoiceId: "af_nicole" },
  { id: "core-theo-v001", label: "Theo", shortLabel: "Theo", group: "Male", sourceVoiceId: "am_michael" },
];

const KOKORO_AUDIO_VERSION = "all-kokoro-preserve-ending-20260705";
const RECORDED_AUDIO_VERSION = "recorded-v001";

const recordedVoicePacks = [
  // Add free/offline recorded packs after processing them with scripts/process_recorded_voice.py.
  // { id: "antonio-v001", label: "Antonio", shortLabel: "Antonio", group: "Recorded" },
];
const browserRecordedPhraseUrls = new Map();
const browserRecordedPhraseMetadata = new Map();
let recordedVoiceDatabasePromise = null;
let recorderCategory = "Confidence & Connection";
let recorderIndex = 0;
let recorderMode = "guided";
let recorderCustomCategory = DEFAULT_CUSTOM_RECORDED_CATEGORY;
let recorderCustomNewCategory = "";
let recorderCustomPhrase = "";
let recorderCustomLastPhraseId = null;
let recorderCustomPhraseQueue = [];
let recorderCustomQueueIndex = 0;
let mediaRecorder = null;
let recorderStream = null;
let recorderProcessedStream = null;
let recorderAudioContext = null;
let recorderChunks = [];
let isRecordingPhrase = false;
let recorderStartToken = 0;

function kokoroFilesByPhrase(voiceId) {
  return Object.fromEntries(phraseIds.map((phraseId) => [
    phraseId,
    `assets/audio/voices/kokoro-${voiceId}-v001/${phraseId}-kokoro-${voiceId}-v001-take-v001.mp3?v=${KOKORO_AUDIO_VERSION}`,
  ]));
}

function recordedFilesByPhrase(voiceId) {
  return Object.fromEntries(phraseIds.map((phraseId) => [
    phraseId,
    `assets/audio/voices/${voiceId}/${phraseId}-${voiceId}-take-v001.mp3?v=${RECORDED_AUDIO_VERSION}`,
  ]));
}

const baseVoiceOptions = [
  ...coreVoiceAliases.map((voice) => ({
    id: voice.id,
    label: voice.label,
    shortLabel: voice.shortLabel,
    group: voice.group,
    sourceVoiceId: voice.sourceVoiceId,
    status: "ready",
    filesByPhrase: kokoroFilesByPhrase(voice.sourceVoiceId),
  })),
  ...kokoroAmericanVoices.map((voice) => ({
    id: `kokoro-${voice.id}-v001`,
    label: voice.label,
    shortLabel: voice.shortLabel,
    group: voice.group,
    status: "ready",
    filesByPhrase: kokoroFilesByPhrase(voice.id),
  })),
];
let voiceOptions = [...baseVoiceOptions];

let currentMode = "loop";
let activeVoiceId = localStorage.getItem(VOICE_STORAGE_KEY) || voiceOptions[0].id;
let currentResolvedSource = null;
let isSeekingConversation = false;
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
choices.loop.push(...phraseLibraryChoices, ...sourceCutChoices);

let activePlaylistIdByMode = {
  loop: "loop-starter",
  conversation: "conversation-starter",
};
const retiredBuiltInPlaylistIds = new Set([
  "loop-calm-focus-sample",
  "loop-confidence-courage-sample",
]);
let playlistsByMode = {
  loop: [
    {
      id: "loop-starter",
      name: "Starter 10",
      category: "Attitude & Effort",
      itemIds: choices.loop.filter((choice) => choice.source === "starter").map((choice) => choice.id),
    },
    {
      id: "loop-source-cuts",
      name: "Source cuts review",
      category: "Attitude & Effort",
      itemIds: sourceCutChoices.map((choice) => choice.id),
    },
    {
      id: "loop-phrase-library",
      name: "All 51",
      category: "Attitude & Effort",
      itemIds: phraseChoiceIdsForPhraseIds(attitudeEffortPhraseIds),
    },
    {
      id: "loop-confidence-connection-library",
      name: "All 50",
      category: "Confidence & Connection",
      itemIds: phraseChoiceIdsForPhraseIds(connectionPhraseIds),
    },
  ],
  conversation: [
    {
      id: "conversation-starter",
      name: "Category talks",
      itemIds: choices.conversation.map((choice) => choice.id),
    },
  ],
};
const builtInPlaylistsByMode = {
  loop: playlistsByMode.loop.map((playlist) => ({ ...playlist, itemIds: [...playlist.itemIds] })),
  conversation: playlistsByMode.conversation.map((playlist) => ({ ...playlist, itemIds: [...playlist.itemIds] })),
};
let loopOptions = [];
let scrollFrame = null;
let scrollSettleTimer = null;
let activePageIndex = 0;
let pageSwipeStartX = 0;
let pageSwipeStartY = 0;
let pageSwipePointerId = null;
let pageSwipeOffset = 0;
let isPageSwiping = false;
let repeatMode = "all";
let shuffleEnabled = false;
let previewingId = null;
let audioContext = null;
let analyser = null;
let meterSource = null;
let meterData = null;
let meterFrame = null;
let meterBars = [];
let meterLevels = [];
let previousMeterEnergy = 0;
let meterEnergyPulse = 0;
let waveformEmission = 0;
let waveformTrailEnergy = 0;
let waveformHasStarted = false;
const waveformRibbonEnergy = Array.from({ length: 24 }, () => 0);
const waveformRibbonFront = Array.from({ length: 24 }, () => -0.12);
let waveformLastFrameTime = 0;
let waveformContinuousSound = 0;
let waveformQuietTime = 0;
let waveformStyle = localStorage.getItem(WAVEFORM_STYLE_STORAGE_KEY) === "flowing" ? "flowing" : "bars";
let activeCueWords = [];
let activeCueStep = -1;
let activeCueWord = null;
let cueWordIntensity = 0;

loadSavedPlaylistConfiguration();
ensureBuiltInPlaylists();

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

function activeVoice() {
  return voiceOptions.find((voice) => voice.id === activeVoiceId) ?? voiceOptions[0];
}

function voiceWaveformHue(voice = activeVoice()) {
  if (voice?.group === "Male" || voice?.sourceVoiceId?.startsWith("am_")) return 225;
  return 275;
}

function cssWaveformHue(voiceHue = voiceWaveformHue()) {
  return voiceHue === 225 ? 350 : 326;
}

function currentCssWaveformHue() {
  return cssWaveformHue();
}

function updateWaveformHue() {
  const hue = voiceWaveformHue();
  const cssHue = cssWaveformHue(hue);
  const tipHue = (cssHue + 12) % 360;
  const upperHue = (cssHue + 8) % 360;
  const lowerHue = (cssHue + 340) % 360;
  document.documentElement.style.setProperty("--wave-hue", cssHue.toFixed(0));
  document.documentElement.style.setProperty("--wave-lip-tip", `oklch(80% 0.280 ${tipHue.toFixed(0)} / 0.99)`);
  document.documentElement.style.setProperty("--wave-lip-top", `oklch(71% 0.250 ${cssHue.toFixed(0)} / 0.98)`);
  document.documentElement.style.setProperty("--wave-lip-upper", `oklch(66% 0.220 ${upperHue.toFixed(0)} / 0.97)`);
  document.documentElement.style.setProperty("--wave-lip-bottom", `oklch(50% 0.190 ${lowerHue.toFixed(0)} / 0.97)`);
  document.documentElement.style.setProperty("--wave-glow", `oklch(64% 0.210 ${cssHue.toFixed(0)})`);
  document.documentElement.style.setProperty("--word-tip-color", `oklch(81% 0.280 ${tipHue.toFixed(0)})`);
  meterBars?.forEach((bar, index) => applyMeterBarColorVars(bar, index));
}

function baseOutputVolume() {
  const sliderPosition = clamp(Number(volumeControl.value), 0, 100) / 100;
  return sliderPosition * sliderPosition;
}

const RECORDED_VOICE_VOLUME_BOOST = 1.8;

function recordedVoiceOutputVolume(baseVolume = baseOutputVolume()) {
  return clamp(baseVolume * RECORDED_VOICE_VOLUME_BOOST, 0, 1);
}

function outputVolumeForSource(source, baseVolume = baseOutputVolume()) {
  return source?.isBrowserRecordedVoiceFile ? recordedVoiceOutputVolume(baseVolume) : baseVolume;
}

function resolveAudioSource(choice) {
  const voice = activeVoice();
  const voiceFile = currentMode === "loop" && choice.phraseId ? voice.filesByPhrase[choice.phraseId] : null;
  const fallbackVoiceFile = currentMode === "loop" && choice.phraseId ? voice.fallbackFilesByPhrase?.[choice.phraseId] : null;
  const resolvedVoiceFile = voiceFile || fallbackVoiceFile;

  return {
    file: resolvedVoiceFile || choice.file,
    isVoiceFile: Boolean(resolvedVoiceFile),
    isBrowserRecordedVoiceFile: voice.id === BROWSER_RECORDED_VOICE_ID && Boolean(voiceFile),
    isBrowserRecordedVoiceFallback: voice.id === BROWSER_RECORDED_VOICE_ID && !voiceFile && Boolean(fallbackVoiceFile),
    voice,
  };
}

function updateVoiceStatus(choice = currentChoices()[selectedIndexByMode[currentMode]]) {
  if (!voiceStatus || !choice) return;

  const { isVoiceFile, isBrowserRecordedVoiceFallback, voice } = resolveAudioSource(choice);
  voiceStatus.classList.toggle("is-pending", currentMode !== "conversation" && !isVoiceFile);

  if (isBrowserRecordedVoiceFallback) {
    voiceStatus.textContent = "My Voice partial";
    return;
  }

  if (isVoiceFile) {
    voiceStatus.textContent = `${voice.shortLabel} ready`;
    return;
  }

  voiceStatus.textContent = currentMode === "conversation"
    ? "Mara + Theo"
    : (choice.phraseId ? `${voice.shortLabel} not rendered` : "Source audio");
}

function renderVoiceOptions() {
  if (!voiceSelect) return;

  const visibleVoiceOptions = voiceOptions.filter((voice) => voice.group === "Female" || voice.group === "Male");
  const validVoiceIds = new Set(visibleVoiceOptions.map((voice) => voice.id));
  if (!validVoiceIds.has(activeVoiceId)) {
    activeVoiceId = visibleVoiceOptions[0].id;
    localStorage.setItem(VOICE_STORAGE_KEY, activeVoiceId);
  }

  const voiceGroups = ["Female", "Male"].map((group) => ({
    group,
    voices: visibleVoiceOptions.filter((voice) => voice.group === group),
  })).filter(({ voices }) => voices.length);

  voiceSelect.innerHTML = voiceGroups
    .map(({ group, voices }) => (
      `<optgroup label="${escapeHTML(group)}">` +
      voices.map((voice) => {
        const selected = voice.id === activeVoiceId ? " selected" : "";
        return `<option value="${voice.id}"${selected}>${escapeHTML(voice.label)}</option>`;
      }).join("") +
      "</optgroup>"
    ))
    .join("");
  updateVoiceControlMode();
}

function setVoice(voiceId) {
  if (currentMode === "conversation") return;

  const shouldResume = !activeMainMedia().paused;

  activeVoiceId = voiceOptions.some((voice) => voice.id === voiceId) ? voiceId : voiceOptions[0].id;
  localStorage.setItem(VOICE_STORAGE_KEY, activeVoiceId);
  if (voiceSelect) {
    voiceSelect.value = activeVoiceId;
  }
  updateWaveformHue();
  syncSelection({ scrollBehavior: "auto", updateAudio: true });

  if (shouldResume) {
    const media = activeMainMedia();
    media.currentTime = 0;
    media.play().catch(() => setPlayingState(false));
  }
}

function updateVoiceControlMode() {
  if (!voiceSelect || !voiceControl) return;

  const isFixedConversationVoice = currentMode === "conversation";
  voiceSelect.disabled = isFixedConversationVoice;
  voiceSelect.setAttribute("aria-disabled", String(isFixedConversationVoice));
  voiceSelect.setAttribute("aria-label", isFixedConversationVoice ? "Conversation voices, Mara and Theo" : "Choose voice");
  voiceControl.classList.toggle("is-fixed", isFixedConversationVoice);
}

function recordedKey(phraseId) {
  return `${BROWSER_RECORDED_VOICE_ID}:${phraseId}`;
}

function makeCustomPhraseId() {
  return `sat-custom-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function metadataForRecording(recording) {
  return {
    source: recording.source,
    category: recording.category,
    phraseText: recording.phraseText,
    displayTitle: recording.displayTitle,
    title: recording.title,
    updatedAt: recording.updatedAt,
  };
}

function isCustomRecordedMetadata(metadata) {
  return metadata?.source === CUSTOM_RECORDED_SOURCE;
}

function customRecordedChoiceFromMetadata(phraseId, metadata) {
  const phraseText = normalizeWhitespace(metadata.phraseText);
  const displayTitle = normalizeWhitespace(metadata.displayTitle) || titleCaseFromWords(phraseText);
  const category = normalizeWhitespace(metadata.category) || DEFAULT_CUSTOM_RECORDED_CATEGORY;
  const title = normalizeWhitespace(metadata.title) || `my-${slugifyPhraseTitle(displayTitle) || "affirmation"}`;

  return {
    id: `loop-custom-recorded-${phraseId}`,
    title,
    displayTitle,
    phraseText,
    file: browserRecordedPhraseUrls.get(phraseId),
    phraseId,
    category,
    subcategory: category,
    subcategoryId: customCategoryId(category),
    source: CUSTOM_RECORDED_SOURCE,
  };
}

function rebuildCustomRecordedChoices() {
  customRecordedChoices = [...browserRecordedPhraseMetadata.entries()]
    .filter(([, metadata]) => isCustomRecordedMetadata(metadata))
    .sort((a, b) => String(a[1].updatedAt ?? "").localeCompare(String(b[1].updatedAt ?? "")))
    .map(([phraseId, metadata]) => customRecordedChoiceFromMetadata(phraseId, metadata));

  choices.loop = choices.loop
    .filter((choice) => choice.source !== CUSTOM_RECORDED_SOURCE)
    .concat(customRecordedChoices);
  syncCustomRecordedPlaylists();
}

function openRecordedVoiceDatabase() {
  if (recordedVoiceDatabasePromise) {
    return recordedVoiceDatabasePromise;
  }

  recordedVoiceDatabasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(RECORDED_VOICE_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(RECORDED_VOICE_STORE)) {
        database.createObjectStore(RECORDED_VOICE_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return recordedVoiceDatabasePromise;
}

async function withRecordedVoiceStore(mode, action) {
  const database = await openRecordedVoiceDatabase();
  const transaction = database.transaction(RECORDED_VOICE_STORE, mode);
  const store = transaction.objectStore(RECORDED_VOICE_STORE);
  const request = action(store);

  return new Promise((resolve, reject) => {
    let result;
    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

async function loadBrowserRecordedPhrases() {
  if (!("indexedDB" in window)) {
    syncBrowserRecordedVoiceOption();
    return;
  }

  const recordings = await withRecordedVoiceStore("readonly", (store) => store.getAll());

  browserRecordedPhraseUrls.forEach((url) => URL.revokeObjectURL(url));
  browserRecordedPhraseUrls.clear();
  browserRecordedPhraseMetadata.clear();

  recordings
    .filter((recording) => recording?.voiceId === BROWSER_RECORDED_VOICE_ID && recording.blob instanceof Blob)
    .forEach((recording) => {
      browserRecordedPhraseUrls.set(recording.phraseId, URL.createObjectURL(recording.blob));
      browserRecordedPhraseMetadata.set(recording.phraseId, metadataForRecording(recording));
    });

  rebuildCustomRecordedChoices();
  syncBrowserRecordedVoiceOption();
  renderPlaylistControls();
  renderWheel();
  renderPlaylistEditor();
}

async function saveBrowserRecordedPhrase(phraseId, blob, metadata = {}) {
  const updatedAt = new Date().toISOString();
  await withRecordedVoiceStore("readwrite", (store) => store.put({
    id: recordedKey(phraseId),
    voiceId: BROWSER_RECORDED_VOICE_ID,
    phraseId,
    blob,
    type: blob.type,
    ...metadata,
    updatedAt,
  }));

  const previousUrl = browserRecordedPhraseUrls.get(phraseId);
  if (previousUrl) {
    URL.revokeObjectURL(previousUrl);
  }

  browserRecordedPhraseUrls.set(phraseId, URL.createObjectURL(blob));
  browserRecordedPhraseMetadata.set(phraseId, {
    ...metadata,
    updatedAt,
  });
  rebuildCustomRecordedChoices();
  syncBrowserRecordedVoiceOption();
  renderPlaylistControls();
  renderWheel();
  renderPlaylistEditor();
}

async function deleteBrowserRecordedPhrase(phraseId) {
  await withRecordedVoiceStore("readwrite", (store) => store.delete(recordedKey(phraseId)));

  const previousUrl = browserRecordedPhraseUrls.get(phraseId);
  if (previousUrl) {
    URL.revokeObjectURL(previousUrl);
  }

  browserRecordedPhraseUrls.delete(phraseId);
  browserRecordedPhraseMetadata.delete(phraseId);
  rebuildCustomRecordedChoices();
  syncBrowserRecordedVoiceOption();
  renderPlaylistControls();
  renderWheel();
  renderPlaylistEditor();
}

function recordedFilesByBrowserPhrase() {
  return Object.fromEntries(browserRecordedPhraseUrls.entries());
}

function hasAnyBrowserRecordedPhrase() {
  return browserRecordedPhraseUrls.size > 0;
}

function recorderChoicesForCategory(category) {
  return phraseLibraryChoices.filter((choice) => choice.category === category);
}

function customRecordedChoicesForCategory(category = currentCustomRecorderCategory()) {
  return customRecordedChoices.filter((choice) => choice.category === category);
}

function isBuiltInCustomRecorderCategory(category) {
  return builtInMainCategories.some((mainCategory) => mainCategory.title === category);
}

function canDeleteCurrentCustomCategory() {
  if (recorderMode !== "custom") return false;

  const category = currentCustomRecorderCategory();
  const hasSavedRecordings = customRecordedChoicesForCategory(category).length > 0;
  if (hasSavedRecordings) return true;

  return Boolean(
    category
    && category !== DEFAULT_CUSTOM_RECORDED_CATEGORY
    && !isBuiltInCustomRecorderCategory(category)
    && (
      recorderCustomPhraseQueue.length > 0
      || currentCustomPhraseText()
      || normalizeWhitespace(recorderCustomCategory) === category
      || normalizeWhitespace(recorderCustomNewCategory) === category
    )
  );
}

function currentCustomRecorderCategory() {
  const selectedCategory = recorderCustomCategorySelect?.value || recorderCustomCategory;
  if (selectedCategory === NEW_CUSTOM_CATEGORY_VALUE) {
    return normalizeWhitespace(recorderCustomCategoryInput?.value || recorderCustomNewCategory);
  }

  return normalizeWhitespace(selectedCategory) || DEFAULT_CUSTOM_RECORDED_CATEGORY;
}

function currentCustomPhraseText() {
  return normalizeWhitespace(recorderCustomPhraseInput?.value || recorderCustomPhrase);
}

function customLastChoice() {
  return customRecordedChoices.find((choice) => choice.phraseId === recorderCustomLastPhraseId)
    ?? customRecordedChoicesForCategory()[customRecordedChoicesForCategory().length - 1]
    ?? null;
}

function customChoiceForPhrase(category, phraseText) {
  const normalizedPhraseText = normalizeWhitespace(phraseText);
  if (!normalizedPhraseText) return null;

  return customRecordedChoices.find((choice) => (
    choice.category === category && normalizeWhitespace(choice.phraseText) === normalizedPhraseText
  )) ?? null;
}

function pendingCustomChoice() {
  const phraseText = currentCustomPhraseText();
  const category = currentCustomRecorderCategory() || DEFAULT_CUSTOM_RECORDED_CATEGORY;
  const existingChoice = customChoiceForPhrase(category, phraseText);

  if (existingChoice) {
    return existingChoice;
  }

  return {
    id: "pending-custom-recording",
    title: "my-custom-affirmation",
    displayTitle: titleCaseFromWords(phraseText),
    phraseText: phraseText || "Write a custom phrase, then record it here.",
    phraseId: "",
    category,
    source: CUSTOM_RECORDED_SOURCE,
  };
}

function validRecorderCategory(category) {
  return mainCategories.some((mainCategory) => mainCategory.title === category);
}

function hasCompleteBrowserRecordedCategory(category) {
  const phraseIdsForCategory = recorderChoicesForCategory(category).map((choice) => choice.phraseId);

  return phraseIdsForCategory.length > 0
    && phraseIdsForCategory.every((phraseId) => browserRecordedPhraseUrls.has(phraseId));
}

function hasAnyCompleteBrowserRecordedCategory() {
  return mainCategories.some((category) => hasCompleteBrowserRecordedCategory(category.title));
}

function syncBrowserRecordedVoiceOption() {
  const recordedOption = hasAnyBrowserRecordedPhrase()
    ? [{
      id: BROWSER_RECORDED_VOICE_ID,
      label: "My Voice",
      shortLabel: "My Voice",
      group: "Recorded",
      status: "ready",
      filesByPhrase: recordedFilesByBrowserPhrase(),
      fallbackFilesByPhrase: kokoroFilesByPhrase(BROWSER_RECORDED_FALLBACK_VOICE_ID),
    }]
    : [];

  voiceOptions = [...recordedOption, ...baseVoiceOptions];

  if (!voiceOptions.some((voice) => voice.id === activeVoiceId)) {
    activeVoiceId = voiceOptions[0].id;
    localStorage.setItem(VOICE_STORAGE_KEY, activeVoiceId);
  }

  renderVoiceOptions();
  updateVoiceStatus();
  updateWaveformHue();
}

function recorderChoices() {
  if (recorderMode === "custom") {
    return customRecordedChoicesForCategory();
  }

  return recorderChoicesForCategory(recorderCategory);
}

function recorderChoice() {
  if (recorderMode === "custom") {
    return currentCustomPhraseText()
      ? pendingCustomChoice()
      : (customLastChoice() ?? pendingCustomChoice());
  }

  const choicesForRecorder = recorderChoices();
  return choicesForRecorder[Math.min(Math.max(recorderIndex, 0), Math.max(choicesForRecorder.length - 1, 0))];
}

function recorderRecordedCount() {
  if (recorderMode === "custom") {
    return customRecordedChoicesForCategory().length;
  }

  return recorderChoices().filter((choice) => browserRecordedPhraseUrls.has(choice.phraseId)).length;
}

function isRecorderCategoryComplete() {
  if (recorderMode === "custom") {
    return recorderRecordedCount() > 0;
  }

  return hasCompleteBrowserRecordedCategory(recorderCategory);
}

function firstOpenRecorderIndex(category = recorderCategory) {
  const choicesForRecorder = recorderChoicesForCategory(category);
  const openIndex = choicesForRecorder.findIndex((choice) => !browserRecordedPhraseUrls.has(choice.phraseId));
  return openIndex >= 0 ? openIndex : 0;
}

function nextOpenRecorderIndex(afterIndex = recorderIndex) {
  const choicesForRecorder = recorderChoices();
  if (!choicesForRecorder.length) return 0;

  for (let offset = 1; offset <= choicesForRecorder.length; offset += 1) {
    const index = (afterIndex + offset) % choicesForRecorder.length;
    const choice = choicesForRecorder[index];
    if (!browserRecordedPhraseUrls.has(choice.phraseId)) {
      return index;
    }
  }

  return Math.min(Math.max(afterIndex, 0), choicesForRecorder.length - 1);
}

function saveRecorderState() {
  localStorage.setItem(RECORDER_STORAGE_KEY, JSON.stringify({
    category: recorderCategory,
    index: recorderIndex,
    mode: recorderMode,
    customCategory: recorderCustomCategory,
    customNewCategory: recorderCustomNewCategory,
    customLastPhraseId: recorderCustomLastPhraseId,
  }));
}

function restoreRecorderState() {
  let category = activePhraseCategory();
  let index = null;

  try {
    const savedState = JSON.parse(localStorage.getItem(RECORDER_STORAGE_KEY));
    if (validRecorderCategory(savedState?.category)) {
      category = savedState.category;
      index = Number.isInteger(savedState.index) ? savedState.index : null;
    }
    if (["guided", "custom"].includes(savedState?.mode)) {
      recorderMode = savedState.mode;
    }
    if (typeof savedState?.customCategory === "string" && savedState.customCategory.trim()) {
      recorderCustomCategory = savedState.customCategory;
    }
    if (typeof savedState?.customNewCategory === "string") {
      recorderCustomNewCategory = savedState.customNewCategory;
    }
    if (typeof savedState?.customLastPhraseId === "string") {
      recorderCustomLastPhraseId = savedState.customLastPhraseId;
    }
  } catch {
    // Ignore corrupt local state and resume from the active category.
  }

  const choicesForRecorder = recorderChoicesForCategory(category);
  recorderCategory = category;
  recorderIndex = index === null
    ? firstOpenRecorderIndex(category)
    : Math.min(Math.max(index, 0), Math.max(choicesForRecorder.length - 1, 0));
  resetCustomTextEntry();
  saveRecorderState();
}

function resetCustomTextEntry() {
  recorderCustomPhrase = "";
  recorderCustomPhraseQueue = [];
  recorderCustomQueueIndex = 0;
  if (recorderCustomPhraseInput) {
    recorderCustomPhraseInput.value = "";
  }
}

function setRecorderMessage(message) {
  if (recorderMessage) {
    recorderMessage.textContent = message;
  }
}

function renderRecorderCategoryOptions() {
  if (!recorderCategorySelect) return;

  recorderCategorySelect.innerHTML = mainCategories.map((category) => {
    const selected = category.title === recorderCategory ? " selected" : "";
    return `<option value="${escapeHTML(category.title)}"${selected}>${escapeHTML(category.title)}</option>`;
  }).join("");
}

function renderRecorderModeControls() {
  recorderModeButtons.forEach((button) => {
    const isSelected = button.dataset.recorderMode === recorderMode;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  if (recorderCustomFields) {
    recorderCustomFields.hidden = recorderMode !== "custom";
  }
  if (recorderCategorySelect) {
    recorderCategorySelect.closest(".recorder-category-select").hidden = recorderMode !== "guided";
  }
}

function renderCustomRecorderCategoryOptions() {
  if (!recorderCustomCategorySelect) return;

  const categoryTitles = categoryTitlesForCustomRecorder();
  const selectedCategory = categoryTitles.includes(recorderCustomCategory)
    ? recorderCustomCategory
    : NEW_CUSTOM_CATEGORY_VALUE;

  recorderCustomCategorySelect.innerHTML = [
    ...categoryTitles.map((category) => {
      const selected = category === selectedCategory ? " selected" : "";
      return `<option value="${escapeHTML(category)}"${selected}>${escapeHTML(category)}</option>`;
    }),
    `<option value="${NEW_CUSTOM_CATEGORY_VALUE}"${selectedCategory === NEW_CUSTOM_CATEGORY_VALUE ? " selected" : ""}>Add new category</option>`,
  ].join("");

  recorderCustomCategorySelect.value = selectedCategory;
  if (recorderCustomCategoryInput) {
    recorderCustomCategoryInput.value = recorderCustomNewCategory;
  }
  if (recorderCustomPhraseInput) {
    recorderCustomPhraseInput.value = recorderCustomPhrase;
  }
  if (recorderNewCategoryField) {
    recorderNewCategoryField.hidden = selectedCategory !== NEW_CUSTOM_CATEGORY_VALUE;
  }
}

const NUMBERED_PHRASE_PREFIX = /^\s*\d+(?:\s*[\).:-]\s*|\s+)/;
const NUMBERED_PHRASE_MARKER = /(?:^|\s)\d+(?:\s*[\).:-]\s*|\s+)/g;

function parsePhraseTextList(text) {
  return String(text ?? "")
    .split(/\r?\n+/)
    .map((line) => normalizeWhitespace(
      line
        .replace(/^[-*•]\s+/, "")
        .replace(NUMBERED_PHRASE_PREFIX, "")
    ))
    .filter((line, index, lines) => line && lines.indexOf(line) === index);
}

function parseNumberedPhraseList(text) {
  const normalizedText = customPhraseInputText(text);
  const normalizedString = String(normalizedText ?? "");
  const markers = [...normalizedString.matchAll(NUMBERED_PHRASE_MARKER)];

  if (markers.length >= 2) {
    return markers
      .map((marker, index) => {
        const phraseStart = marker.index + marker[0].length;
        const phraseEnd = markers[index + 1]?.index ?? normalizedString.length;
        return normalizeWhitespace(normalizedString.slice(phraseStart, phraseEnd));
      })
      .filter((line, index, lines) => line && lines.indexOf(line) === index);
  }

  const lines = normalizedString
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const numberedLines = lines.filter((line) => NUMBERED_PHRASE_PREFIX.test(line));

  if (numberedLines.length < 2 || numberedLines.length !== lines.length) {
    return [];
  }

  return parsePhraseTextList(numberedLines.join("\n"));
}

function queueCustomPhrasesFromText(text) {
  const phrases = parseNumberedPhraseList(text);
  if (!phrases.length) return false;
  const limitedPhrases = phrases.slice(0, STARTER_CUSTOM_PHRASE_LIMIT);

  recorderMode = "custom";
  recorderCustomPhraseQueue = limitedPhrases;
  setCustomQueueIndex(0);
  saveRecorderState();
  setRecorderMessage(
    phrases.length > STARTER_CUSTOM_PHRASE_LIMIT
      ? `Queued the first ${STARTER_CUSTOM_PHRASE_LIMIT} phrases.`
      : `Queued ${limitedPhrases.length} phrase${limitedPhrases.length === 1 ? "" : "s"}.`
  );
  renderVoiceRecorder();
  return true;
}

function setCustomQueueIndex(index) {
  if (!recorderCustomPhraseQueue.length) {
    recorderCustomQueueIndex = 0;
    return;
  }

  recorderCustomQueueIndex = Math.min(Math.max(index, 0), recorderCustomPhraseQueue.length - 1);
  recorderCustomPhrase = savedCustomPhraseText(recorderCustomPhraseQueue[recorderCustomQueueIndex]);
  recorderCustomPhraseQueue[recorderCustomQueueIndex] = recorderCustomPhrase;
  if (recorderCustomPhraseInput) {
    recorderCustomPhraseInput.value = recorderCustomPhrase;
  }
}

function clearCustomPhraseQueue({ keepCurrentPhrase = false } = {}) {
  recorderCustomPhraseQueue = [];
  recorderCustomQueueIndex = 0;
  if (!keepCurrentPhrase) {
    recorderCustomPhrase = "";
  }
  saveRecorderState();
  renderVoiceRecorder();
}

function renderVoiceRecorder() {
  if (!voiceRecorderDialog) return;

  renderRecorderModeControls();
  renderCustomRecorderCategoryOptions();

  const choicesForRecorder = recorderChoices();
  const choice = recorderChoice();
  if (!choice) return;

  const recordedCount = recorderRecordedCount();
  const totalCount = recorderMode === "custom" ? Math.max(choicesForRecorder.length, 1) : choicesForRecorder.length;
  const isCurrentRecorded = browserRecordedPhraseUrls.has(choice.phraseId);
  const isComplete = isRecorderCategoryComplete();
  const hasCustomQueue = recorderCustomPhraseQueue.length > 0;
  const progress = recorderMode === "custom"
    ? (recordedCount > 0 ? 100 : 0)
    : (totalCount ? (recordedCount / totalCount) * 100 : 0);

  renderRecorderCategoryOptions();
  recorderProgressText.textContent = recorderMode === "custom"
    ? `${recordedCount} custom recorded`
    : `${recordedCount} of ${totalCount} recorded`;
  recorderProgressBar.style.setProperty("--recorded-progress", `${progress}%`);
  recorderPositionText.textContent = recorderMode === "custom"
    ? (hasCustomQueue ? `Custom ${recorderCustomQueueIndex + 1} of ${recorderCustomPhraseQueue.length}` : "Custom phrase")
    : `Phrase ${recorderIndex + 1} of ${totalCount}`;
  recorderPhraseState.textContent = isCurrentRecorded ? "Recorded" : (recorderMode === "custom" ? "Ready" : "Open");
  recorderPhraseHandle.textContent = recorderMode === "custom"
    ? (choice.category || DEFAULT_CUSTOM_RECORDED_CATEGORY)
    : choice.title.split("-").slice(0, 2).join("-");
  recorderPhraseTitle.textContent = choice.displayTitle;
  recorderPhraseText.textContent = choice.phraseText;
  previousRecorderPhraseButton.disabled = recorderMode === "custom"
    ? (!hasCustomQueue || recorderCustomQueueIndex === 0)
    : recorderIndex === 0;
  nextRecorderPhraseButton.disabled = recorderMode === "custom"
    ? (!hasCustomQueue || recorderCustomQueueIndex >= recorderCustomPhraseQueue.length - 1)
    : recorderIndex >= totalCount - 1;
  playRecordedPhraseButton.disabled = !isCurrentRecorded;
  retakeRecordedPhraseButton.disabled = !isCurrentRecorded;
  retakeRecordedPhraseButton.textContent = recorderMode === "custom" ? "Delete audio" : "Retake";
  if (clearPhraseQueueButton) {
    clearPhraseQueueButton.disabled = !hasCustomQueue && !currentCustomPhraseText();
  }
  if (deleteCustomCategoryButton) {
    deleteCustomCategoryButton.disabled = !canDeleteCurrentCustomCategory();
  }
  recordPhraseButton.classList.toggle("is-recording", isRecordingPhrase);
  recordPhraseButton.setAttribute("aria-label", isRecordingPhrase ? "Stop recording" : (recorderMode === "custom" ? "Record custom phrase" : "Record phrase"));
  useRecordedVoiceButton.disabled = false;
  useRecordedVoiceButton.textContent = isRecordingPhrase
    ? "Stop recording"
    : recordedCount === 0
    ? "Record phrase"
    : recorderMode === "custom"
    ? "Use recorded category"
    : isComplete
    ? "Use My Voice"
    : "Use partial voice";
}

function stopRecorderStream() {
  recorderProcessedStream?.getTracks().forEach((track) => track.stop());
  recorderProcessedStream = null;
  recorderStream?.getTracks().forEach((track) => track.stop());
  recorderStream = null;

  if (recorderAudioContext && recorderAudioContext.state !== "closed") {
    recorderAudioContext.close().catch(() => {});
  }
  recorderAudioContext = null;
}

function preferredRecorderMimeType() {
  return RECORDER_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported?.(mimeType)) || "";
}

function waitForRecorderWarmup() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, RECORDER_MIC_WARMUP_MS);
  });
}

async function createFilteredRecorderStream(inputStream) {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return inputStream;

  recorderAudioContext = new AudioContextConstructor();
  if (recorderAudioContext.state === "suspended") {
    await recorderAudioContext.resume();
  }

  const source = recorderAudioContext.createMediaStreamSource(inputStream);
  const highPass = recorderAudioContext.createBiquadFilter();
  const lowPass = recorderAudioContext.createBiquadFilter();
  const compressor = recorderAudioContext.createDynamicsCompressor();
  const gain = recorderAudioContext.createGain();
  const destination = recorderAudioContext.createMediaStreamDestination();

  highPass.type = "highpass";
  highPass.frequency.value = 95;
  highPass.Q.value = 0.7;

  lowPass.type = "lowpass";
  lowPass.frequency.value = 7200;
  lowPass.Q.value = 0.6;

  compressor.threshold.value = -32;
  compressor.knee.value = 18;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.006;
  compressor.release.value = 0.22;

  gain.gain.value = 1.18;

  source
    .connect(highPass)
    .connect(lowPass)
    .connect(compressor)
    .connect(gain)
    .connect(destination);

  recorderProcessedStream = destination.stream;
  return recorderProcessedStream;
}

function customRecordingTarget() {
  const category = currentCustomRecorderCategory();
  const phraseText = currentCustomPhraseText();

  if (!category) {
    setRecorderMessage("Add a category for this recording.");
    recorderCustomCategoryInput?.focus();
    return null;
  }

  if (!phraseText) {
    setRecorderMessage("Write the custom phrase first.");
    recorderCustomPhraseInput?.focus();
    return null;
  }

  const existingChoice = customChoiceForPhrase(category, phraseText);
  const phraseId = existingChoice?.phraseId ?? makeCustomPhraseId();
  const displayTitle = titleCaseFromWords(phraseText);

  return {
    phraseId,
    label: displayTitle,
    metadata: {
      source: CUSTOM_RECORDED_SOURCE,
      category,
      phraseText,
      displayTitle,
      title: `my-${slugifyPhraseTitle(displayTitle) || "affirmation"}`,
    },
  };
}

function recorderRecordingTarget() {
  if (recorderMode === "custom") {
    return customRecordingTarget();
  }

  const choice = recorderChoice();
  if (!choice) return null;

  return {
    phraseId: choice.phraseId,
    label: choice.phraseId,
    metadata: {},
  };
}

async function startBrowserPhraseRecording() {
  const target = recorderRecordingTarget();
  if (!target) return;

  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    setRecorderMessage("This browser cannot record audio here.");
    return;
  }

  stopMainMedia();
  previewAudio.pause();
  recorderPreviewAudio.pause();
  const startToken = ++recorderStartToken;
  isRecordingPhrase = true;
  setRecorderMessage(`Getting microphone ready for ${target.label}.`);
  renderVoiceRecorder();

  try {
    recorderStream = await navigator.mediaDevices.getUserMedia({ audio: RECORDER_AUDIO_CONSTRAINTS });
    let recordingStream = recorderStream;
    try {
      recordingStream = await createFilteredRecorderStream(recorderStream);
    } catch (error) {
      console.warn("Recorder audio filtering unavailable, using raw microphone input.", error);
    }

    await waitForRecorderWarmup();
    if (startToken !== recorderStartToken || !isRecordingPhrase) {
      stopRecorderStream();
      renderVoiceRecorder();
      return;
    }

    const mimeType = preferredRecorderMimeType();
    mediaRecorder = new MediaRecorder(recordingStream, mimeType ? { mimeType } : undefined);
    recorderChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data?.size) {
        recorderChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", async () => {
      const blob = new Blob(recorderChunks, { type: mediaRecorder.mimeType || "audio/webm" });
      isRecordingPhrase = false;
      mediaRecorder = null;
      stopRecorderStream();

      try {
        await saveBrowserRecordedPhrase(target.phraseId, blob, target.metadata);
        if (recorderMode === "custom") {
          recorderCustomLastPhraseId = target.phraseId;
        }
        saveRecorderState();
        setRecorderMessage(`Saved ${target.label}. Play it back or tap next.`);
      } catch {
        setRecorderMessage("Could not save this recording.");
      }

      renderVoiceRecorder();
    }, { once: true });

    mediaRecorder.start();
    setRecorderMessage(`Recording ${target.label}.`);
    renderVoiceRecorder();
  } catch {
    isRecordingPhrase = false;
    stopRecorderStream();
    setRecorderMessage("Microphone permission is needed to record your voice.");
    renderVoiceRecorder();
  }
}

function stopBrowserPhraseRecording() {
  recorderStartToken += 1;
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    return;
  }

  isRecordingPhrase = false;
  mediaRecorder = null;
  stopRecorderStream();
  renderVoiceRecorder();
}

function toggleBrowserPhraseRecording() {
  if (isRecordingPhrase) {
    stopBrowserPhraseRecording();
  } else {
    startBrowserPhraseRecording();
  }
}

function goToRecorderPhrase(delta) {
  if (isRecordingPhrase) {
    stopBrowserPhraseRecording();
  }

  recorderPreviewAudio.pause();
  if (recorderMode === "custom") {
    setCustomQueueIndex(recorderCustomQueueIndex + delta);
    saveRecorderState();
    renderVoiceRecorder();
    return;
  }

  recorderIndex = Math.min(Math.max(recorderIndex + delta, 0), Math.max(recorderChoices().length - 1, 0));
  saveRecorderState();
  renderVoiceRecorder();
}

async function playCurrentBrowserRecording() {
  const choice = recorderChoice();
  const file = choice ? browserRecordedPhraseUrls.get(choice.phraseId) : null;
  if (!file) return;

  if (!recorderPreviewAudio.paused) {
    recorderPreviewAudio.pause();
    recorderPreviewAudio.currentTime = 0;
    return;
  }

  stopMainMedia();
  previewAudio.pause();
  recorderPreviewAudio.src = file;
  recorderPreviewAudio.volume = recordedVoiceOutputVolume();
  applyPlaybackTuningToMedia(recorderPreviewAudio, playbackRateFromSpeedSlider());

  try {
    await recorderPreviewAudio.play();
    setRecorderMessage(`Playing ${recorderMode === "custom" ? choice.displayTitle : choice.phraseId}.`);
  } catch {
    setRecorderMessage("Could not play this recording.");
  }
}

async function retakeCurrentBrowserRecording() {
  const choice = recorderChoice();
  if (!choice) return;

  try {
    await deleteBrowserRecordedPhrase(choice.phraseId);
    if (recorderCustomLastPhraseId === choice.phraseId) {
      recorderCustomLastPhraseId = null;
    }
    setRecorderMessage(`Removed ${recorderMode === "custom" ? choice.displayTitle : choice.phraseId}`);
    saveRecorderState();
  } catch {
    setRecorderMessage("Could not remove this take.");
  }

  renderVoiceOptions();
  renderVoiceRecorder();
}

async function deleteCurrentCustomCategory() {
  if (recorderMode !== "custom") return;

  const category = currentCustomRecorderCategory();
  const choicesToDelete = customRecordedChoicesForCategory(category);
  const hasSavedRecordings = choicesToDelete.length > 0;
  if (!choicesToDelete.length) {
    if (!canDeleteCurrentCustomCategory()) {
      setRecorderMessage(`No saved audio in ${category}.`);
      return;
    }
  }

  const shouldDelete = window.confirm(
    hasSavedRecordings
      ? `Delete ${choicesToDelete.length} saved recording${choicesToDelete.length === 1 ? "" : "s"} in ${category}?`
      : `Remove ${category} from the custom recorder?`
  );
  if (!shouldDelete) return;

  try {
    await Promise.all(choicesToDelete.map((choice) => deleteBrowserRecordedPhrase(choice.phraseId)));
    if (recorderCustomCategory === category) {
      recorderCustomCategory = DEFAULT_CUSTOM_RECORDED_CATEGORY;
    }
    if (normalizeWhitespace(recorderCustomNewCategory) === category) {
      recorderCustomNewCategory = "";
    }
    if (recorderCustomLastPhraseId && choicesToDelete.some((choice) => choice.phraseId === recorderCustomLastPhraseId)) {
      recorderCustomLastPhraseId = null;
    }
    if (!hasSavedRecordings || recorderCustomCategory === DEFAULT_CUSTOM_RECORDED_CATEGORY) {
      recorderCustomPhraseQueue = [];
      recorderCustomQueueIndex = 0;
      recorderCustomPhrase = "";
      recorderCustomLastPhraseId = null;
    }
    saveRecorderState();
    setRecorderMessage(`Deleted ${category}.`);
  } catch {
    setRecorderMessage("Could not delete this category.");
  }

  renderVoiceOptions();
  renderVoiceRecorder();
}

function openVoiceRecorder() {
  restoreRecorderState();
  resetCustomTextEntry();
  renderVoiceRecorder();
  setRecorderMessage("");
  goToPage(2);
}

function closeVoiceRecorder() {
  stopBrowserPhraseRecording();
  recorderPreviewAudio.pause();
  goToPage(0);
}

function useBrowserRecordedVoice() {
  if (recorderRecordedCount() === 0) {
    toggleBrowserPhraseRecording();
    return;
  }

  if (isRecordingPhrase) {
    stopBrowserPhraseRecording();
    return;
  }

  if (recorderMode === "custom") {
    const customCategory = currentCustomRecorderCategory();
    const category = mainCategories.find((candidate) => candidate.title === customCategory);
    if (category) {
      activateLoopPlaylist(category.playlistId);
    }
  } else {
    selectCategory(recorderCategory);
  }
  syncBrowserRecordedVoiceOption();
  setVoice(BROWSER_RECORDED_VOICE_ID);
  closeVoiceRecorder();
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
          category: typeof playlist.category === "string" && playlist.category.trim() ? playlist.category.trim() : "Attitude & Effort",
          itemIds: Array.isArray(playlist.itemIds)
            ? playlist.itemIds.filter((itemId) => validIds.has(itemId))
            : [],
        }))
        .filter((playlist) => playlist.itemIds.length && !retiredBuiltInPlaylistIds.has(playlist.id));

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

function ensureBuiltInPlaylists() {
  ["loop", "conversation"].forEach((mode) => {
    const existingIds = new Set(playlistsByMode[mode].map((playlist) => playlist.id));

    builtInPlaylistsByMode[mode].forEach((playlist) => {
      if (existingIds.has(playlist.id)) {
        const existingPlaylist = playlistsByMode[mode].find((candidate) => candidate.id === playlist.id);
        existingPlaylist.name = playlist.name;
        existingPlaylist.category = playlist.category;
        existingPlaylist.itemIds = [...playlist.itemIds];
        return;
      }
      playlistsByMode[mode].push({ ...playlist, itemIds: [...playlist.itemIds] });
    });

    if (!playlistsByMode[mode].some((playlist) => playlist.id === activePlaylistIdByMode[mode])) {
      activePlaylistIdByMode[mode] = playlistsByMode[mode][0].id;
    }
  });
}

function savePlaylistConfiguration() {
  const savedPlaylists = {};

  ["loop", "conversation"].forEach((mode) => {
    const persistentIds = new Set(choices[mode].filter((choice) => choice.source !== "loaded").map((choice) => choice.id));
    savedPlaylists[mode] = playlistsByMode[mode]
      .map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        category: playlist.category,
        itemIds: playlist.itemIds.filter((itemId) => persistentIds.has(itemId)),
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

function volumePercentText(volume) {
  const percent = volume * 100;
  return percent > 0 && percent < 1 ? "under 1 percent" : `${Math.round(percent)} percent`;
}

function updateVolume() {
  const baseVolume = baseOutputVolume();
  volumeControl.setAttribute("aria-valuetext", volumePercentText(baseVolume));
  const currentChoice = currentChoices()[selectedIndexByMode[currentMode]];
  audio.volume = currentChoice ? outputVolumeForSource(resolveAudioSource(currentChoice), baseVolume) : baseVolume;

  const previewChoice = previewingId ? findChoice(previewingId) : null;
  previewAudio.volume = previewChoice ? outputVolumeForSource(resolveAudioSource(previewChoice), baseVolume) : baseVolume;
  recorderPreviewAudio.volume = recordedVoiceOutputVolume(baseVolume);
}

updateVolume();

function adjustVolume(delta) {
  volumeControl.value = String(clamp(Number(volumeControl.value) + delta, 0, 100));
  updateVolume();
}

function setRangeFromPointer(range, clientX) {
  const rect = range.getBoundingClientRect();
  const min = Number(range.min) || 0;
  const max = Number(range.max) || 100;
  const step = Number(range.step) || 1;
  const ratio = clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
  const steppedValue = Math.round((min + ratio * (max - min)) / step) * step;
  range.value = String(clamp(steppedValue, min, max));
}

function handleVolumePointer(event) {
  setRangeFromPointer(volumeControl, event.clientX);
  updateVolume();
}

function startVolumeDrag(event) {
  if (event.target.closest("button")) return;

  event.preventDefault();
  handleVolumePointer(event);
  window.addEventListener("pointermove", handleVolumePointer);
  window.addEventListener("pointerup", stopVolumeDrag, { once: true });
  window.addEventListener("pointercancel", stopVolumeDrag, { once: true });
}

function stopVolumeDrag() {
  window.removeEventListener("pointermove", handleVolumePointer);
}

function setPreservesPitch(media) {
  media.preservesPitch = true;
  media.mozPreservesPitch = true;
  media.webkitPreservesPitch = true;
}

function playbackRateFromSpeedSlider() {
  const sliderValue = clamp(Number(speedControl.value) || 0, -100, 100);
  return sliderValue < 0
    ? 1 + sliderValue * 0.005
    : 1 + sliderValue * 0.0075;
}

function speedSliderValueFromPlaybackRate(speed) {
  const normalizedSpeed = speed > 10 ? speed / 100 : speed;
  const clampedSpeed = clamp(normalizedSpeed || 1, 0.5, 1.75);
  const sliderValue = clampedSpeed < 1
    ? (clampedSpeed - 1) / 0.005
    : (clampedSpeed - 1) / 0.0075;
  return Math.round(sliderValue / 5) * 5;
}

function savePlaybackTuning() {
  const speed = playbackRateFromSpeedSlider();
  localStorage.setItem(PLAYBACK_STORAGE_KEY, JSON.stringify({ speed: Math.round(speed * 100) }));
}

function applyPlaybackTuningToMedia(media, speed) {
  media.playbackRate = speed;
  setPreservesPitch(media);
}

function updatePlaybackTuning({ save = true } = {}) {
  const speed = playbackRateFromSpeedSlider();
  const speedProgress = ((Number(speedControl.value) + 100) / 200) * 100;
  speedControl.style.setProperty("--speed-progress", `${speedProgress}%`);
  applyPlaybackTuningToMedia(audio, speed);
  applyPlaybackTuningToMedia(previewAudio, speed);
  applyPlaybackTuningToMedia(recorderPreviewAudio, speed);
  updateWaveformHue();

  if (save) savePlaybackTuning();
}

function loadPlaybackTuning() {
  speedControl.value = "0";
  try {
    const savedTuning = JSON.parse(localStorage.getItem(PLAYBACK_STORAGE_KEY));
    if (savedTuning && typeof savedTuning.speed === "number") {
      speedControl.value = String(speedSliderValueFromPlaybackRate(savedTuning.speed));
    }
  } catch {
    localStorage.removeItem(PLAYBACK_STORAGE_KEY);
  }
}

function adjustSpeed(delta) {
  const nextSpeed = clamp(playbackRateFromSpeedSlider() + delta / 100, 0.5, 1.75);
  speedControl.value = String(speedSliderValueFromPlaybackRate(nextSpeed));
  updatePlaybackTuning();
}

loadPlaybackTuning();
updatePlaybackTuning({ save: false });

function hypnoticMeterLevel(index, time = 0, intensity = 0) {
  const position = index / Math.max(METER_BAR_COUNT - 1, 1);
  const centerDistance = Math.abs(position - 0.5) * 2;
  const centerLift = 1 - Math.pow(centerDistance, 1.62);
  const wrappedDistance = (a, b) => Math.min(Math.abs(a - b), 1 - Math.abs(a - b));
  const sweepA = (time * 0.128) % 1;
  const sweepB = (1 - ((time * 0.092 + 0.38) % 1)) % 1;
  const travelA = Math.exp(-Math.pow(wrappedDistance(position, sweepA) / 0.185, 2));
  const travelB = Math.exp(-Math.pow(wrappedDistance(position, sweepB) / 0.235, 2));
  const slowWave = Math.sin(time * 1.18 - position * Math.PI * 5.6);
  const counterWave = Math.sin(time * 1.72 + position * Math.PI * 7.4);
  const shimmer = Math.sin(time * 3.80 + index * 1.217);
  const brokenMiddle = Math.sin(time * 2.56 - index * 0.83) * Math.pow(Math.max(1 - centerDistance * 1.42, 0), 0.72);
  const standingWave = (
    Math.pow(slowWave * 0.5 + 0.5, 1.22) * 0.28
    + Math.pow(counterWave * 0.5 + 0.5, 1.44) * 0.24
    + (shimmer * 0.5 + 0.5) * 0.14
    + (travelA * 0.22 + travelB * 0.12)
    + (brokenMiddle * 0.5 + 0.5) * 0.10
  );
  const breath = 0.84 + Math.sin(time * 0.64) * 0.16;
  const edgeLife = 0.34 + centerLift * 0.66;
  const floor = 0.030 + centerLift * 0.016;
  const motion = standingWave * breath * edgeLife * (0.018 + intensity * 0.120);
  return floor + motion;
}

function idleMeterLevel(index, time = 0) {
  const pairedIndex = Math.min(index, Math.max(METER_BAR_COUNT - 1 - index, 0));
  const centerPosition = pairedIndex / Math.max((METER_BAR_COUNT - 1) / 2, 1);
  const centerLift = Math.pow(Math.max(centerPosition, 0), 0.72);
  const seamMotion = Math.sin(time * 1.65 + pairedIndex * 0.31) * 0.5 + 0.5;
  const microBreath = Math.sin(time * 0.82 + pairedIndex * 0.09) * 0.5 + 0.5;
  return 0.018
    + centerLift * 0.008
    + seamMotion * (0.0015 + centerLift * 0.0025)
    + microBreath * 0.0015;
}

function meterEdgeEnvelope(index) {
  const edgeBarDistance = Math.min(index, Math.max(METER_BAR_COUNT - 1 - index, 0));

  if (edgeBarDistance < 18) {
    return 0.020;
  }

  if (edgeBarDistance < 42) {
    return 0.020 + Math.pow((edgeBarDistance - 18) / 24, 1.65) * 0.32;
  }

  if (edgeBarDistance < 70) {
    return 0.340 + Math.pow((edgeBarDistance - 42) / 28, 1.15) * 0.660;
  }

  return 1;
}

function meterMiddleVariation(index, time = 0, level = 0) {
  const position = index / Math.max(METER_BAR_COUNT - 1, 1);
  const pairedIndex = Math.min(index, Math.max(METER_BAR_COUNT - 1 - index, 0));
  const centerDistance = Math.abs(position - 0.5) * 2;
  const middleBand = Math.pow(Math.max(1 - centerDistance * 1.72, 0), 0.62);
  const activity = clamp((level - 0.08) / 0.48, 0, 1);
  const fastDetail = Math.sin(time * 8.40 + pairedIndex * 0.73);
  const counterDetail = Math.sin(time * 5.70 - pairedIndex * 1.17);
  const slowSculpt = Math.sin(time * 2.45 + pairedIndex * 0.39);
  const seed = (((pairedIndex * 37 + 17) % 100) / 100 - 0.5) * 2;
  return 1 + middleBand * (
    fastDetail * 0.062
    + counterDetail * 0.046
    + slowSculpt * 0.040
    + seed * 0.052
  ) * (0.86 + activity * 0.76);
}

function meterDisplayLevel(level, index = 0, time = 0) {
  const variedLevel = level * meterMiddleVariation(index, time, level);
  const edgeEnvelope = meterEdgeEnvelope(index);
  return clamp(0.020 + Math.max(variedLevel - 0.020, 0) * edgeEnvelope * METER_VISUAL_AMPLITUDE, 0.020, METER_LEVEL_CEILING);
}

function meterMouthWeight(index) {
  const position = index / Math.max(METER_BAR_COUNT - 1, 1);
  const edgeDistance = Math.min(Math.abs(position - 0.5) * 2, 1);
  const edgeBarDistance = Math.min(index, Math.max(METER_BAR_COUNT - 1 - index, 0));
  let edgeGate;

  if (edgeBarDistance < 18) {
    edgeGate = 0.014;
  } else if (edgeBarDistance < 42) {
    edgeGate = 0.014 + Math.pow((edgeBarDistance - 18) / 24, 1.45) * 0.31;
  } else {
    edgeGate = Math.min(0.324 + Math.pow(Math.min((edgeBarDistance - 42) / 28, 1), 0.92) * 0.676, 1);
  }

  return clamp(edgeGate * Math.pow(Math.max(1 - edgeDistance * 0.66, 0), 0.36) * 0.96, 0, 0.92);
}

function meterBarLipPalette(index) {
  const position = index / Math.max(METER_BAR_COUNT - 1, 1);
  const cssHue = currentCssWaveformHue();
  const roseLobe = Math.pow(Math.max(1 - Math.abs(position - 0.34) * 2.00, 0), 1.02);
  const centerSheen = Math.pow(Math.max(1 - Math.abs(position - 0.50) * 2.80, 0), 1.18);
  const mauveLobe = Math.pow(Math.max(1 - Math.abs(position - 0.64) * 2.05, 0), 1.00);
  const plumEdge = Math.pow(Math.max(1 - Math.abs(position - 0.82) * 2.65, 0), 1.12);
  const tipHue = (cssHue + 6 + roseLobe * 8 + mauveLobe * 15 + plumEdge * 22) % 360;
  const topHue = (cssHue - 4 + roseLobe * 7 + mauveLobe * 13 + plumEdge * 18) % 360;
  const upperHue = (cssHue + 3 + roseLobe * 5 + mauveLobe * 16 + plumEdge * 20) % 360;
  const bottomHue = (cssHue + 340 + roseLobe * 5 + mauveLobe * 18 + plumEdge * 20) % 360;

  return {
    lipTip: `oklch(${(77 + centerSheen * 4).toFixed(1)}% ${(0.240 + centerSheen * 0.050).toFixed(3)} ${tipHue.toFixed(1)} / 0.99)`,
    lipTop: `oklch(${(68 + centerSheen * 4).toFixed(1)}% ${(0.210 + roseLobe * 0.045 + centerSheen * 0.026).toFixed(3)} ${topHue.toFixed(1)} / 0.98)`,
    lipUpper: `oklch(${(63 + centerSheen * 3).toFixed(1)}% ${(0.180 + mauveLobe * 0.042).toFixed(3)} ${upperHue.toFixed(1)} / 0.97)`,
    lipBottom: `oklch(${(48 + centerSheen * 3).toFixed(1)}% ${(0.155 + mauveLobe * 0.036).toFixed(3)} ${bottomHue.toFixed(1)} / 0.97)`,
  };
}

function applyMeterBarColorVars(bar, index) {
  if (!bar) return;
  const palette = meterBarLipPalette(index);
  bar.style.setProperty("--bar-lip-tip", palette.lipTip);
  bar.style.setProperty("--bar-lip-top", palette.lipTop);
  bar.style.setProperty("--bar-lip-upper", palette.lipUpper);
  bar.style.setProperty("--bar-lip-bottom", palette.lipBottom);
}

function meterBarColorStyle(index) {
  const palette = meterBarLipPalette(index);
  return `--bar-lip-tip: ${palette.lipTip}; --bar-lip-top: ${palette.lipTop}; --bar-lip-upper: ${palette.lipUpper}; --bar-lip-bottom: ${palette.lipBottom};`;
}

function meterToothWeight(index, level) {
  const position = index / Math.max(METER_BAR_COUNT - 1, 1);
  const toothBreak = meterToothBreak(index);
  const centerHighlight = Math.pow(Math.max(1 - Math.abs(position - 0.5) * (2.35 + toothBreak * 0.20), 0), 0.82 + toothBreak * 0.20);
  const levelGate = clamp((level - 0.04) / 0.42, 0, 1);
  const toothPulse = 0.86 + Math.sin(performance.now() / 1000 * 6.2 + index * 0.47) * 0.14;
  return clamp(centerHighlight * meterEdgeEnvelope(index) * (0.54 + levelGate * 0.64) * (0.92 + toothBreak * 0.34) * toothPulse, 0, 1);
}

function meterToothNoise(index) {
  const pairedIndex = Math.min(index, Math.max(METER_BAR_COUNT - 1 - index, 0));
  return 0.70 + (((pairedIndex * 53 + 11) % 100) / 100) * 0.55;
}

function meterToothBreak(index) {
  const pairedIndex = Math.min(index, Math.max(METER_BAR_COUNT - 1 - index, 0));
  return ((pairedIndex * 89 + 41) % 100) / 100;
}

function meterToothHeight(index, level) {
  const levelGate = clamp((level - 0.08) / 0.52, 0, 1);
  const toothWeight = meterToothWeight(index, level);
  return clamp(0.092 + toothWeight * (0.082 + meterToothNoise(index) * 0.070) + levelGate * 0.026, 0.092, 0.255);
}

function meterToothTop(index) {
  return 45.8 + (meterToothBreak(index) - 0.5) * 3.2;
}

function audioSampleLevel(sample) {
  return Math.abs(sample);
}

function applyWaveformStyle() {
  consoleMeter?.classList.toggle("is-flowing", waveformStyle === "flowing");
  if (flowingWaveformToggle) flowingWaveformToggle.checked = waveformStyle === "flowing";
}

function drawFlowingWaveform(time, hasLiveAudio, liveEnergy = 0) {
  if (!flowingWaveform || waveformStyle !== "flowing") return;
  const rect = flowingWaveform.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (flowingWaveform.width !== width || flowingWaveform.height !== height) {
    flowingWaveform.width = width;
    flowingWaveform.height = height;
  }
  const context = flowingWaveform.getContext("2d");
  if (!context) return;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);
  const centerX = rect.width * 0.5;
  const centerY = rect.height * 0.5;
  const maxRadius = Math.hypot(rect.width, rect.height) * 0.95;
  const ribbonCount = 24;
  const volumeFactor = clamp((audio.volume || 0) * 1.5, 0.03, 1);
  const energy = hasLiveAudio ? clamp((liveEnergy - 0.0045) * 60, 0, 1) : 0;
  const targetEmission = hasLiveAudio
    ? clamp((energy * 0.55 + meterEnergyPulse * 0.18) * volumeFactor, 0, 1)
    : 0;
  const deltaTime = waveformLastFrameTime ? Math.min(Math.max(time - waveformLastFrameTime, 0), 0.05) : 0;
  waveformLastFrameTime = time;
  if (targetEmission > 0.035) {
    waveformQuietTime = 0;
    waveformContinuousSound = Math.min(waveformContinuousSound + deltaTime, 4.8);
  } else {
    waveformQuietTime += deltaTime;
    if (waveformQuietTime > 0.18) {
      waveformContinuousSound = 0;
      waveformRibbonFront.fill(-0.12);
    }
  }
  const smoothing = targetEmission > waveformEmission ? 0.04 : 0.14;
  waveformEmission += (targetEmission - waveformEmission) * smoothing;
  const emission = clamp(waveformEmission, 0, 1);
  if (targetEmission > 0.08) waveformHasStarted = true;
  waveformTrailEnergy = waveformHasStarted
    ? Math.max(waveformTrailEnergy * 0.9992, emission * 0.92, 0.08)
    : 0;
  const trailEnergy = clamp(waveformTrailEnergy, 0, 1);
  const trailOpacity = clamp(0.14 + trailEnergy * 0.86, 0.14, 1);
  const activity = 0.28 + emission * 1.8 + trailEnergy * 0.48;
  const strandGrowth = Math.pow(clamp(waveformContinuousSound / 4.8, 0, 1), 0.72);

  context.save();
  context.globalCompositeOperation = "lighter";
  context.lineCap = "round";
  context.lineJoin = "round";
  const breath = 0.5 + Math.sin(time * 1.15) * 0.5;
  const pulse = 0.62 + breath * 0.34 + emission * 0.24;
  const glowRadius = rect.height * (0.09 + breath * 0.13 + emission * 0.24);
  const centerGlow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
  centerGlow.addColorStop(0, `rgba(255, 240, 190, ${0.70 * pulse})`);
  centerGlow.addColorStop(0.08, `rgba(115, 207, 255, ${0.62 * pulse})`);
  centerGlow.addColorStop(0.42, `rgba(38, 133, 237, ${(0.18 + breath * 0.14 + emission * 0.12)})`);
  centerGlow.addColorStop(1, "rgba(20, 94, 190, 0)");
  context.fillStyle = centerGlow;
  context.fillRect(0, 0, rect.width, rect.height);

  if (!waveformHasStarted) {
    context.restore();
    context.shadowBlur = 0;
    return;
  }

  for (let ribbonIndex = 0; ribbonIndex < ribbonCount; ribbonIndex += 1) {
    const angle = (ribbonIndex / ribbonCount) * Math.PI * 2 + Math.sin(ribbonIndex * 7.1) * 0.035;
    const ribbonDelay = Math.round(Math.sin(ribbonIndex * 9.17) * 5 + Math.cos(ribbonIndex * 2.41) * 3);
    const ribbonPhase = Math.sin(ribbonIndex * 4.73) * Math.PI;
    const ribbonSmoothing = 0.022 + ((Math.sin(ribbonIndex * 6.31) + 1) * 0.5) * 0.070;
    waveformRibbonEnergy[ribbonIndex] += (emission - waveformRibbonEnergy[ribbonIndex]) * ribbonSmoothing;
    const ribbonDrive = clamp(waveformRibbonEnergy[ribbonIndex] * 1.45 + trailEnergy * 0.32, 0.08, 1);
    const ribbonOrigin = rect.height * (0.20 + Math.sin(ribbonIndex * 5.19) * 0.045);
    const ribbonReach = Math.max(
      ribbonOrigin + rect.height * 0.10,
      maxRadius * clamp(0.12 + strandGrowth * 0.88 + Math.sin(ribbonIndex * 2.61) * 0.035, 0.10, 1)
    );
    const frontSpeed = (hasLiveAudio ? 0.014 : 0.003) + ((Math.cos(ribbonIndex * 3.17) + 1) * 0.5) * 0.008;
    waveformRibbonFront[ribbonIndex] += frontSpeed * (0.55 + ribbonDrive * 0.75);
    if (waveformRibbonFront[ribbonIndex] > 1.14) waveformRibbonFront[ribbonIndex] = -0.12;
    const ribbonFront = waveformRibbonFront[ribbonIndex];
    const hue = ribbonIndex % 5 === 0 || ribbonIndex % 7 === 0 ? 42 : 207 + (ribbonIndex % 3) * 8;
    const lightness = hue === 42 ? 86 : 82;
    const alpha = hue === 42 ? 0.78 : 0.72;
    const normalX = -Math.sin(angle);
    const normalY = Math.cos(angle);
    const drawRibbon = (offset, lineWidth, opacity, filament = false) => {
      context.beginPath();
      for (let radius = ribbonOrigin; radius <= ribbonReach; radius += 2) {
        const progress = radius / Math.max(maxRadius, 1);
        const meterIndex = Math.min(
          meterLevels.length - 1,
          Math.max(0, Math.floor(progress * meterLevels.length) + ribbonDelay)
        );
        const level = meterLevels[meterIndex] || 0.08;
        const envelope = 0.42 + Math.pow(Math.sin(Math.min(progress, 1) * Math.PI), 0.52) * 0.58;
        const broadBend = Math.sin(radius * 0.010 + ribbonIndex * 1.7) * (6 + radius * 0.040);
        const fineBend = Math.sin(radius * 0.034 + ribbonIndex * 0.8) * (filament ? 0.75 : 1.45);
        const outwardWave = Math.sin(radius * 0.009 + ribbonIndex * 0.7) * (2.4 + radius * 0.020);
        const organicBend = Math.sin(time * (0.30 + (ribbonIndex % 4) * 0.045) + ribbonPhase + radius * 0.003) * (2 + radius * 0.016) * ribbonDrive;
        const outwardPulse = Math.exp(-Math.pow((progress - ribbonFront) / 0.16, 2));
        const audioBend = (level - 0.08) * rect.height * 0.34 * activity * ribbonDrive * (0.20 + outwardPulse * 1.65) * (0.28 + envelope);
        const bend = (broadBend + fineBend + outwardWave + organicBend + audioBend) * envelope + offset;
        const x = centerX + Math.cos(angle) * radius + normalX * bend;
        const y = centerY + Math.sin(angle) * radius + normalY * bend;
        if (radius === ribbonOrigin) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = `hsla(${hue}, 94%, ${lightness}%, ${opacity * trailOpacity})`;
      context.lineWidth = lineWidth;
      context.shadowColor = `hsla(${hue}, 95%, 72%, ${opacity * 0.82})`;
      context.shadowBlur = filament ? 3 : 10;
      context.stroke();
    };

    drawRibbon(0, 11 + (ribbonIndex % 3) * 2, alpha * 0.28);
    drawRibbon(0, 7 + (ribbonIndex % 3) * 1.2, alpha * 0.58);
    drawRibbon(0, 2.4 + (ribbonIndex % 2) * 0.8, alpha, true);
    drawRibbon(-4.5, 1.05, alpha * 0.62, true);
    drawRibbon(4.5, 1.05, alpha * 0.62, true);
  }
  context.restore();
  context.shadowBlur = 0;
}

function renderAudioMeter() {
  if (!consoleMeter) return;

  consoleMeter.style.setProperty("--meter-bars", METER_BAR_COUNT);
  meterLevels = Array.from({ length: METER_BAR_COUNT }, (_, index) => idleMeterLevel(index));
  const barsMarkup = meterLevels
    .map((level, index) => {
      const position = index / Math.max(METER_BAR_COUNT - 1, 1);
      return `<span class="meter-bar" style="${meterBarColorStyle(index)} --level: ${level.toFixed(3)}; --display-level: ${meterDisplayLevel(level, index, 0).toFixed(3)}; --tone: ${position.toFixed(3)}; --mouth-weight: ${meterMouthWeight(index).toFixed(3)}; --tooth-weight: ${meterToothWeight(index, level).toFixed(3)}; --tooth-noise: ${meterToothNoise(index).toFixed(3)}; --tooth-height: ${meterToothHeight(index, level).toFixed(3)}; --tooth-top: ${meterToothTop(index).toFixed(2)}%;"></span>`;
    })
    .join("");
  consoleMeter.innerHTML = `<canvas class="flowing-waveform" id="flowingWaveform" aria-hidden="true"></canvas>${barsMarkup}`;
  meterBars = [...consoleMeter.querySelectorAll(".meter-bar")];
  flowingWaveform = consoleMeter.querySelector("#flowingWaveform");
  applyWaveformStyle();
  startMeterAnimation();
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
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0;
      meterData = new Float32Array(analyser.fftSize);
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
  let liveEnergy = 0;
  let livePeak = 0;

  if (hasLiveAudio) {
    analyser.getFloatTimeDomainData(meterData);
    for (let sampleIndex = 0; sampleIndex < meterData.length; sampleIndex += 1) {
      const centeredSample = meterData[sampleIndex];
      livePeak = Math.max(livePeak, Math.abs(centeredSample));
      liveEnergy += centeredSample * centeredSample;
    }
    liveEnergy = Math.sqrt(liveEnergy / meterData.length);
  }

  const energyLift = hasLiveAudio ? clamp((liveEnergy - 0.0007) * 280, 0, 1) : 0;
  const peakLift = hasLiveAudio ? clamp((livePeak - 0.003) * 18, 0, 1) : 0;
  const transientLift = hasLiveAudio ? clamp((liveEnergy - previousMeterEnergy) * 420, 0, 1) : 0;
  meterEnergyPulse = hasLiveAudio
    ? Math.max(meterEnergyPulse * 0.56, transientLift, peakLift * 0.66 + energyLift * 0.46)
    : meterEnergyPulse * 0.70;
  previousMeterEnergy = hasLiveAudio ? liveEnergy : 0;

  if (hasLiveAudio && activeCueWords.length) {
    const cueStep = Math.floor(audio.currentTime / CUE_WORD_SECONDS);
    if (cueStep !== activeCueStep) {
      activeCueStep = cueStep;
      activeCueWord = activeCueWords[cueStep % activeCueWords.length];
      cueWordIntensity = 1;
      consoleMeter?.style.setProperty("--word-tip-color", cueWordColor(activeCueWord));
    }
  } else {
    activeCueWord = null;
  }

  const samplesPerBar = meterData ? Math.max(1, Math.floor(meterData.length / METER_BAR_COUNT)) : 1;
  const nextLevels = [];

  meterBars.forEach((_, index) => {
    let nextLevel = idleMeterLevel(index, time);

    if (hasLiveAudio) {
      let sum = 0;
      let peak = 0;
      const sampleStart = index * samplesPerBar;
      const sampleEnd = Math.min(sampleStart + samplesPerBar, meterData.length);
      const centerSampleIndex = Math.min(sampleStart + Math.floor((sampleEnd - sampleStart) / 2), meterData.length - 1);
      const centerSample = audioSampleLevel(meterData[centerSampleIndex]);

      for (let sampleIndex = sampleStart; sampleIndex < sampleEnd; sampleIndex += 1) {
        const sampleLevel = audioSampleLevel(meterData[sampleIndex]);
        peak = Math.max(peak, sampleLevel);
        sum += sampleLevel * sampleLevel;
      }

      const rms = Math.sqrt(sum / Math.max(sampleEnd - sampleStart, 1));
      const energyScale = Math.max(liveEnergy, 0.00008);
      const absoluteShape = clamp((centerSample * 0.52 + peak * 0.34 + rms * 0.14) * 300, 0, 1);
      const relativeShape = (
        Math.pow(clamp((centerSample / energyScale) / 2.4, 0, 1), 0.92) * 0.36
        + Math.pow(clamp((peak / energyScale) / 3.0, 0, 1), 0.98) * 0.46
        + Math.pow(clamp((rms / energyScale) / 2.0, 0, 1), 0.96) * 0.18
      );
      const sampleShape = Math.pow(absoluteShape, 0.78) * 0.42 + relativeShape * 0.58;
      const polish = idleMeterLevel(index, time) * 0.022;
      nextLevel = sampleShape + polish;
    }

    nextLevels[index] = nextLevel;
  });

  if (hasLiveAudio) {
    for (let index = 0; index < Math.floor(METER_BAR_COUNT / 2); index += 1) {
      const mirrorIndex = METER_BAR_COUNT - 1 - index;
      const balancedLevel = (nextLevels[index] + nextLevels[mirrorIndex]) * 0.5;
      nextLevels[index] = balancedLevel;
      nextLevels[mirrorIndex] = balancedLevel;
    }

    const halfPoint = Math.floor(METER_BAR_COUNT / 2);
    const leftTotal = nextLevels.slice(0, halfPoint).reduce((sum, level) => sum + level, 0);
    const rightTotal = nextLevels.slice(halfPoint).reduce((sum, level) => sum + level, 0);
    const balancedHalfTotal = (leftTotal + rightTotal) * 0.5;
    const leftGain = leftTotal > 0 ? clamp(balancedHalfTotal / leftTotal, 0.88, 1.12) : 1;
    const rightGain = rightTotal > 0 ? clamp(balancedHalfTotal / rightTotal, 0.88, 1.12) : 1;

    for (let index = 0; index < METER_BAR_COUNT; index += 1) {
      nextLevels[index] *= index < halfPoint ? leftGain : rightGain;
    }
  }

  const rawPeak = Math.max(...nextLevels, 0.08);
  const rawFloor = Math.min(...nextLevels);
  const rawRange = Math.max(rawPeak - rawFloor, 0.001);
  const reactiveDrive = hasLiveAudio
    ? clamp(energyLift * 0.62 + peakLift * 0.30 + meterEnergyPulse * 0.34, 0, 1)
    : 0;
  const targetPeak = hasLiveAudio
    ? clamp(0.082 + Math.pow(reactiveDrive, 0.72) * 0.560, 0.082, 0.660)
    : METER_LEVEL_CEILING;
  const targetFloor = hasLiveAudio ? clamp(0.030 + reactiveDrive * 0.044, 0.030, 0.076) : 0.08;
  let highestLevel = 0;

  meterBars.forEach((bar, index) => {
    const shapedLevel = hasLiveAudio
      ? targetFloor + ((nextLevels[index] - rawFloor) / rawRange) * (targetPeak - targetFloor)
      : nextLevels[index];
    const position = index / Math.max(METER_BAR_COUNT - 1, 1);
    const pairedIndex = Math.min(index, Math.max(METER_BAR_COUNT - 1 - index, 0));
    const centerDistance = Math.abs(position - 0.5) * 2;
    const middleBand = Math.pow(Math.max(1 - centerDistance * 1.52, 0), 0.70);
    const middleLift = middleBand
      * (Math.sin(time * 9.8 + pairedIndex * 0.67) * 0.014 + Math.sin(time * 6.6 - pairedIndex * 1.11) * 0.010)
      * (hasLiveAudio ? (0.68 + meterEnergyPulse * 1.16) : 0.30);
    const restlessMotion = hasLiveAudio
      ? idleMeterLevel(index, time) * (0.048 + meterEnergyPulse * 0.036)
      : 0;
    const nextLevel = clamp(shapedLevel + middleLift + restlessMotion, 0.020, METER_LEVEL_CEILING);
    const smoothedLevel = nextLevel;
    const visualLevel = meterDisplayLevel(smoothedLevel, index, time);

    meterLevels[index] = smoothedLevel;
    highestLevel = Math.max(highestLevel, visualLevel);
    bar.style.setProperty("--level", visualLevel.toFixed(3));
    bar.style.setProperty("--display-level", visualLevel.toFixed(3));
    bar.style.setProperty("--tooth-weight", meterToothWeight(index, visualLevel).toFixed(3));
    bar.style.setProperty("--tooth-height", meterToothHeight(index, visualLevel).toFixed(3));
    bar.style.setProperty("--tooth-top", `${meterToothTop(index).toFixed(2)}%`);
  });

  consoleMeter?.style.setProperty("--meter-intensity", clamp(highestLevel, 0.12, 1).toFixed(3));
  drawFlowingWaveform(time, hasLiveAudio, liveEnergy);
  cueWordIntensity = activeCueWord ? cueWordIntensity * 0.68 : cueWordIntensity * 0.54;
  if (cueWordIntensity < 0.015) cueWordIntensity = 0;
  consoleMeter?.style.setProperty("--word-tip-intensity", cueWordIntensity.toFixed(3));

  meterFrame = requestAnimationFrame(updateAudioMeter);
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
  audio.loop = repeatMode === "single";
}

function updateQueueButtons() {
  const repeatCopy = {
    once: { label: "", name: "Play once", isLooping: false },
    single: { label: "1", name: "Loop one", isLooping: true },
    all: { label: "", name: "Loop all", isLooping: true },
  }[repeatMode];

  repeatModeLabel.textContent = repeatCopy.label;
  repeatModeButton.classList.toggle("is-active", repeatCopy.isLooping);
  repeatModeButton.dataset.repeatMode = repeatMode;
  repeatModeButton.setAttribute("aria-label", repeatCopy.name);
  repeatModeButton.setAttribute("aria-pressed", String(repeatCopy.isLooping));
  shuffleButton.classList.toggle("is-active", shuffleEnabled);
  shuffleButton.setAttribute("aria-pressed", String(shuffleEnabled));
}

function cycleRepeatMode() {
  const repeatModes = ["once", "single", "all"];
  const currentIndex = repeatModes.indexOf(repeatMode);
  repeatMode = repeatModes[(currentIndex + 1) % repeatModes.length];
  applyAudioLooping();
  updateQueueButtons();
}

function toggleShuffle() {
  shuffleEnabled = !shuffleEnabled;
  updateQueueButtons();
}

function updatePageDots() {
  pageDots.forEach((dot, index) => {
    const isActive = index === activePageIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function goToPage(pageIndex) {
  activePageIndex = Math.min(Math.max(pageIndex, 0), pageDots.length - 1);
  pageSwipeOffset = 0;
  pageRail.style.setProperty("--page-drag-offset", "0px");
  pageRail.style.setProperty("--page-index", activePageIndex);
  updatePageDots();
  footerNavButtons.forEach((button, index) => {
    if (!button) return;
    const isActive = index === activePageIndex;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function isPageSwipeIgnored(target) {
  return Boolean(target.closest(
    "button, input, select, textarea, label, .loop-wheel, .playlist-editor, .guide-sheet, .voice-recorder-sheet"
  ));
}

function constrainedPageSwipeOffset(offset) {
  const atFirstPage = activePageIndex === 0 && offset > 0;
  const atLastPage = activePageIndex === pageDots.length - 1 && offset < 0;
  return atFirstPage || atLastPage ? offset * 0.32 : offset;
}

function startPageSwipe(event) {
  if (!event.isPrimary || isPageSwipeIgnored(event.target)) return;

  pageSwipePointerId = event.pointerId;
  pageSwipeStartX = event.clientX;
  pageSwipeStartY = event.clientY;
  pageSwipeOffset = 0;
  isPageSwiping = false;
  try {
    pageRail.setPointerCapture?.(event.pointerId);
  } catch {
    // Synthetic or interrupted pointer streams may not be capturable.
  }
}

function movePageSwipe(event) {
  if (event.pointerId !== pageSwipePointerId) return;

  const offsetX = event.clientX - pageSwipeStartX;
  const offsetY = event.clientY - pageSwipeStartY;
  if (!isPageSwiping && Math.abs(offsetX) < 12) return;
  if (!isPageSwiping && Math.abs(offsetY) > Math.abs(offsetX) * 0.85) {
    endPageSwipe(event);
    return;
  }

  isPageSwiping = true;
  pageSwipeOffset = constrainedPageSwipeOffset(offsetX);
  pageRail.classList.add("is-swiping");
  pageRail.style.setProperty("--page-drag-offset", `${pageSwipeOffset}px`);
  event.preventDefault();
}

function endPageSwipe(event) {
  if (event.pointerId !== pageSwipePointerId) return;

  const railWidth = pageRail.clientWidth || 1;
  const threshold = Math.min(90, railWidth * 0.22);
  const nextPage = pageSwipeOffset < -threshold ? activePageIndex + 1 : (
    pageSwipeOffset > threshold ? activePageIndex - 1 : activePageIndex
  );

  try {
    if (pageRail.hasPointerCapture?.(event.pointerId)) {
      pageRail.releasePointerCapture(event.pointerId);
    }
  } catch {
    // The pointer may already have been released by the browser.
  }
  pageRail.classList.remove("is-swiping");
  pageSwipePointerId = null;
  isPageSwiping = false;
  goToPage(nextPage);
}

function centerSelectedOption(behavior = "smooth") {
  const selectedOption = loopOptions.find((option) => option.getAttribute("aria-selected") === "true");
  selectedOption?.scrollIntoView({ block: "center", behavior });
}

function selectLoop(option) {
  const shouldResume = !activeMainMedia().paused;

  selectedIndexByMode[currentMode] = Number(option.dataset.index);
  syncSelection({ scrollBehavior: "smooth", updateAudio: true });

  if (shouldResume) {
    const media = activeMainMedia();
    media.currentTime = 0;
    media.play().catch(() => setPlayingState(false));
  }
}

function renderWheel() {
  const activeChoices = currentChoices();
  loopWheel.setAttribute("aria-label", currentMode === "loop" ? "Select loop" : "Select conversation");
  loopWheel.innerHTML = activeChoices
    .map((choice, index) => {
      const selected = index === selectedIndexByMode[currentMode] ? ' aria-selected="true"' : "";
      const displayTitle = displayTitleForChoice(choice);
      return `<button type="button" role="option"${selected} data-index="${index}" data-title="${escapeHTML(displayTitle)}">${escapeHTML(displayTitle)}</button>`;
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

  setActiveCueWords(selectedChoice);
  selectedLoop.textContent = displayTitleForChoice(selectedChoice);
  if (updateAudio) {
    updateMainMediaSource(selectedChoice);
  }
  updateVolume();
  updateVoiceStatus(selectedChoice);
  updateConversationProgress();
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
  if (audio.getAttribute("src") === file) {
    updatePlaybackTuning();
    updateConversationProgress();
    return;
  }

  audio.setAttribute("src", file);
  audio.load();
  updatePlaybackTuning();
  updateConversationProgress();
}

function updateMainMediaSource(choice) {
  const source = resolveAudioSource(choice);
  currentResolvedSource = source;
  updateAudioSource(source.file);
}

function activeMainMedia() {
  return audio;
}

function formatMediaTime(time) {
  const totalSeconds = Number.isFinite(time) ? Math.max(0, Math.floor(time)) : 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updateConversationProgress() {
  if (!conversationSeek || !conversationCurrentTime || !conversationDuration) return;

  const media = activeMainMedia();
  const duration = Number.isFinite(media.duration) ? media.duration : 0;
  const currentTime = Number.isFinite(media.currentTime) ? media.currentTime : 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  conversationSeek.disabled = currentMode !== "conversation" || duration <= 0;
  conversationSeek.max = String(Math.max(duration, 1));

  if (!isSeekingConversation) {
    conversationSeek.value = String(Math.min(currentTime, duration || 1));
  }

  conversationSeek.style.setProperty("--conversation-progress", `${clamp(progress, 0, 100)}%`);
  conversationCurrentTime.textContent = formatMediaTime(isSeekingConversation ? Number(conversationSeek.value) : currentTime);
  conversationDuration.textContent = formatMediaTime(duration);
}

function seekConversationTo(time) {
  if (!conversationSeek || !conversationCurrentTime || !conversationDuration) return;

  const media = activeMainMedia();
  const duration = Number.isFinite(media.duration) ? media.duration : 0;
  if (currentMode !== "conversation" || duration <= 0) return;

  const nextTime = clamp(time, 0, duration);
  media.currentTime = nextTime;
  conversationSeek.value = String(nextTime);
  conversationSeek.style.setProperty("--conversation-progress", `${(nextTime / duration) * 100}%`);
  conversationCurrentTime.textContent = formatMediaTime(nextTime);
  conversationDuration.textContent = formatMediaTime(duration);
}

function seekConversationFromPointer(event) {
  if (!conversationSeek || conversationSeek.disabled) return;

  const media = activeMainMedia();
  const duration = Number.isFinite(media.duration) ? media.duration : 0;
  if (duration <= 0) return;

  const rect = conversationSeek.getBoundingClientRect();
  const ratio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0;
  seekConversationTo(clamp(ratio, 0, 1) * duration);
}

function stopMainMedia() {
  audio.pause();
  audio.currentTime = 0;
  setPlayingState(false);
  updateConversationProgress();
}

function updateLoopNeighbors() {
  const activeChoices = currentChoices();
  const selectedIndex = selectedIndexByMode[currentMode];
  const optionCount = activeChoices.length;
  const previousIndex = (selectedIndex - 1 + optionCount) % optionCount;
  const nextIndex = (selectedIndex + 1) % optionCount;

  previousLoop.textContent = displayTitleForChoice(activeChoices[previousIndex]);
  nextLoop.textContent = displayTitleForChoice(activeChoices[nextIndex]);
}

function setMode(mode) {
  if (mode === currentMode) return;

  currentMode = mode;
  playerPanel.dataset.mode = currentMode;
  stopMainMedia();
  stopPreview();
  applyAudioLooping();

  modeButtons.forEach((button) => {
    const isSelected = button.dataset.mode === currentMode;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  updateVoiceControlMode();
  renderWheel();
  renderPlaylistEditor();
  renderPlaylistControls();
}

function nextQueuedIndex() {
  const optionCount = currentChoices().length;
  const currentIndex = selectedIndexByMode[currentMode];

  if (shuffleEnabled && optionCount > 1) {
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

function renderMainCategorySelect() {
  if (!mainCategorySelect) return;

  const activePlaylist = currentPlaylist();
  mainCategorySelect.innerHTML = mainCategories.map((category) => {
    const isActive = activePlaylist.id === category.playlistId || activePlaylist.category === category.title;
    return `<option value="${escapeHTML(category.id)}"${isActive ? " selected" : ""}>${escapeHTML(category.title)}</option>`;
  }).join("");
}

function describePlaylistChoice(choice) {
  const phraseChoice = choice.phraseId ? phraseLibraryByPhraseId.get(choice.phraseId) : null;
  const subcategory = choice.phraseId ? phraseSubcategoryByPhraseId.get(choice.phraseId) : null;

  if (choice.source === CUSTOM_RECORDED_SOURCE) {
    return {
      label: choice.displayTitle ?? choice.title,
      description: choice.phraseText ?? choice.title,
      meta: `Recorded - ${choice.category}`,
      groupId: customCategoryId(choice.category),
      groupTitle: choice.category,
    };
  }

  if (phraseChoice) {
    return {
      label: phraseChoice.displayTitle,
      description: phraseChoice.phraseText,
      meta: `${phraseChoice.title} - ${subcategory?.title ?? "Attitude & Effort"}`,
      groupId: subcategory?.id ?? "attitude-effort",
      groupTitle: subcategory?.title ?? "Attitude & Effort",
    };
  }

  if (choice.source === "source-cut") {
    return {
      label: choice.title,
      description: choice.title,
      meta: "Source cuts",
      groupId: "source-cuts",
      groupTitle: "Source cuts",
    };
  }

  if (choice.source === "loaded") {
    return {
      label: choice.title,
      description: choice.title,
      meta: "Loaded files",
      groupId: "loaded-files",
      groupTitle: "Loaded files",
    };
  }

  return {
    label: choice.title,
    description: choice.phraseText ?? choice.title,
    meta: currentMode === "conversation" ? "Category talks" : "Other",
    groupId: currentMode === "conversation" ? "conversation" : "other",
    groupTitle: currentMode === "conversation" ? "Category talks" : "Other",
  };
}

function choicesByPlaylistId() {
  return new Map(choices[currentMode].map((choice) => [choice.id, choice]));
}

function availableChoicesForPlaylist(activePlaylist) {
  const activeSet = new Set(activePlaylist.itemIds);
  const choicesById = choicesByPlaylistId();
  const activePhraseIds = new Set(
    activePlaylist.itemIds
      .map((itemId) => choicesById.get(itemId)?.phraseId)
      .filter(Boolean)
  );

  return choices[currentMode].filter((choice) => {
    if (activeSet.has(choice.id)) return false;
    if (choice.phraseId && activePhraseIds.has(choice.phraseId)) return false;
    if (choice.source === "starter" && phraseLibraryByPhraseId.has(choice.phraseId)) return false;
    if (choice.source === "source-cut" && activePlaylist.id !== "loop-source-cuts") return false;
    return true;
  });
}

function groupedPlaylistChoices(items) {
  const groupsById = new Map();

  items.forEach((choice) => {
    const description = describePlaylistChoice(choice);
    if (!groupsById.has(description.groupId)) {
      groupsById.set(description.groupId, {
        id: description.groupId,
        title: description.groupTitle,
        items: [],
      });
    }
    groupsById.get(description.groupId).items.push(choice);
  });

  const groupOrder = [
    ...phraseSubcategories.map((subcategory) => subcategory.id),
    ...customRecordedCategoryTitles().map((title) => customCategoryId(title)),
    "source-cuts",
    "loaded-files",
    "conversation",
    "other",
  ];

  return [...groupsById.values()].sort((a, b) => {
    const aIndex = groupOrder.indexOf(a.id);
    const bIndex = groupOrder.indexOf(b.id);
    return (aIndex < 0 ? 999 : aIndex) - (bIndex < 0 ? 999 : bIndex);
  });
}

function renderPlaylistTrack(choice, activePlaylist, activeSet) {
  const isIncluded = activeSet.has(choice.id);
  const isLastIncluded = isIncluded && activePlaylist.itemIds.length === 1;
  const isPreviewing = previewingId === choice.id;
  const description = describePlaylistChoice(choice);

  return `
    <div class="playlist-track${isIncluded ? " is-included" : ""}" data-item-id="${choice.id}">
      <button class="playlist-preview" type="button" aria-label="${isPreviewing ? "Stop" : "Play"} ${escapeHTML(description.label)}">
        <span class="${isPreviewing ? "stop-mini-icon" : "play-mini-icon"}" aria-hidden="true"></span>
      </button>
      <div class="playlist-track-copy" title="${escapeHTML(description.description)}">
        <span>${escapeHTML(description.label)}</span>
        <em>${escapeHTML(description.meta)}</em>
      </div>
      <button
        class="playlist-membership"
        type="button"
        aria-label="${isIncluded ? "Remove" : "Add"} ${escapeHTML(description.label)}"
        aria-pressed="${isIncluded}"
        ${isLastIncluded ? "disabled" : ""}
      >
        ${isIncluded ? "−" : "+"}
      </button>
    </div>
  `;
}

function renderPlaylistSection(group, activePlaylist, activeSet, { addable = false } = {}) {
  const addableGroupIds = new Set([
    ...phraseSubcategories.map((subcategory) => subcategory.id),
    ...customRecordedCategoryTitles().map((title) => customCategoryId(title)),
  ]);
  const canAddGroup = addable && addableGroupIds.has(group.id);
  const addButton = canAddGroup && group.items.length
    ? `<button class="playlist-section-add" type="button" data-add-group="${escapeHTML(group.id)}" aria-label="Add ${escapeHTML(group.title)} to mix">Add</button>`
    : "";

  return `
    <section class="playlist-section" data-group-id="${escapeHTML(group.id)}">
      <div class="playlist-section-head">
        <span>${escapeHTML(group.title)}</span>
        <em>${group.items.length}</em>
        ${addButton}
      </div>
      ${group.items.map((choice) => renderPlaylistTrack(choice, activePlaylist, activeSet)).join("")}
    </section>
  `;
}

function renderPlaylistEditor() {
  const activePlaylist = currentPlaylist();
  const activeSet = new Set(activePlaylist.itemIds);
  const choicesById = choicesByPlaylistId();
  const selectedChoices = activePlaylist.itemIds.map((itemId) => choicesById.get(itemId)).filter(Boolean);
  const availableGroups = groupedPlaylistChoices(availableChoicesForPlaylist(activePlaylist));
  const selectedSection = {
    id: "in-mix",
    title: "In this mix",
    items: selectedChoices,
  };

  playlistTitle.textContent = activePlaylist.name;
  playlistCount.textContent = `${activePlaylist.itemIds.length} file${activePlaylist.itemIds.length === 1 ? "" : "s"}`;
  renderMainCategorySelect();
  updatePhraseSetControls();
  playlistEditor.innerHTML = [
    renderPlaylistSection(selectedSection, activePlaylist, activeSet),
    ...availableGroups.map((group) => renderPlaylistSection(group, activePlaylist, activeSet, { addable: true })),
  ].join("");
}

function activePhraseCategory() {
  const category = currentPlaylist().category;
  return mainCategories.some((candidate) => candidate.title === category) ? category : "Attitude & Effort";
}

function updatePhraseSetControls() {
  if (!selectAllButton || !randomCountInput) return;

  const category = activePhraseCategory();
  const choiceIds = phraseChoiceIdsForCategory(category);
  selectAllButton.textContent = `All ${choiceIds.length}`;
  randomCountInput.max = String(Math.max(choiceIds.length, 1));
  randomCountInput.value = String(Math.min(Math.max(Number(randomCountInput.value) || 10, 1), Math.max(choiceIds.length, 1)));
}

function togglePlaylistItem(itemId) {
  const activePlaylist = currentPlaylist();
  const isIncluded = activePlaylist.itemIds.includes(itemId);

  if (isIncluded && activePlaylist.itemIds.length === 1) {
    return;
  }

  const selectedItemId = activePlaylist.itemIds[selectedIndexByMode[currentMode]];
  const wasPlaying = !activeMainMedia().paused;
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
    const media = activeMainMedia();
    media.currentTime = 0;
    media.play().catch(() => setPlayingState(false));
  }
}

function addPlaylistGroup(groupId) {
  const activePlaylist = currentPlaylist();
  const additions = availableChoicesForPlaylist(activePlaylist)
    .filter((choice) => describePlaylistChoice(choice).groupId === groupId)
    .map((choice) => choice.id);

  if (!additions.length) return;

  activePlaylist.itemIds = [...activePlaylist.itemIds, ...additions];
  renderPlaylistControls();
  renderWheel();
  renderPlaylistEditor();
  savePlaylistConfiguration();
}

function createPlaylist() {
  const playlists = playlistsByMode[currentMode];
  const playlistNumber = playlists.length + 1;
  const prefix = currentMode === "loop" ? "Loop" : "Conversation";
  const firstChoice = currentChoices()[selectedIndexByMode[currentMode]] ?? choices[currentMode][0];
  const playlist = {
    id: `${currentMode}-custom-${Date.now()}`,
    name: `${prefix} playlist ${playlistNumber}`,
    category: "Attitude & Effort",
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

function activateLoopPlaylist(playlistId) {
  if (currentMode !== "loop") {
    setMode("loop");
  }

  activePlaylistIdByMode.loop = playlistId;
  selectedIndexByMode.loop = 0;
  renderPlaylistControls();
  renderWheel();
  renderPlaylistEditor();
  savePlaylistConfiguration();
}

function activateMainCategory(categoryId) {
  const category = mainCategories.find((candidate) => candidate.id === categoryId);
  if (!category) return;

  activateLoopPlaylist(category.playlistId);
}

function selectAllPhrases() {
  const category = activePhraseCategory();
  const mainCategory = mainCategories.find((candidate) => candidate.title === category);
  if (mainCategory) {
    activateLoopPlaylist(mainCategory.playlistId);
  }
}

function shuffledItems(items) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function selectRandomPhrases() {
  const category = activePhraseCategory();
  const choiceIds = phraseChoiceIdsForCategory(category);
  if (!choiceIds.length) return;
  const count = Math.min(Math.max(Number(randomCountInput.value) || 10, 1), choiceIds.length);
  randomCountInput.value = String(count);

  const randomPlaylistId = `loop-${slugifyPhraseTitle(category) || "category"}-random`;
  let randomPlaylist = playlistsByMode.loop.find((playlist) => playlist.id === randomPlaylistId);
  if (!randomPlaylist) {
    randomPlaylist = {
      id: randomPlaylistId,
      name: `Random ${count}`,
      category,
      itemIds: [],
    };
    playlistsByMode.loop.push(randomPlaylist);
  }

  randomPlaylist.name = `Random ${count}`;
  randomPlaylist.category = category;
  randomPlaylist.itemIds = shuffledItems(choiceIds).slice(0, count);
  activateLoopPlaylist(randomPlaylist.id);
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

  stopMainMedia();
  stopPreview();
  previewingId = itemId;
  const source = resolveAudioSource(choice);
  previewAudio.src = source.file;
  updatePlaybackTuning();
  previewAudio.volume = outputVolumeForSource(source);
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
  const media = activeMainMedia();
  media.currentTime = 0;

  try {
    await media.play();
    setPlayingState(true);
  } catch {
    setPlayingState(false);
  }
}

async function skipToNextTrack() {
  const shouldResume = !activeMainMedia().paused;

  selectedIndexByMode[currentMode] = nextQueuedIndex();
  syncSelection({ scrollBehavior: "smooth", updateAudio: true });
  const media = activeMainMedia();
  media.currentTime = 0;

  if (!shouldResume) {
    setPlayingState(false);
    return;
  }

  try {
    primeAudioMeter();
    await media.play();
    setPlayingState(true);
  } catch {
    setPlayingState(false);
  }
}

playButton.addEventListener("click", async () => {
  const media = activeMainMedia();
  if (media.paused) {
    try {
      primeAudioMeter();
      await media.play();
      setPlayingState(true);
    } catch {
      setPlayingState(false);
    }
  } else {
    media.pause();
    media.currentTime = 0;
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

voiceSelect?.addEventListener("change", () => setVoice(voiceSelect.value));
openVoiceRecorderButton?.addEventListener("click", openVoiceRecorder);
closeVoiceRecorderButton?.addEventListener("click", closeVoiceRecorder);
recorderModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    recorderMode = button.dataset.recorderMode;
    recorderPreviewAudio.pause();
    saveRecorderState();
    renderVoiceRecorder();
  });
});
recorderCategorySelect?.addEventListener("change", () => {
  recorderCategory = recorderCategorySelect.value;
  recorderIndex = firstOpenRecorderIndex(recorderCategory);
  saveRecorderState();
  recorderPreviewAudio.pause();
  renderVoiceRecorder();
});
recorderCustomCategorySelect?.addEventListener("change", () => {
  recorderCustomCategory = recorderCustomCategorySelect.value;
  recorderPreviewAudio.pause();
  saveRecorderState();
  renderVoiceRecorder();
});
recorderCustomCategoryInput?.addEventListener("input", () => {
  recorderCustomNewCategory = recorderCustomCategoryInput.value;
  recorderPreviewAudio.pause();
  saveRecorderState();
  renderVoiceRecorder();
});
recorderCustomPhraseInput?.addEventListener("input", () => {
  const cleanPhraseText = customPhraseInputText(recorderCustomPhraseInput.value);
  if (queueCustomPhrasesFromText(cleanPhraseText)) {
    return;
  }
  if (cleanPhraseText !== recorderCustomPhraseInput.value) {
    recorderCustomPhraseInput.value = cleanPhraseText;
  }
  recorderCustomPhrase = cleanPhraseText;
  if (recorderCustomPhraseQueue.length) {
    recorderCustomPhraseQueue[recorderCustomQueueIndex] = normalizeWhitespace(cleanPhraseText);
  }
  recorderPreviewAudio.pause();
  saveRecorderState();
  renderVoiceRecorder();
});
recorderCustomPhraseInput?.addEventListener("paste", (event) => {
  const pastedText = event.clipboardData?.getData("text") || "";
  if (!queueCustomPhrasesFromText(pastedText)) return;

  event.preventDefault();
  recorderPreviewAudio.pause();
});
loadExamplePhraseSetButton?.addEventListener("click", () => {
  recorderPreviewAudio.pause();
  const selectedExample = EXAMPLE_CUSTOM_PHRASE_SETS[examplePhraseSetSelect?.value] ?? EXAMPLE_CUSTOM_PHRASE_SETS["never-quit"];
  recorderCustomCategory = selectedExample.category || DEFAULT_CUSTOM_RECORDED_CATEGORY;
  recorderCustomNewCategory = "";
  queueCustomPhrasesFromText(selectedExample.phrases);
  setRecorderMessage(`Loaded ${selectedExample.title}.`);
});
clearPhraseQueueButton?.addEventListener("click", () => {
  clearCustomPhraseQueue();
  setRecorderMessage("Custom text cleared.");
});
deleteCustomCategoryButton?.addEventListener("click", deleteCurrentCustomCategory);
previousRecorderPhraseButton?.addEventListener("click", () => goToRecorderPhrase(-1));
nextRecorderPhraseButton?.addEventListener("click", () => goToRecorderPhrase(1));
recordPhraseButton?.addEventListener("click", toggleBrowserPhraseRecording);
playRecordedPhraseButton?.addEventListener("click", playCurrentBrowserRecording);
retakeRecordedPhraseButton?.addEventListener("click", retakeCurrentBrowserRecording);
useRecordedVoiceButton?.addEventListener("click", useBrowserRecordedVoice);
volumeDownButton.addEventListener("click", () => adjustVolume(-1));
volumeUpButton.addEventListener("click", () => adjustVolume(1));
volumeControl.parentElement.addEventListener("pointerdown", startVolumeDrag);
repeatModeButton.addEventListener("click", cycleRepeatMode);
shuffleButton.addEventListener("click", toggleShuffle);
nextButton.addEventListener("click", skipToNextTrack);
openPlaylistButton.addEventListener("click", () => goToPage(1));
openPlayerFooterButton?.addEventListener("click", () => goToPage(0));
openRecorderFooterButton?.addEventListener("click", () => goToPage(2));
openPlayerButton.addEventListener("click", () => goToPage(0));
openGuideButton?.addEventListener("click", () => goToPage(3));
closeGuideButton?.addEventListener("click", () => goToPage(0));
openSettingsButton?.addEventListener("click", () => goToPage(4));
closeSettingsButton?.addEventListener("click", () => goToPage(0));
flowingWaveformToggle?.addEventListener("change", () => {
  waveformStyle = flowingWaveformToggle.checked ? "flowing" : "bars";
  localStorage.setItem(WAVEFORM_STYLE_STORAGE_KEY, waveformStyle);
  applyWaveformStyle();
  drawFlowingWaveform(performance.now() / 1000, Boolean(analyser && !audio.paused && !audio.ended));
});
pageDots.forEach((dot, index) => {
  dot.addEventListener("click", () => goToPage(index));
});
pageRail.addEventListener("pointerdown", startPageSwipe);
pageRail.addEventListener("pointermove", movePageSwipe);
pageRail.addEventListener("pointerup", endPageSwipe);
pageRail.addEventListener("pointercancel", endPageSwipe);
playlistSelect.addEventListener("change", () => switchPlaylist(playlistSelect.value));
createPlaylistButton.addEventListener("click", createPlaylist);
fileLoader.addEventListener("change", () => loadFiles(fileLoader.files));
selectAllButton.addEventListener("click", selectAllPhrases);
randomSelectionButton.addEventListener("click", selectRandomPhrases);
speedDownButton.addEventListener("click", () => adjustSpeed(-5));
speedUpButton.addEventListener("click", () => adjustSpeed(5));
playlistEditor.addEventListener("click", (event) => {
  const sectionAdd = event.target.closest("[data-add-group]");
  if (sectionAdd) {
    addPlaylistGroup(sectionAdd.dataset.addGroup);
    return;
  }

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

mainCategorySelect?.addEventListener("change", () => activateMainCategory(mainCategorySelect.value));

previewAudio.addEventListener("ended", () => {
  previewingId = null;
  renderPlaylistEditor();
});

volumeControl.addEventListener("input", updateVolume);
volumeControl.addEventListener("change", updateVolume);
conversationSeek?.addEventListener("pointerdown", (event) => {
  isSeekingConversation = true;
  conversationSeek.setPointerCapture?.(event.pointerId);
  seekConversationFromPointer(event);
});
conversationSeek?.addEventListener("pointermove", (event) => {
  if (isSeekingConversation) {
    seekConversationFromPointer(event);
  }
});
conversationSeek?.addEventListener("pointerup", (event) => {
  seekConversationFromPointer(event);
  isSeekingConversation = false;
  conversationSeek.releasePointerCapture?.(event.pointerId);
  updateConversationProgress();
});
conversationSeek?.addEventListener("pointercancel", () => {
  isSeekingConversation = false;
  updateConversationProgress();
});
conversationSeek?.addEventListener("input", () => {
  seekConversationTo(Number(conversationSeek.value) || 0);
  updateConversationProgress();
});
conversationSeek?.addEventListener("change", () => {
  seekConversationTo(Number(conversationSeek.value) || 0);
  isSeekingConversation = false;
  updateConversationProgress();
});
conversationSeek?.addEventListener("keydown", (event) => {
  const media = activeMainMedia();
  const duration = Number.isFinite(media.duration) ? media.duration : 0;
  if (currentMode !== "conversation" || duration <= 0) return;

  const step = event.shiftKey ? 30 : 5;
  let nextTime = media.currentTime;

  if (event.key === "ArrowLeft") nextTime -= step;
  else if (event.key === "ArrowRight") nextTime += step;
  else if (event.key === "Home") nextTime = 0;
  else if (event.key === "End") nextTime = duration;
  else return;

  event.preventDefault();
  seekConversationTo(nextTime);
  updateConversationProgress();
});
speedControl.addEventListener("input", updatePlaybackTuning);
speedControl.addEventListener("change", updatePlaybackTuning);
audio.addEventListener("loadedmetadata", () => {
  updatePlaybackTuning({ save: false });
  updateConversationProgress();
});
previewAudio.addEventListener("loadedmetadata", () => updatePlaybackTuning({ save: false }));
recorderPreviewAudio.addEventListener("loadedmetadata", () => updatePlaybackTuning({ save: false }));
audio.addEventListener("timeupdate", updateConversationProgress);
audio.addEventListener("play", () => {
  primeAudioMeter();
  setPlayingState(true);
  updateConversationProgress();
});
audio.addEventListener("pause", startMeterAnimation);
audio.addEventListener("pause", updateConversationProgress);

renderAudioMeter();
applyAudioLooping();
updateQueueButtons();
playerPanel.dataset.mode = currentMode;
loadBrowserRecordedPhrases().catch(() => {
  syncBrowserRecordedVoiceOption();
});
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

function handleMainMediaEnded(event) {
  if (repeatMode !== "all") {
    setPlayingState(false);
    return;
  }

  playQueuedTrack();
}

audio.addEventListener("ended", handleMainMediaEnded);
