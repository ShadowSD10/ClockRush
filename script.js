const difficultyPresets = {
  Beginner: {
    name: "Beginner",
    viewingTime: 30,
    minuteIncrement: 5,
    clockFaces: ["Numbers"]
  },
  Easy: {
    name: "Easy",
    viewingTime: 20,
    minuteIncrement: 5,
    clockFaces: ["Numbers", "Roman"]
  },
  Medium: {
    name: "Medium",
    viewingTime: 15,
    minuteIncrement: 1,
    clockFaces: ["Numbers", "Roman", "Important Numbers"]
  },
  Hard: {
    name: "Hard",
    viewingTime: 10,
    minuteIncrement: 1,
    clockFaces: ["Numbers", "Roman", "Important Numbers", "Minimal"]
  },
  Advanced: {
    name: "Advanced",
    viewingTime: 5,
    minuteIncrement: 1,
    clockFaces: ["Minimal"]
  }
};

const settings = {
  difficulty: {
    selectedKey: "Medium",
    custom: {
      minutePrecision: "one",
      viewingTime: 15,
      clockFace: "Numbers"
    }
  },
  audio: {
    soundEffects: true,
    music: true
  },
  appearance: {
    theme: "Midnight"
  }
};

const audio = {
  bgm: new Audio("assets/bgm.mp3"),
  confirm: new Audio("assets/confirm.mp3"),
  popup: new Audio("assets/popup.mp3"),
  error: new Audio("assets/error.mp3"),
  correct: new Audio("assets/correct.mp3")
};

const gameModeConfig = {
  "Quick Rush": {
    key: "Quick Rush",
    roundsLimit: 10,
    autoAdvance: true,
    countdownSeconds: 2.5,
    description: "10 rounds, automatic advancement."
  },
  Endless: {
    key: "Endless",
    roundsLimit: null,
    autoAdvance: true,
    countdownSeconds: 2.5,
    description: "Keep playing until you quit."
  },
  Survival: {
    key: "Survival",
    roundsLimit: null,
    autoAdvance: true,
    countdownSeconds: 2.5,
    description: "Three lives. Make them count."
  },
  "Time Attack": {
    key: "Time Attack",
    roundsLimit: null,
    autoAdvance: true,
    countdownSeconds: 2.5,
    durationMs: 60000,
    description: "60 seconds to chase a high score."
  },
  Adaptive: {
    key: "Adaptive",
    roundsLimit: null,
    autoAdvance: true,
    countdownSeconds: 2.5,
    description: "Starts at Easy and scales with performance."
  }
};

const state = {
  currentDifficulty: difficultyPresets.Medium,
  targetTime: { hour: 12, minute: 0 },
  selectedHour: 12,
  selectedMinute: 0,
  phase: "menu",
  roundActive: false,
  answerLocked: false,
  viewingStartTimestamp: 0,
  viewingTimerFrameId: null,
  activeClockFace: "Numbers",
  recognitionTime: null,
  answerMode: "scroller",
  wheels: {},
  optionsContext: "menu",
  drawerOpen: false,
  modalType: null,
  modalConfirmAction: null,
  selectedModeKey: "Quick Rush",
  session: {
    active: false,
    modeKey: "Quick Rush",
    startedAt: 0,
    deadlineMs: 0,
    remainingMs: 60000,
    timerFrameId: null,
    timerPausedForTransition: false,
    roundClockStartedAt: 0,
    roundClockElapsedMs: 0,
    clockSpecificRemainingMs: 0,
    roundsPlayed: 0,
    correct: 0,
    incorrect: 0,
    bestStreak: 0,
    reason: null,
    statusLabel: "Completed"
  },
  survival: {
    livesSetting: 3,
    lives: 3
  },
  adaptive: {
    currentKey: "Easy",
    recentResults: [],
    performanceState: "Steady Pace"
  },
  transition: {
    active: false,
    durationMs: 2500,
    startTime: 0,
    frameId: null,
    timeoutId: null
  },
  stats: {
    score: 0,
    streak: 0,
    correct: 0,
    answered: 0,
    incorrect: 0,
    bestTime: Number.POSITIVE_INFINITY,
    bestStreak: 0
  }
};

const dom = {
  startScreen: document.getElementById("startScreen"),
  startButton: document.getElementById("startButton"),
  optionsButton: document.getElementById("optionsButton"),
  optionsScreen: document.getElementById("optionsScreen"),
  customDifficultyScreen: document.getElementById("customDifficultyScreen"),
  backToMenuButton: document.getElementById("backToMenuButton"),
  customDifficultyButton: document.getElementById("customDifficultyButton"),
  difficultyOptions: document.getElementById("difficultyOptions"),
  activeDifficultyLabel: document.getElementById("activeDifficultyLabel"),
  difficultyDetails: document.getElementById("difficultyDetails"),
  themeSelect: document.getElementById("themeSelect"),
  soundEffectsToggle: document.getElementById("soundEffectsToggle"),
  musicToggle: document.getElementById("musicToggle"),
  customViewingTimeRange: document.getElementById("customViewingTimeRange"),
  customViewingTimeLabel: document.getElementById("customViewingTimeLabel"),
  saveCustomDifficultyButton: document.getElementById("saveCustomDifficultyButton"),
  cancelCustomDifficultyButton: document.getElementById("cancelCustomDifficultyButton"),
  gamePanel: document.getElementById("gamePanel"),
  clockCard: document.querySelector(".clock-card"),
  phaseIndicator: document.getElementById("phaseIndicator"),
  clockSvg: document.getElementById("clockSvg"),
  timerValue: document.getElementById("timerValue"),
  submitBtn: document.getElementById("submitBtn"),
  feedback: document.getElementById("feedback"),
  scoreValue: document.getElementById("scoreValue"),
  streakValue: document.getElementById("streakValue"),
  accuracyValue: document.getElementById("accuracyValue"),
  bestTimeValue: document.getElementById("bestTimeValue"),
  questionValue: document.getElementById("questionValue"),
  hourHand: document.getElementById("hourHand"),
  minuteHand: document.getElementById("minuteHand"),
  clockFace: document.getElementById("clockFace"),
  roundTransitionPanel: document.getElementById("roundTransitionPanel"),
  transitionCountdownText: document.getElementById("transitionCountdownText"),
  transitionProgressFill: document.getElementById("transitionProgressFill"),
  resultsScreen: document.getElementById("resultsScreen"),
  resultsTitle: document.getElementById("resultsTitle"),
  resultsModeLabel: document.getElementById("resultsModeLabel"),
  resultsRounds: document.getElementById("resultsRounds"),
  resultsCorrect: document.getElementById("resultsCorrect"),
  resultsIncorrect: document.getElementById("resultsIncorrect"),
  resultsAccuracy: document.getElementById("resultsAccuracy"),
  resultsScore: document.getElementById("resultsScore"),
  resultsBestStreak: document.getElementById("resultsBestStreak"),
  resultsBestTime: document.getElementById("resultsBestTime"),
  resultsStatus: document.getElementById("resultsStatus"),
  resultsMenuButton: document.getElementById("resultsMenuButton"),
  gameMenuButton: document.getElementById("gameMenuButton"),
  gameDrawer: document.getElementById("gameDrawer"),
  gameDrawerBackdrop: document.getElementById("gameDrawerBackdrop"),
  drawerCloseButton: document.getElementById("drawerCloseButton"),
  drawerContinueButton: document.getElementById("drawerContinueButton"),
  drawerOptionsButton: document.getElementById("drawerOptionsButton"),
  drawerQuitButton: document.getElementById("drawerQuitButton"),
  confirmationModal: document.getElementById("confirmationModal"),
  confirmationTitle: document.getElementById("confirmationTitle"),
  confirmationDescription: document.getElementById("confirmationDescription"),
  modalCancelButton: document.getElementById("modalCancelButton"),
  modalConfirmButton: document.getElementById("modalConfirmButton"),
  scrollerAnswerPanel: document.getElementById("scrollerAnswerPanel"),
  typeAnswerPanel: document.getElementById("typeAnswerPanel"),
  hourTypeInput: document.getElementById("hourTypeInput"),
  minuteTypeInput: document.getElementById("minuteTypeInput"),
  answerModeButtons: Array.from(document.querySelectorAll(".mode-btn")),
  modeChoiceButtons: Array.from(document.querySelectorAll(".mode-choice")),
  survivalLifeInputs: Array.from(document.querySelectorAll('input[name="survivalLives"]')),
  gameMetaBar: document.getElementById("gameMetaBar"),
  gameModeTitle: document.getElementById("gameModeTitle")
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatTimeDisplay(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function normalizeCircularValue(value, min, max) {
  const size = max - min + 1;
  return min + (((value - min) % size) + size) % size;
}

function getWheelConfig(type) {
  if (type === "hour") {
    return { min: 1, max: 12, defaultValue: 12 };
  }

  return { min: 0, max: 59, defaultValue: 0 };
}

function getFaceSetForConfig(value) {
  if (!value || value === "Classic") {
    return ["Numbers"];
  }

  if (value === "Random") {
    return ["Numbers", "Roman", "Important Numbers", "Minimal"];
  }

  if (value === "Minimal") {
    return ["Minimal"];
  }

  if (value === "Roman") {
    return ["Roman"];
  }

  if (value === "Important Numbers") {
    return ["Important Numbers"];
  }

  return ["Numbers"];
}

function describeClockFaceSet(faceSet = []) {
  const normalized = faceSet.map((face) => (face === "Classic" ? "Numbers" : face));
  return normalized.join(" + ") || "Numbers";
}

function getSelectedDifficultyConfig() {
  if (settings.difficulty.selectedKey === "Custom") {
    const custom = settings.difficulty.custom;
    const minuteIncrement = custom.minutePrecision === "five" ? 5 : 1;
    const viewingTime = clamp(Number(custom.viewingTime) || 15, 1, 60);
    const clockFaces = getFaceSetForConfig(custom.clockFace);

    return {
      name: "Custom",
      viewingTime,
      minuteIncrement,
      clockFaces
    };
  }

  return difficultyPresets[settings.difficulty.selectedKey] || difficultyPresets.Medium;
}

function getDifficultyMetadataForKey(key = settings.difficulty.selectedKey) {
  if (key === "Custom") {
    const custom = settings.difficulty.custom;
    const minuteIncrement = custom.minutePrecision === "five" ? 5 : 1;
    const viewingTime = clamp(Number(custom.viewingTime) || 15, 1, 60);
    const clockFaces = getFaceSetForConfig(custom.clockFace);

    return {
      key,
      name: "Custom",
      viewingTime,
      minuteIncrement,
      clockFaces,
      precisionLabel: minuteIncrement === 5 ? "5-minute increments" : "Every minute",
      clockFaceLabel: describeClockFaceSet(clockFaces)
    };
  }

  const preset = difficultyPresets[key];
  if (!preset) {
    return getDifficultyMetadataForKey("Medium");
  }

  return {
    key,
    name: preset.name,
    viewingTime: preset.viewingTime,
    minuteIncrement: preset.minuteIncrement,
    clockFaces: preset.clockFaces,
    precisionLabel: preset.minuteIncrement === 5 ? "5-minute increments" : "Every minute",
    clockFaceLabel: describeClockFaceSet(preset.clockFaces)
  };
}

function getActiveDifficulty() {
  return state.currentDifficulty;
}

function getMinuteOptionsForDifficulty(difficulty = getActiveDifficulty()) {
  const minuteValues = [];
  const increment = difficulty?.minuteIncrement || 1;

  for (let minute = 0; minute < 60; minute += increment) {
    minuteValues.push(minute);
  }

  return minuteValues;
}

function normalizeMinuteValue(value) {
  const allowedMinutes = getMinuteOptionsForDifficulty();
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const clampedValue = clamp(Math.round(numericValue), 0, 59);

  if (allowedMinutes.includes(clampedValue)) {
    return clampedValue;
  }

  let nearestValue = allowedMinutes[0] ?? 0;
  let smallestDifference = Number.POSITIVE_INFINITY;

  for (const minuteValue of allowedMinutes) {
    const difference = Math.abs(minuteValue - clampedValue);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      nearestValue = minuteValue;
    }
  }

  return nearestValue;
}

function chooseClockFace() {
  const allowedFaces = getActiveDifficulty().clockFaces;
  const chosenFace = allowedFaces[Math.floor(Math.random() * allowedFaces.length)];
  return chosenFace || "Numbers";
}

function generateMinuteOptions() {
  return getMinuteOptionsForDifficulty();
}

function generateRandomTime() {
  const hour = Math.floor(Math.random() * 12) + 1;
  const minuteOptions = generateMinuteOptions();
  const minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];

  return { hour, minute };
}

function buildWheelValueList(type, centerValue) {
  const config = getWheelConfig(type);
  const values = [];

  if (type === "minute") {
    const validValues = getMinuteOptionsForDifficulty();
    const centerIndex = validValues.indexOf(normalizeMinuteValue(centerValue));

    for (let offset = -3; offset <= 3; offset += 1) {
      const nextIndex = clamp(centerIndex + offset, 0, validValues.length - 1);
      values.push(validValues[nextIndex]);
    }

    return values;
  }

  for (let offset = -3; offset <= 3; offset += 1) {
    values.push(normalizeCircularValue(centerValue + offset, config.min, config.max));
  }

  return values;
}

function updateSelectedValue(type, value) {
  const config = getWheelConfig(type);
  const normalizedValue = type === "minute"
    ? normalizeMinuteValue(value)
    : normalizeCircularValue(value, config.min, config.max);

  if (type === "hour") {
    state.selectedHour = normalizedValue;
  } else {
    state.selectedMinute = normalizedValue;
  }

  const wheel = state.wheels[type];
  if (!wheel) {
    return;
  }

  wheel.currentValue = normalizedValue;
  wheel.element.innerHTML = buildWheelValueList(type, normalizedValue)
    .map((entry, index) => {
      const className = index === 3 ? "wheel-item selected" : "wheel-item";
      return `<div class="${className}">${String(entry).padStart(2, "0")}</div>`;
    })
    .join("");

  if (state.answerMode === "type") {
    syncAnswerInputs();
  }
}

function setWheelValue(type, value) {
  const config = getWheelConfig(type);
  const normalizedValue = type === "minute"
    ? normalizeMinuteValue(value)
    : normalizeCircularValue(value, config.min, config.max);

  if (type === "hour") {
    state.selectedHour = normalizedValue;
  } else {
    state.selectedMinute = normalizedValue;
  }

  updateSelectedValue(type, normalizedValue);
}

function syncAnswerInputs({ force = false } = {}) {
  if (dom.hourTypeInput && (force || document.activeElement !== dom.hourTypeInput)) {
    dom.hourTypeInput.value = String(state.selectedHour);
    dom.hourTypeInput.removeAttribute("aria-invalid");
  }

  if (dom.minuteTypeInput && (force || document.activeElement !== dom.minuteTypeInput)) {
    dom.minuteTypeInput.value = String(state.selectedMinute).padStart(2, "0");
    dom.minuteTypeInput.removeAttribute("aria-invalid");
  }
}

function resetTypedAnswerInputs() {
  [dom.hourTypeInput, dom.minuteTypeInput].forEach((input) => {
    if (input) {
      input.value = "";
      input.removeAttribute("aria-invalid");
    }
  });
}

function setAnswerMode(mode) {
  state.answerMode = mode;

  const isScroller = mode === "scroller";
  if (dom.scrollerAnswerPanel) {
    dom.scrollerAnswerPanel.classList.toggle("hidden", !isScroller);
  }

  if (dom.typeAnswerPanel) {
    dom.typeAnswerPanel.classList.toggle("hidden", isScroller);
  }

  dom.answerModeButtons.forEach((button) => {
    const isActive = button.dataset.inputMode === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  syncAnswerInputs({ force: true });

  if (state.wheels.hour) {
    setWheelValue("hour", state.selectedHour);
  }

  if (state.wheels.minute) {
    setWheelValue("minute", state.selectedMinute);
  }
}

function sanitizeTypedValue(type, rawValue) {
  if (rawValue === "") {
    return null;
  }

  if (rawValue.includes(".") || rawValue.includes("e") || rawValue.includes("E") || rawValue.includes("+") || rawValue.includes("-")) {
    return null;
  }

  const stripped = rawValue.replace(/\D/g, "");
  if (!stripped) {
    return null;
  }

  const numericValue = Number(stripped);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  if (type === "hour") {
    if (numericValue < 1 || numericValue > 12 || !Number.isInteger(numericValue)) {
      return null;
    }
    return numericValue;
  }

  const validMinutes = getMinuteOptionsForDifficulty();
  const wholeValue = Math.round(numericValue);

  if (wholeValue < 0 || wholeValue > 59 || !Number.isInteger(wholeValue) || !validMinutes.includes(wholeValue)) {
    return null;
  }

  return wholeValue;
}

function setTypedAnswerValue(type, input) {
  const value = sanitizeTypedValue(type, input.value);
  const isEmpty = input.value === "";

  input.toggleAttribute("aria-invalid", !isEmpty && value === null);
  if (value === null) {
    return null;
  }

  setWheelValue(type, value);
  return value;
}

function getTypedAnswer() {
  const hour = setTypedAnswerValue("hour", dom.hourTypeInput);
  const minute = setTypedAnswerValue("minute", dom.minuteTypeInput);

  if (hour === null || minute === null) {
    dom.feedback.className = "feedback error";
    dom.feedback.innerHTML = `
      <span class="feedback-title">Enter a valid time</span>
      <span class="feedback-copy">Hour: 1–12. Minute: ${getActiveDifficulty().minuteIncrement === 5 ? "00, 05, 10 … 55" : "00–59"}.</span>
    `;
    return null;
  }

  return { hour, minute };
}

function attachWheelInteractions(type) {
  const wheel = state.wheels[type];
  const element = wheel.element;

  element.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    element.setPointerCapture?.(event.pointerId);
    wheel.dragging = {
      active: true,
      startY: event.clientY,
      startValue: wheel.currentValue,
      startIndex: type === "minute" ? getMinuteOptionsForDifficulty().indexOf(wheel.currentValue) : null
    };
    element.classList.add("dragging");
    document.body.style.userSelect = "none";
  });

  element.addEventListener("pointermove", (event) => {
    if (!wheel.dragging || !wheel.dragging.active) {
      return;
    }

    const pixelsPerStep = type === "minute" ? wheel.itemHeight * 1.35 : wheel.itemHeight;
    const deltaStep = Math.round((wheel.dragging.startY - event.clientY) / pixelsPerStep);

    if (type === "minute") {
      const validValues = getMinuteOptionsForDifficulty();
      const nextIndex = clamp(wheel.dragging.startIndex + deltaStep, 0, validValues.length - 1);
      const nextValue = validValues[nextIndex];

      if (nextValue !== wheel.currentValue) {
        updateSelectedValue(type, nextValue);
      }
      return;
    }

    const nextValue = normalizeCircularValue(
      wheel.dragging.startValue + deltaStep,
      getWheelConfig(type).min,
      getWheelConfig(type).max
    );

    if (nextValue !== wheel.currentValue) {
      updateSelectedValue(type, nextValue);
    }
  });

  const finishPointerInteraction = (event) => {
    if (!wheel.dragging || !wheel.dragging.active) {
      return;
    }

    wheel.dragging.active = false;
    element.classList.remove("dragging");
    document.body.style.userSelect = "";

    if (event && typeof event.pointerId !== "undefined") {
      try {
        element.releasePointerCapture(event.pointerId);
      } catch (error) {
        // Ignore pointer release mismatches.
      }
    }
  };

  element.addEventListener("pointerup", finishPointerInteraction);
  element.addEventListener("pointercancel", finishPointerInteraction);
  element.addEventListener("pointerleave", (event) => {
    if (wheel.dragging && wheel.dragging.active && event.pressure === 0) {
      finishPointerInteraction(event);
    }
  });

  element.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const deltaInPixels = event.deltaY * (event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? element.clientHeight : 1);
      wheel.wheelDelta = (wheel.wheelDelta || 0) + deltaInPixels;
      const threshold = 80;
      if (Math.abs(wheel.wheelDelta) < threshold) {
        return;
      }

      const direction = wheel.wheelDelta > 0 ? -1 : 1;
      wheel.wheelDelta -= Math.sign(wheel.wheelDelta) * threshold;

      if (type === "minute") {
        const validValues = getMinuteOptionsForDifficulty();
        const currentIndex = validValues.indexOf(wheel.currentValue);
        const nextIndex = clamp(currentIndex + direction, 0, validValues.length - 1);
        updateSelectedValue(type, validValues[nextIndex]);
        return;
      }

      const nextValue = normalizeCircularValue(
        wheel.currentValue + direction,
        getWheelConfig(type).min,
        getWheelConfig(type).max
      );
      updateSelectedValue(type, nextValue);
    },
    { passive: false }
  );
}

function renderWheel(type, defaultValue) {
  const wheelElement = document.getElementById(`${type}List`);
  const config = getWheelConfig(type);
  const normalizedValue = normalizeCircularValue(defaultValue ?? config.defaultValue, config.min, config.max);

  state.wheels[type] = {
    type,
    element: wheelElement,
    itemHeight: 42,
    currentValue: normalizedValue,
    dragging: null,
    wheelDelta: 0
  };

  updateSelectedValue(type, normalizedValue);
  attachWheelInteractions(type);
}

function applyTheme() {
  const themeName = settings.appearance.theme || "Midnight";
  document.body.setAttribute("data-theme", themeName.toLowerCase());
  if (dom.themeSelect) {
    dom.themeSelect.value = themeName;
  }
}

function playSfx(type) {
  if (!settings.audio.soundEffects) {
    return;
  }

  const sound = audio[type];
  if (!sound) {
    return;
  }

  try {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  } catch (error) {
    // Ignore browser autoplay or media playback restrictions.
  }
}

function syncMusicState() {
  if (!settings.audio.music) {
    audio.bgm.pause();
    audio.bgm.currentTime = 0;
    return;
  }

  audio.bgm.loop = true;
  audio.bgm.volume = 0.45;
  audio.bgm.play().catch(() => {});
}

function updateAudioToggles() {
  dom.soundEffectsToggle.textContent = settings.audio.soundEffects ? "ON" : "OFF";
  dom.soundEffectsToggle.dataset.enabled = String(settings.audio.soundEffects);
  dom.musicToggle.textContent = settings.audio.music ? "ON" : "OFF";
  dom.musicToggle.dataset.enabled = String(settings.audio.music);
  syncMusicState();
}

function formatModeClockValue(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getHeartString(lives, maxLives = 3) {
  const safeLives = clamp(Number(lives) || 0, 0, maxLives);
  return Array.from({ length: maxLives }, (_, index) => (index < safeLives ? "❤️" : "♡")).join(" ");
}

function getCurrentModeLabel() {
  const activeMode = state.session.active ? state.session.modeKey : state.selectedModeKey;

  if (activeMode === "Adaptive") {
    return `Adaptive · ${state.adaptive.currentKey}`;
  }

  if (activeMode === "Survival") {
    return `Survival · ${getHeartString(state.survival.lives, state.survival.livesSetting || 3)}`;
  }

  return activeMode;
}

function getSurvivalModeDescription() {
  return state.survival.livesSetting === 1
    ? "One mistake ends the run."
    : "Three lives. Make them count.";
}

function syncSurvivalModeDescription() {
  const survivalButton = dom.modeChoiceButtons.find((button) => button.dataset.modeKey === "Survival");
  const descriptionEl = survivalButton?.querySelector(".mode-description");

  if (descriptionEl) {
    descriptionEl.textContent = getSurvivalModeDescription();
  }
}

function updateGameHeaderMeta() {
  const activeMode = state.session.active ? state.session.modeKey : state.selectedModeKey;

  if (dom.gameModeTitle) {
    dom.gameModeTitle.textContent = activeMode;
  }

  if (activeMode === "Quick Rush") {
    const roundNumber = Math.min(state.session.roundsPlayed + 1, 10);
    dom.gameMetaBar.innerHTML = `<span class="game-meta-line">Round ${roundNumber} / 10</span>`;
    return;
  }

  if (activeMode === "Endless") {
    const roundNumber = Math.max(1, state.stats.answered + 1);
    dom.gameMetaBar.innerHTML = `<span class="game-meta-line">Round ${roundNumber}</span>`;
    return;
  }

  if (activeMode === "Survival") {
    const lives = state.session.active ? state.survival.lives : state.survival.livesSetting;
    const hearts = getHeartString(lives, state.survival.livesSetting || 3);
    dom.gameMetaBar.innerHTML = `<span class="game-meta-line">${hearts}</span>`;
    return;
  }

  if (activeMode === "Time Attack") {
    dom.gameMetaBar.innerHTML = `<span class="game-meta-line">${formatModeClockValue(state.session.remainingMs)}</span>`;
    return;
  }

  if (activeMode === "Adaptive") {
    const performance = state.adaptive.performanceState || "Steady Pace";
    dom.gameMetaBar.innerHTML = `
      <span class="game-meta-line">Difficulty · ${state.adaptive.currentKey}</span>
      <span class="game-meta-line">Performance · ${performance}</span>
    `;
    return;
  }

  dom.gameMetaBar.innerHTML = `<span class="game-meta-line">${activeMode}</span>`;
}

function stopSessionTimer() {
  if (state.session.timerFrameId) {
    window.cancelAnimationFrame(state.session.timerFrameId);
    state.session.timerFrameId = null;
  }
}

function pauseTimeAttackTimer() {
  if (state.session.active && state.session.modeKey === "Time Attack" && !state.session.timerPausedForTransition) {
    state.session.remainingMs = Math.max(0, state.session.deadlineMs - performance.now());
    state.session.timerPausedForTransition = true;
    stopSessionTimer();
    updatePhaseIndicator();
  }
}

function resumeTimeAttackTimer() {
  if (!state.session.active || state.session.modeKey !== "Time Attack") {
    return;
  }

  if (state.session.timerPausedForTransition) {
    state.session.deadlineMs = performance.now() + Math.max(0, state.session.remainingMs);
    state.session.timerPausedForTransition = false;
    state.session.roundClockStartedAt = performance.now();
    updatePhaseIndicator();
    state.session.timerFrameId = window.requestAnimationFrame(updateTimeAttackTimer);
  }
}

function updateTimeAttackTimer() {
  if (!state.session.active || state.session.modeKey !== "Time Attack" || state.session.timerPausedForTransition) {
    return;
  }

  const remainingMs = Math.max(0, state.session.deadlineMs - performance.now());
  state.session.remainingMs = remainingMs;
  updateGameHeaderMeta();

  if (remainingMs <= 0) {
    stopSessionTimer();
    endSession("Time expired", "Time expired");
    return;
  }

  state.session.timerFrameId = window.requestAnimationFrame(updateTimeAttackTimer);
}

function startTimeAttackTimer() {
  if (!state.session.active || state.session.modeKey !== "Time Attack") {
    return;
  }

  stopSessionTimer();
  state.session.remainingMs = 60000;
  state.session.deadlineMs = performance.now() + 60000;
  state.session.timerPausedForTransition = false;
  updatePhaseIndicator();
  state.session.timerFrameId = window.requestAnimationFrame(updateTimeAttackTimer);
}

function getGameModeConfig(modeKey = state.selectedModeKey) {
  return gameModeConfig[modeKey] || gameModeConfig["Quick Rush"];
}

function syncModeSelectionUI() {
  dom.modeChoiceButtons.forEach((button) => {
    const matchesCurrent = button.dataset.modeKey === state.selectedModeKey;
    button.classList.toggle("active", matchesCurrent);
    button.setAttribute("aria-pressed", String(matchesCurrent));
  });
  syncSurvivalModeDescription();
}

function setSelectedMode(modeKey) {
  const nextConfig = getGameModeConfig(modeKey);
  if (!nextConfig) {
    return;
  }

  state.selectedModeKey = modeKey;
  syncModeSelectionUI();
}

function resetSessionStats() {
  state.stats = {
    score: 0,
    streak: 0,
    correct: 0,
    answered: 0,
    incorrect: 0,
    bestTime: Number.POSITIVE_INFINITY,
    bestStreak: 0
  };
  state.session.correct = 0;
  state.session.incorrect = 0;
  state.session.roundsPlayed = 0;
  state.session.bestStreak = 0;
  updateStats();
}

function getCurrentDifficultyForSession() {
  if (state.selectedModeKey === "Adaptive") {
    return difficultyPresets[state.adaptive.currentKey] || difficultyPresets.Easy;
  }

  return getSelectedDifficultyConfig();
}

function adjustAdaptiveDifficulty(correct) {
  if (state.selectedModeKey !== "Adaptive") {
    return;
  }

  const order = ["Beginner", "Easy", "Medium", "Hard", "Advanced"];
  const currentIndex = order.indexOf(state.adaptive.currentKey);
  const nextResults = [...state.adaptive.recentResults, correct];

  if (nextResults.length > 5) {
    nextResults.shift();
  }

  state.adaptive.recentResults = nextResults;

  if (nextResults.length < 3) {
    state.adaptive.performanceState = correct ? "Finding Your Rhythm" : "Needs Recovery";
    return;
  }

  const correctCount = nextResults.filter(Boolean).length;
  const recentRatio = correctCount / nextResults.length;

  if (recentRatio >= 0.85 && currentIndex < order.length - 1) {
    state.adaptive.currentKey = order[Math.min(currentIndex + 1, order.length - 1)];
    state.adaptive.performanceState = "Locked In";
    state.adaptive.recentResults = [];
    return;
  }

  if (recentRatio >= 0.7) {
    state.adaptive.performanceState = "Great Form";
    state.adaptive.recentResults = [];
    return;
  }

  if (recentRatio >= 0.55) {
    state.adaptive.performanceState = "Finding Your Rhythm";
    state.adaptive.recentResults = [];
    return;
  }

  if (recentRatio >= 0.4) {
    state.adaptive.performanceState = "Steady Pace";
    state.adaptive.recentResults = [];
    return;
  }

  if (recentRatio >= 0.25 && currentIndex > 0) {
    state.adaptive.currentKey = order[Math.max(currentIndex - 1, 0)];
    state.adaptive.performanceState = "Losing Pace";
    state.adaptive.recentResults = [];
    return;
  }

  if (currentIndex > 0) {
    state.adaptive.currentKey = order[Math.max(currentIndex - 1, 0)];
  }

  state.adaptive.performanceState = "Under Pressure";
  state.adaptive.recentResults = [];
}

function clearTransitionCountdown() {
  if (state.transition.frameId) {
    window.cancelAnimationFrame(state.transition.frameId);
    state.transition.frameId = null;
  }

  if (state.transition.timeoutId) {
    clearTimeout(state.transition.timeoutId);
    state.transition.timeoutId = null;
  }

  state.transition.active = false;
  dom.roundTransitionPanel.classList.add("hidden");
  dom.transitionCountdownText.textContent = "2.5s";
  dom.transitionProgressFill.style.width = "100%";

  if (state.session.active && state.session.modeKey === "Time Attack" && state.session.timerPausedForTransition) {
    state.session.roundClockStartedAt = performance.now();
    resumeTimeAttackTimer();
  }
}

function updateTransitionCountdown() {
  if (!state.transition.active) {
    return;
  }

  const elapsed = performance.now() - state.transition.startTime;
  const remaining = Math.max(0, state.transition.durationMs - elapsed);
  const remainingRatio = remaining / state.transition.durationMs;

  dom.transitionCountdownText.textContent = `${(remaining / 1000).toFixed(1)}s`;
  dom.transitionProgressFill.style.width = `${Math.max(0, remainingRatio * 100)}%`;

  if (remaining <= 0) {
    clearTransitionCountdown();
    if (state.session.active) {
      beginRound();
    }
    return;
  }

  state.transition.frameId = window.requestAnimationFrame(updateTransitionCountdown);
}

function startRoundTransition() {
  if (!state.session.active) {
    return;
  }

  clearTransitionCountdown();
  if (state.session.modeKey === "Time Attack") {
    const effectiveRoundElapsedMs = state.session.roundClockElapsedMs + (state.session.roundClockStartedAt ? performance.now() - state.session.roundClockStartedAt : 0);
    state.session.roundClockElapsedMs = effectiveRoundElapsedMs;
    state.session.roundClockStartedAt = 0;
    pauseTimeAttackTimer();
  }

  state.transition.active = true;
  state.transition.startTime = performance.now();
  state.transition.durationMs = getGameModeConfig(state.session.modeKey).countdownSeconds * 1000;
  dom.roundTransitionPanel.classList.remove("hidden");
  updateTransitionCountdown();
}

function showResultsScreen() {
  closeGameMenu();
  closeConfirmationModal();
  dom.startScreen.classList.add("hidden");
  dom.optionsScreen.classList.add("hidden");
  dom.customDifficultyScreen.classList.add("hidden");
  dom.gamePanel.classList.add("hidden");
  dom.resultsScreen.classList.remove("hidden");
  state.phase = "result";
}

function updateResultsScreen() {
  const roundsPlayed = state.session.roundsPlayed || state.stats.answered || 0;
  const correct = state.stats.correct || state.session.correct || 0;
  const incorrect = Math.max(0, roundsPlayed - correct);
  const accuracy = roundsPlayed > 0 ? (correct / roundsPlayed) * 100 : 0;
  const bestStreakValue = state.stats.bestStreak || state.session.bestStreak || 0;
  const bestTimeValue = Number.isFinite(state.stats.bestTime) ? `${state.stats.bestTime.toFixed(2)}s` : "-";

  dom.resultsTitle.textContent = state.session.statusLabel || "Session Complete";
  dom.resultsModeLabel.textContent = `Mode: ${state.session.modeKey || state.selectedModeKey}`;
  dom.resultsRounds.textContent = String(roundsPlayed);
  dom.resultsCorrect.textContent = String(correct);
  dom.resultsIncorrect.textContent = String(incorrect);
  dom.resultsAccuracy.textContent = `${Math.round(accuracy)}%`;
  dom.resultsScore.textContent = String(state.stats.score);
  dom.resultsBestStreak.textContent = String(bestStreakValue);
  dom.resultsBestTime.textContent = bestTimeValue;
  dom.resultsStatus.textContent = state.session.reason ? state.session.reason : "Completed";
}

function endSession(reason, statusLabel) {
  if (!state.session.active) {
    return;
  }

  state.session.active = false;
  state.session.reason = reason;
  state.session.statusLabel = statusLabel;
  state.session.bestStreak = Math.max(state.session.bestStreak, state.stats.bestStreak || 0);
  state.session.timerPausedForTransition = false;
  stopSessionTimer();
  clearTransitionCountdown();
  stopViewingTimer();
  state.roundActive = false;
  state.answerLocked = false;
  state.phase = "menu";
  updateResultsScreen();
  showResultsScreen();
}

function beginSession(modeKey) {
  const nextMode = modeKey || state.selectedModeKey;
  state.selectedModeKey = nextMode;
  stopSessionTimer();
  clearTransitionCountdown();
  stopViewingTimer();
  state.roundActive = false;
  state.answerLocked = false;
  state.phase = "menu";
  state.recognitionTime = null;
  state.viewingStartTimestamp = 0;
  state.session = {
    active: true,
    modeKey: nextMode,
    startedAt: performance.now(),
    deadlineMs: 0,
    remainingMs: 60000,
    timerFrameId: null,
    timerPausedForTransition: false,
    roundClockStartedAt: 0,
    roundClockElapsedMs: 0,
    clockSpecificRemainingMs: 0,
    roundsPlayed: 0,
    correct: 0,
    incorrect: 0,
    bestStreak: 0,
    reason: null,
    statusLabel: "Completed"
  };

  state.adaptive.recentResults = [];
  state.adaptive.performanceState = "Steady Pace";
  state.survival.lives = state.survival.livesSetting;
  if (nextMode === "Adaptive") {
    state.adaptive.currentKey = "Easy";
    state.adaptive.recentResults = [];
    state.adaptive.performanceState = "Steady Pace";
  }
  if (nextMode === "Survival") {
    state.survival.lives = state.survival.livesSetting;
  }

  resetSessionStats();
  syncModeSelectionUI();
  updateGameHeaderMeta();
  if (nextMode === "Time Attack") {
    startTimeAttackTimer();
  }
  showGameScreen();
  beginRound();
}

function updateSessionProgress() {
  state.session.roundsPlayed = state.stats.answered;
  state.session.correct = state.stats.correct;
  state.session.incorrect = state.stats.answered - state.stats.correct;
  state.session.bestStreak = Math.max(state.session.bestStreak, state.stats.streak, state.stats.bestStreak || 0);

  if (!state.session.active) {
    return;
  }

  const modeKey = state.session.modeKey;
  const modeConfig = getGameModeConfig(modeKey);

  if (modeKey === "Time Attack" && state.session.remainingMs <= 0) {
    endSession("Time expired", "Time expired");
    return;
  }

  if (modeKey === "Quick Rush" && state.session.roundsPlayed >= (modeConfig.roundsLimit || 0)) {
    endSession("Completed", "Quick Rush complete");
    return;
  }

  if (modeKey === "Survival" && state.survival.lives <= 0) {
    endSession("Out of lives", "Survival ended");
    return;
  }

  if (modeConfig.autoAdvance && state.phase === "result") {
    startRoundTransition();
  }
}

function syncSurvivalLifeSetting() {
  dom.survivalLifeInputs.forEach((input) => {
    input.checked = Number(input.value) === state.survival.livesSetting;
  });
  syncSurvivalModeDescription();
  updateGameHeaderMeta();
}

function renderDifficultyOptions() {
  const presetKeys = ["Beginner", "Easy", "Medium", "Hard", "Advanced", "Custom"];

  dom.difficultyOptions.innerHTML = presetKeys
    .map((key) => {
      const isActive = settings.difficulty.selectedKey === key;
      return `<button type="button" class="option-chip ${isActive ? "active" : ""}" data-difficulty-key="${key}">${key}</button>`;
    })
    .join("");

  dom.activeDifficultyLabel.textContent = settings.difficulty.selectedKey;
  renderDifficultyDescription();
}

function renderDifficultyDescription() {
  const metadata = getDifficultyMetadataForKey();
  dom.difficultyDetails.innerHTML = `
    <strong>${metadata.name.toUpperCase()}</strong>
    <div class="detail-row">
      <span class="detail-label">Viewing Time</span>
      <span class="detail-value">${metadata.viewingTime} seconds</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Minute Precision</span>
      <span class="detail-value">${metadata.precisionLabel}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Clock Faces</span>
      <span class="detail-value">${metadata.clockFaceLabel}</span>
    </div>
  `;
}

function syncCustomDifficultyForm() {
  const custom = settings.difficulty.custom;
  const precisionField = document.querySelector(`input[name="minutePrecision"][value="${custom.minutePrecision}"]`);
  if (precisionField) {
    precisionField.checked = true;
  }

  dom.customViewingTimeRange.value = String(custom.viewingTime);
  dom.customViewingTimeLabel.textContent = `${custom.viewingTime}s`;

  const clockFaceField = document.querySelector(`input[name="clockFace"][value="${custom.clockFace}"]`);
  if (clockFaceField) {
    clockFaceField.checked = true;
  }
}

function updateOptionsBackButton() {
  dom.backToMenuButton.textContent = state.optionsContext === "game" ? "Back to Game" : "Back to Main Menu";
}

function closeGameMenu() {
  state.drawerOpen = false;
  dom.gameDrawer.classList.remove("open");
  dom.gameDrawerBackdrop.classList.add("hidden");
  dom.gameDrawer.setAttribute("aria-hidden", "true");
  dom.gameDrawerBackdrop.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  dom.gameMenuButton.setAttribute("aria-expanded", "false");
}

function openGameMenu() {
  state.drawerOpen = true;
  dom.gameDrawer.classList.add("open");
  dom.gameDrawerBackdrop.classList.remove("hidden");
  dom.gameDrawer.setAttribute("aria-hidden", "false");
  dom.gameDrawerBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  dom.gameMenuButton.setAttribute("aria-expanded", "true");
  dom.drawerQuitButton.disabled = !(state.roundActive || state.phase === "result");
  dom.drawerQuitButton.textContent = state.roundActive || state.phase === "result" ? "Quit Round" : "Round Finished";
}

function closeConfirmationModal() {
  state.modalType = null;
  state.modalConfirmAction = null;
  dom.confirmationModal.classList.add("hidden");
  dom.confirmationModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openConfirmationModal({ title, description, cancelText, confirmText, confirmAction }) {
  dom.confirmationTitle.textContent = title;
  dom.confirmationDescription.textContent = description;
  dom.modalCancelButton.textContent = cancelText;
  dom.modalConfirmButton.textContent = confirmText;
  state.modalType = "confirmation";
  state.modalConfirmAction = confirmAction;
  dom.confirmationModal.classList.remove("hidden");
  dom.confirmationModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function showMenuScreen() {
  closeGameMenu();
  closeConfirmationModal();
  clearTransitionCountdown();
  dom.startScreen.classList.remove("hidden");
  dom.optionsScreen.classList.add("hidden");
  dom.customDifficultyScreen.classList.add("hidden");
  dom.gamePanel.classList.add("hidden");
  dom.resultsScreen.classList.add("hidden");
  state.phase = "menu";
  state.optionsContext = "menu";
  updateOptionsBackButton();
  updatePhaseIndicator();
}

function showOptionsScreen({ fromGame = false } = {}) {
  closeGameMenu();
  state.optionsContext = fromGame ? "game" : "menu";
  updateOptionsBackButton();
  dom.startScreen.classList.add("hidden");
  dom.optionsScreen.classList.remove("hidden");
  dom.customDifficultyScreen.classList.add("hidden");
  dom.gamePanel.classList.add("hidden");
  renderDifficultyOptions();
  updateAudioToggles();
  applyTheme();
}

function showCustomDifficultyScreen() {
  syncCustomDifficultyForm();
  dom.optionsScreen.classList.add("hidden");
  dom.customDifficultyScreen.classList.remove("hidden");
}

function showGameScreen() {
  closeGameMenu();
  closeConfirmationModal();
  clearTransitionCountdown();
  dom.startScreen.classList.add("hidden");
  dom.optionsScreen.classList.add("hidden");
  dom.customDifficultyScreen.classList.add("hidden");
  dom.gamePanel.classList.remove("hidden");
  dom.resultsScreen.classList.add("hidden");
}

function updatePhaseIndicator() {
  const compact = state.phase === "recall" || state.phase === "result";

  if (state.phase === "viewing") {
    dom.phaseIndicator.textContent = "VIEW THE CLOCK";
    dom.phaseIndicator.classList.remove("recall");
    dom.clockCard.classList.remove("recall-mode");
    return;
  }

  if (state.phase === "recall") {
    dom.phaseIndicator.textContent = "RECALL PHASE · ENTER THE TIME";
    dom.phaseIndicator.classList.add("recall");
    dom.clockCard.classList.add("recall-mode");
    return;
  }

  if (state.phase === "result") {
    dom.phaseIndicator.textContent = "ROUND RESULT";
    dom.phaseIndicator.classList.remove("recall");
    dom.clockCard.classList.add("recall-mode");
    return;
  }

  dom.phaseIndicator.textContent = "VIEW THE CLOCK";
  dom.phaseIndicator.classList.remove("recall");
  dom.clockCard.classList.toggle("recall-mode", compact);
}

function setClockVisibility(isVisible) {
  dom.clockSvg.classList.toggle("hidden", !isVisible);
}

function stopViewingTimer() {
  if (state.viewingTimerFrameId) {
    window.cancelAnimationFrame(state.viewingTimerFrameId);
    state.viewingTimerFrameId = null;
  }
}

function buildAnalogClock(time, faceName = state.activeClockFace) {
  const normalizedFaceName = faceName === "Classic" ? "Numbers" : faceName;
  const svgNamespace = "http://www.w3.org/2000/svg";
  const faceGroup = dom.clockFace;
  faceGroup.innerHTML = "";

  const centerX = 110;
  const centerY = 110;
  const outerRadius = 94;
  const innerRadius = 74;

  const faceCircle = document.createElementNS(svgNamespace, "circle");
  faceCircle.setAttribute("cx", centerX);
  faceCircle.setAttribute("cy", centerY);
  faceCircle.setAttribute("r", outerRadius + 6);
  faceCircle.setAttribute("class", "clock-face");
  faceGroup.appendChild(faceCircle);

  for (let minuteIndex = 0; minuteIndex < 60; minuteIndex += 1) {
    const angle = (minuteIndex / 60) * (Math.PI * 2) - Math.PI / 2;
    const isMajor = minuteIndex % 5 === 0;
    const startRadius = isMajor ? innerRadius : 80;
    const endRadius = isMajor ? outerRadius : 88;
    const x1 = centerX + Math.cos(angle) * startRadius;
    const y1 = centerY + Math.sin(angle) * startRadius;
    const x2 = centerX + Math.cos(angle) * endRadius;
    const y2 = centerY + Math.sin(angle) * endRadius;

    const line = document.createElementNS(svgNamespace, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("class", isMajor ? "marker-major" : "marker-minor");
    faceGroup.appendChild(line);
  }

  if (normalizedFaceName !== "Minimal") {
    const romanValues = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI", 12: "XII" };
    const labels = normalizedFaceName === "Roman"
      ? romanValues
      : normalizedFaceName === "Important Numbers"
        ? { 12: "12", 3: "3", 6: "6", 9: "9" }
        : Array.from({ length: 12 }, (_, index) => index + 1).reduce((map, hour) => ({ ...map, [hour]: String(hour) }), {});

    Object.entries(labels).forEach(([hourValue, labelValue]) => {
      const hour = Number(hourValue);
      const angle = ((hour * 30 - 90) * Math.PI) / 180;
      const labelX = centerX + Math.cos(angle) * 66;
      const labelY = centerY + Math.sin(angle) * 66;

      const label = document.createElementNS(svgNamespace, "text");
      label.setAttribute("x", labelX);
      label.setAttribute("y", labelY);
      label.setAttribute("class", normalizedFaceName === "Roman" ? "hour-label roman" : "hour-label");
      label.textContent = String(labelValue);
      faceGroup.appendChild(label);
    });
  }

  const hourHandDegrees = ((time.hour % 12) + time.minute / 60) * 30;
  const minuteHandDegrees = time.minute * 6;
  const hourHandAngle = (hourHandDegrees - 90) * (Math.PI / 180);
  const minuteHandAngle = (minuteHandDegrees - 90) * (Math.PI / 180);

  const hourHandEndX = centerX + Math.cos(hourHandAngle) * 54;
  const hourHandEndY = centerY + Math.sin(hourHandAngle) * 54;
  const minuteHandEndX = centerX + Math.cos(minuteHandAngle) * 72;
  const minuteHandEndY = centerY + Math.sin(minuteHandAngle) * 72;

  dom.hourHand.setAttribute("x2", hourHandEndX);
  dom.hourHand.setAttribute("y2", hourHandEndY);
  dom.minuteHand.setAttribute("x2", minuteHandEndX);
  dom.minuteHand.setAttribute("y2", minuteHandEndY);
}

function updateViewingTimerDisplay() {
  if (!state.roundActive) {
    return;
  }

  if (state.session.active && state.session.modeKey === "Time Attack") {
    const startedAt = state.session.roundClockStartedAt || performance.now();
    const elapsedMs = state.session.roundClockElapsedMs + (performance.now() - startedAt);
    const elapsedSeconds = Math.max(0, elapsedMs / 1000);
    dom.timerValue.textContent = `${elapsedSeconds.toFixed(1)}s`;
    dom.timerValue.classList.remove("warning");
    if (state.phase === "viewing") {
      const viewingTimeMs = getActiveDifficulty().viewingTime * 1000;
      if (elapsedMs >= viewingTimeMs) {
        state.recognitionTime = getActiveDifficulty().viewingTime;
        state.phase = "recall";
        updatePhaseIndicator();
      }
    }
    state.viewingTimerFrameId = window.requestAnimationFrame(updateViewingTimerDisplay);
    return;
  }

  if (state.phase !== "viewing") {
    return;
  }

  const elapsedMs = performance.now() - state.viewingStartTimestamp;
  const viewingTimeMs = getActiveDifficulty().viewingTime * 1000;
  const remainingSeconds = Math.max(0, (viewingTimeMs - elapsedMs) / 1000);

  dom.timerValue.textContent = `${remainingSeconds.toFixed(1)}s`;
  dom.timerValue.classList.toggle("warning", remainingSeconds <= 3);

  if (remainingSeconds <= 0) {
    state.recognitionTime = getActiveDifficulty().viewingTime;
    state.phase = "recall";
    updatePhaseIndicator();
    setClockVisibility(false);
    stopViewingTimer();
    return;
  }

  state.viewingTimerFrameId = window.requestAnimationFrame(updateViewingTimerDisplay);
}

function resetFeedback() {
  dom.feedback.className = "feedback";
  dom.feedback.innerHTML = "";
}

function showFeedback({ correct, recognitionTimeSec, timedOut = false }) {
  const correctTime = formatTimeDisplay(state.targetTime.hour, state.targetTime.minute);

  if (correct) {
    dom.feedback.classList.add("success");
    dom.feedback.innerHTML = `
      <span class="feedback-title">✓ Correct!</span>
      <span class="feedback-time">${correctTime}</span>
      <span class="feedback-copy">Recognition time: ${recognitionTimeSec.toFixed(2)}s</span>
    `;
    return;
  }

  dom.feedback.classList.add("error");

  if (timedOut) {
    dom.feedback.innerHTML = `
      <span class="feedback-title">⏰ Viewing expired</span>
      <span class="feedback-copy">The correct time was ${correctTime}</span>
    `;
    return;
  }

  dom.feedback.innerHTML = `
    <span class="feedback-title">✕ Not quite</span>
    <span class="feedback-copy">The correct time was ${correctTime}</span>
  `;
}

function updateStats() {
  const accuracy = state.stats.answered > 0 ? (state.stats.correct / state.stats.answered) * 100 : 0;
  state.stats.bestStreak = Math.max(state.stats.bestStreak || 0, state.stats.streak || 0);

  dom.scoreValue.textContent = String(state.stats.score);
  dom.streakValue.textContent = `🔥 ${state.stats.streak}`;
  dom.accuracyValue.textContent = `${Math.round(accuracy)}%`;
  dom.bestTimeValue.textContent = Number.isFinite(state.stats.bestTime)
    ? `${state.stats.bestTime.toFixed(2)}s`
    : "-";
  dom.questionValue.textContent = String(state.stats.answered);
}

function updateSubmitButton() {
  dom.submitBtn.textContent = state.roundActive ? "Submit" : "Next Round";
}

function finalizeRound({ correct, recognitionTimeSec }) {
  if (!state.roundActive || state.answerLocked) {
    return;
  }

  state.roundActive = false;
  state.answerLocked = true;
  state.phase = "result";
  setClockVisibility(false);
  updatePhaseIndicator();
  stopViewingTimer();

  state.stats.answered += 1;

  if (correct) {
    state.stats.score += 1;
    state.stats.streak += 1;
    state.stats.correct += 1;
    state.stats.bestStreak = Math.max(state.stats.bestStreak || 0, state.stats.streak);

    if (recognitionTimeSec < state.stats.bestTime) {
      state.stats.bestTime = recognitionTimeSec;
    }

    playSfx("correct");
  } else {
    state.stats.streak = 0;
    state.stats.incorrect += 1;
    playSfx("error");
  }

  if (state.session.active && state.session.modeKey === "Survival" && !correct) {
    state.survival.lives = Math.max(0, state.survival.lives - 1);
    updateGameHeaderMeta();
    if (state.survival.lives <= 0) {
      endSession("Out of lives", "Survival ended");
      return;
    }
  }

  updateStats();
  showFeedback({
    correct,
    recognitionTimeSec,
    timedOut: false
  });
  updateSubmitButton();
  dom.drawerQuitButton.disabled = false;
  dom.drawerQuitButton.textContent = "Quit Round";

  if (state.session.active) {
    state.session.roundsPlayed = state.stats.answered;
    state.session.correct = state.stats.correct;
    state.session.incorrect = state.stats.incorrect;
    state.session.bestStreak = Math.max(state.session.bestStreak || 0, state.stats.bestStreak || 0);
  }

  updateGameHeaderMeta();

  if (state.selectedModeKey === "Adaptive") {
    adjustAdaptiveDifficulty(correct);
  }

  updateSessionProgress();
}

function submitAnswer() {
  if (!state.roundActive || state.answerLocked) {
    return;
  }

  const typedAnswer = state.answerMode === "type" ? getTypedAnswer() : null;
  if (state.answerMode === "type" && !typedAnswer) {
    return;
  }

  const userHour = typedAnswer ? typedAnswer.hour : state.selectedHour;
  const userMinute = typedAnswer ? typedAnswer.minute : state.selectedMinute;
  const correct = userHour === state.targetTime.hour && userMinute === state.targetTime.minute;

  let recognitionTimeSec = state.currentDifficulty.viewingTime;

  if (state.phase === "viewing") {
    recognitionTimeSec = (performance.now() - state.viewingStartTimestamp) / 1000;
    state.recognitionTime = recognitionTimeSec;
    stopViewingTimer();
  } else {
    recognitionTimeSec = state.recognitionTime ?? state.currentDifficulty.viewingTime;
  }

  finalizeRound({
    correct,
    recognitionTimeSec
  });
}

function beginRound() {
  state.currentDifficulty = getCurrentDifficultyForSession();
  state.targetTime = generateRandomTime();
  state.activeClockFace = chooseClockFace();
  state.phase = "viewing";
  state.roundActive = true;
  state.answerLocked = false;
  state.recognitionTime = null;
  state.viewingStartTimestamp = performance.now();
  state.session.roundClockStartedAt = performance.now();
  state.session.roundClockElapsedMs = 0;
  state.session.clockSpecificRemainingMs = getActiveDifficulty().viewingTime * 1000;
  state.selectedHour = 12;
  state.selectedMinute = normalizeMinuteValue(0);

  setWheelValue("hour", 12);
  setWheelValue("minute", 0);
  resetTypedAnswerInputs();
  setClockVisibility(true);
  buildAnalogClock(state.targetTime, state.activeClockFace);
  resetFeedback();
  updatePhaseIndicator();
  updateSubmitButton();
  dom.timerValue.classList.remove("warning");
  dom.timerValue.textContent = `${getActiveDifficulty().viewingTime.toFixed(1)}s`;
  dom.drawerQuitButton.disabled = false;
  dom.drawerQuitButton.textContent = "Quit Round";
  updateGameHeaderMeta();

  stopViewingTimer();
  state.viewingTimerFrameId = window.requestAnimationFrame(updateViewingTimerDisplay);
}

function quitCurrentRound() {
  if (!state.session.active && !state.roundActive && state.phase !== "result") {
    return;
  }

  if (state.session.active) {
    endSession("Quit", "Session ended");
    return;
  }

  state.roundActive = false;
  state.answerLocked = false;
  state.phase = "menu";
  state.recognitionTime = null;
  state.viewingStartTimestamp = 0;
  stopViewingTimer();
  setClockVisibility(false);
  resetFeedback();
  updateSubmitButton();
  updatePhaseIndicator();
  closeGameMenu();
  closeConfirmationModal();
  showMenuScreen();
}

function applyDifficultyChange(nextKey) {
  settings.difficulty.selectedKey = nextKey;
  renderDifficultyOptions();
  if (state.optionsContext === "game" && state.roundActive && (state.phase === "viewing" || state.phase === "recall")) {
    showGameScreen();
    beginRound();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderWheel("hour", 12);
  renderWheel("minute", 0);
  setAnswerMode("scroller");
  applyTheme();
  updateAudioToggles();
  renderDifficultyOptions();
  syncCustomDifficultyForm();
  updateOptionsBackButton();
  updateStats();
  updateSubmitButton();
  showMenuScreen();

  dom.startButton.addEventListener("click", () => {
    syncMusicState();
    beginSession(state.selectedModeKey);
  });

  dom.optionsButton.addEventListener("click", () => {
    showOptionsScreen({ fromGame: false });
  });

  dom.backToMenuButton.addEventListener("click", () => {
    if (state.optionsContext === "game") {
      showGameScreen();
      return;
    }

    showMenuScreen();
  });

  dom.customDifficultyButton.addEventListener("click", () => {
    showCustomDifficultyScreen();
  });

  dom.saveCustomDifficultyButton.addEventListener("click", () => {
    const selectedPrecision = document.querySelector('input[name="minutePrecision"]:checked');
    const selectedFace = document.querySelector('input[name="clockFace"]:checked');

    settings.difficulty.custom.minutePrecision = selectedPrecision ? selectedPrecision.value : "one";
    settings.difficulty.custom.viewingTime = Number(dom.customViewingTimeRange.value) || 15;
    settings.difficulty.custom.clockFace = selectedFace ? selectedFace.value : "Numbers";

    const shouldRestartRound = state.optionsContext === "game" && state.roundActive && (state.phase === "viewing" || state.phase === "recall");

    if (shouldRestartRound) {
      openConfirmationModal({
        title: "Changing difficulty will restart the current round.",
        description: "Your current round will be discarded.",
        cancelText: "Cancel",
        confirmText: "Restart Round",
        confirmAction: () => {
          settings.difficulty.selectedKey = "Custom";
          renderDifficultyOptions();
          closeConfirmationModal();
          showGameScreen();
          beginRound();
        }
      });
      return;
    }

    settings.difficulty.selectedKey = "Custom";
    renderDifficultyOptions();
    if (state.optionsContext === "game" && state.roundActive && (state.phase === "viewing" || state.phase === "recall")) {
      showGameScreen();
      beginRound();
      return;
    }
    showOptionsScreen({ fromGame: false });
  });

  dom.cancelCustomDifficultyButton.addEventListener("click", () => {
    if (state.optionsContext === "game") {
      showGameScreen();
      return;
    }
    showOptionsScreen({ fromGame: false });
  });

  dom.themeSelect.addEventListener("change", (event) => {
    settings.appearance.theme = event.target.value;
    applyTheme();
  });

  dom.answerModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setAnswerMode(button.dataset.inputMode || "scroller");
    });
  });

  dom.survivalLifeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      state.survival.livesSetting = Number(input.value) || 3;
      state.survival.lives = state.survival.livesSetting;
      syncSurvivalLifeSetting();
      updateGameHeaderMeta();
    });
  });

  dom.modeChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setSelectedMode(button.dataset.modeKey || "Quick Rush");
    });
  });

  dom.hourTypeInput.addEventListener("input", (event) => {
    setTypedAnswerValue("hour", event.target);
  });

  dom.minuteTypeInput.addEventListener("input", (event) => {
    setTypedAnswerValue("minute", event.target);
  });

  dom.soundEffectsToggle.addEventListener("click", () => {
    settings.audio.soundEffects = !settings.audio.soundEffects;
    updateAudioToggles();
  });

  dom.musicToggle.addEventListener("click", () => {
    settings.audio.music = !settings.audio.music;
    updateAudioToggles();
  });

  dom.difficultyOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-difficulty-key]");
    if (!button) {
      return;
    }

    const nextKey = button.dataset.difficultyKey;
    const shouldRestartRound = state.optionsContext === "game" && state.roundActive && (state.phase === "viewing" || state.phase === "recall");

    if (shouldRestartRound && nextKey !== settings.difficulty.selectedKey) {
      openConfirmationModal({
        title: "Changing difficulty will restart the current round.",
        description: "Your current round will be discarded.",
        cancelText: "Cancel",
        confirmText: "Restart Round",
        confirmAction: () => {
          applyDifficultyChange(nextKey);
        }
      });
      return;
    }

    settings.difficulty.selectedKey = nextKey;
    renderDifficultyOptions();

    if (state.optionsContext === "game" && state.roundActive && (state.phase === "viewing" || state.phase === "recall")) {
      showGameScreen();
      beginRound();
      return;
    }
  });

  dom.customViewingTimeRange.addEventListener("input", (event) => {
    dom.customViewingTimeLabel.textContent = `${event.target.value}s`;
  });

  dom.gameMenuButton.addEventListener("click", () => {
    if (state.drawerOpen) {
      closeGameMenu();
      return;
    }

    openGameMenu();
  });

  dom.gameDrawerBackdrop.addEventListener("click", () => {
    closeGameMenu();
  });

  dom.drawerCloseButton.addEventListener("click", () => {
    closeGameMenu();
  });

  dom.drawerContinueButton.addEventListener("click", () => {
    closeGameMenu();
  });

  dom.drawerOptionsButton.addEventListener("click", () => {
    closeGameMenu();
    showOptionsScreen({ fromGame: true });
  });

  dom.drawerQuitButton.addEventListener("click", () => {
    if (!state.roundActive && state.phase !== "result") {
      return;
    }

    closeGameMenu();
    openConfirmationModal({
      title: "Are you sure you want to quit?",
      description: "Your current round will be discarded.",
      cancelText: "Continue",
      confirmText: "Quit",
      confirmAction: () => {
        quitCurrentRound();
      }
    });
  });

  dom.modalCancelButton.addEventListener("click", () => {
    closeConfirmationModal();
  });

  dom.modalConfirmButton.addEventListener("click", () => {
    if (typeof state.modalConfirmAction === "function") {
      state.modalConfirmAction();
      return;
    }

    closeConfirmationModal();
  });

  dom.confirmationModal.addEventListener("click", (event) => {
    if (event.target === dom.confirmationModal) {
      closeConfirmationModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!dom.confirmationModal.classList.contains("hidden")) {
        closeConfirmationModal();
        return;
      }

      if (state.drawerOpen) {
        closeGameMenu();
      }
    }
  });

  dom.submitBtn.addEventListener("click", () => {
    if (!state.roundActive) {
      if (state.session.active) {
        showGameScreen();
        beginRound();
      }
      return;
    }

    submitAnswer();
  });

  dom.resultsMenuButton.addEventListener("click", () => {
    showMenuScreen();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    const directControl = target.closest?.("button, input[type='radio'], input[type='range'], select");
    const labelControl = directControl ? null : target.closest?.("label")?.querySelector("input[type='radio'], input[type='range'], select");
    const control = directControl || labelControl;

    if (!control || control.disabled) {
      return;
    }

    const confirmButtons = new Set([
      "startButton",
      "saveCustomDifficultyButton",
      "modalConfirmButton",
      "submitBtn"
    ]);
    playSfx(confirmButtons.has(control.id) ? "confirm" : "popup");
  });

  settings.audio.music = true;
  state.survival.livesSetting = 3;
  state.survival.lives = 3;
  syncSurvivalLifeSetting();
  syncModeSelectionUI();
  updateGameHeaderMeta();
  updateResultsScreen();
});
