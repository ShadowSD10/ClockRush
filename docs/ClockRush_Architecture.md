# ClockRush — Application Architecture

> **Purpose of this document:** This is the canonical technical map of the current ClockRush codebase.
>
> A new developer or AI should be able to read this document first, understand how the application works, identify where a feature belongs, and safely continue development without having to reverse-engineer the entire project from scratch.

---

## 1. Project Overview

**ClockRush** is a browser-based clock-reading speed/training game.

The core gameplay loop is:

1. Select a game mode.
2. Start a session.
3. Generate a random target time.
4. Generate/render an analog clock for that target.
5. Let the player view the clock for the active difficulty's viewing duration.
6. Move into recall mode.
7. The player enters the remembered hour/minute using either:
   - a scrollable wheel picker, or
   - numeric inputs.
8. Submit the answer.
9. Evaluate the answer.
10. Update score, streak, accuracy, best recognition time, and mode-specific state.
11. Show round feedback.
12. Automatically transition to the next round when the active mode requires it.
13. End the session when the mode's termination condition is reached.
14. Show the session Results screen.

The application is intentionally lightweight:

- No framework.
- No bundler.
- No backend.
- No database.
- No external runtime dependency.
- Vanilla HTML + CSS + JavaScript.
- SVG is used for the analog clock.
- Browser `Audio` is used for sound/music.
- `requestAnimationFrame()` is used for gameplay timers and transitions.

The current application is therefore best understood as a **single-page, state-driven browser application implemented inside one JavaScript file**.

---

# 2. Repository Structure

Current project structure:

```text
ClockRush/
│
├── .vscode/
│
├── assets/
│   ├── bgm.mp3
│   ├── confirm.mp3
│   ├── correct.mp3
│   ├── error.mp3
│   └── popup.mp3
│
├── docs/
│   ├── ClockRush_Phase_1.md
│   ├── ClockRush_Phase_2.md
│   └── ClockRush_Phase_3.md
│
├── index.html
├── script.js
├── style.css
└── README.md
```

### Responsibility of each top-level area

| Path | Responsibility |
|---|---|
| `index.html` | Application structure, screens, controls, SVG clock shell, game drawer, confirmation modal, results UI |
| `script.js` | Entire application runtime: state, configuration, game logic, timers, rendering, input handling, modes, scoring, audio, navigation |
| `style.css` | Complete visual system, layout, responsive behavior, themes, buttons, clock styling, wheels, panels, drawer, modal, results |
| `assets/` | Audio assets used by the runtime |
| `docs/` | Phase/project documentation |
| `.vscode/` | Editor/project-specific configuration |
| `README.md` | Human-facing project overview and setup/project information |

---

# 3. High-Level Architecture

ClockRush currently follows this architecture:

```text
                         ┌─────────────────────┐
                         │      index.html     │
                         │                     │
                         │ Screens + Controls  │
                         │ SVG Clock Shell     │
                         └──────────┬──────────┘
                                    │
                                    │ DOM references/events
                                    ▼
                         ┌─────────────────────┐
                         │      script.js      │
                         │                     │
                         │ Configuration       │
                         │ Application State   │
                         │ Game Engine         │
                         │ Mode Logic          │
                         │ Timer Logic         │
                         │ Input Logic         │
                         │ Rendering/UI        │
                         │ Audio               │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     ▼              ▼              ▼
              ┌────────────┐ ┌────────────┐ ┌─────────────┐
              │ style.css  │ │ SVG Clock  │ │ Audio       │
              │ Visual/UI  │ │ Rendering  │ │ assets/*.mp3│
              └────────────┘ └────────────┘ └─────────────┘
```

There is **no separate model/view/controller class hierarchy**. Instead, the application uses:

- configuration objects,
- one central `state` object,
- DOM references in `dom`,
- small helper functions,
- gameplay lifecycle functions,
- mode-specific conditionals,
- rendering/update functions.

This is effectively a **procedural state machine architecture**.

---

# 4. Application Layers

Even though the code is in one file, it is logically divided into layers.

## 4.1 Configuration Layer

Defines immutable-ish game rules and user settings:

- `difficultyPresets`
- `settings`
- `audio`
- `gameModeConfig`

These should be the first places to look when changing game rules.

---

## 4.2 State Layer

The `state` object is the runtime source of truth.

It contains:

```text
state
├── currentDifficulty
├── targetTime
├── selectedHour
├── selectedMinute
├── phase
├── roundActive
├── answerLocked
├── viewingStartTimestamp
├── viewingTimerFrameId
├── activeClockFace
├── recognitionTime
├── answerMode
├── wheels
├── optionsContext
├── drawerOpen
├── modalType
├── modalConfirmAction
├── selectedModeKey
│
├── session
│   ├── active
│   ├── modeKey
│   ├── startedAt
│   ├── deadlineMs
│   ├── remainingMs
│   ├── timerFrameId
│   ├── timerPausedForTransition
│   ├── roundClockStartedAt
│   ├── roundClockElapsedMs
│   ├── clockSpecificRemainingMs
│   ├── roundsPlayed
│   ├── correct
│   ├── incorrect
│   ├── bestStreak
│   ├── reason
│   └── statusLabel
│
├── survival
│   ├── livesSetting
│   └── lives
│
├── adaptive
│   ├── currentKey
│   ├── recentResults
│   └── performanceState
│
├── transition
│   ├── active
│   ├── durationMs
│   ├── startTime
│   ├── frameId
│   └── timeoutId
│
└── stats
    ├── score
    ├── streak
    ├── correct
    ├── answered
    ├── incorrect
    ├── bestTime
    └── bestStreak
```

### Critical architectural rule

When implementing gameplay behavior, prefer reading/writing `state` rather than creating unrelated global variables.

The UI should generally reflect state rather than becoming the source of truth.

---

# 5. DOM/UI Layer

`index.html` defines the application's screens and interactive controls.

The JavaScript caches these elements in the `dom` object.

## Main UI areas

```text
Application
│
├── Header
│   ├── ClockRush title
│   └── tagline
│
├── Main Menu
│   ├── Mode selector
│   ├── Start Game
│   └── Options
│
├── Options
│   ├── Difficulty
│   ├── Audio
│   ├── Appearance / Theme
│   └── Survival lives
│
├── Custom Difficulty
│   ├── Minute precision
│   ├── Viewing time
│   └── Clock face
│
├── Game Panel
│   ├── Game header
│   │   ├── Mode title
│   │   ├── Mode metadata
│   │   └── Hamburger menu
│   │
│   ├── Clock card
│   │   ├── Viewing timer
│   │   ├── Phase indicator
│   │   └── SVG analog clock
│   │
│   ├── Answer panel
│   │   ├── Scroller / Type switch
│   │   ├── Hour wheel
│   │   ├── Minute wheel
│   │   ├── Hour input
│   │   ├── Minute input
│   │   └── Submit
│   │
│   ├── Feedback
│   ├── Round transition
│   └── Live session stats
│
├── Game Drawer
│   ├── Continue
│   ├── Options
│   └── Quit Round
│
├── Confirmation Modal
│   ├── Cancel
│   └── Confirm
│
└── Results
    ├── Mode
    ├── Rounds
    ├── Correct
    ├── Incorrect
    ├── Accuracy
    ├── Score
    ├── Best Streak
    ├── Best Time
    ├── Status
    └── Back to Menu
```

The HTML intentionally contains the structural shell. Dynamic content such as difficulty chips, clock face markings, feedback, metadata, and results values is produced/updated by JavaScript.

---

# 6. Screen Navigation Architecture

ClockRush is a single HTML document with multiple visual screens.

The main screen functions are:

```text
showMenuScreen()
showOptionsScreen()
showCustomDifficultyScreen()
showGameScreen()
showResultsScreen()
```

These functions do not navigate to different URLs.

Instead they toggle `.hidden` on the relevant sections.

### Screen state model

```text
MENU
 │
 ├── Options
 │     └── Custom Difficulty
 │
 └── Start Game
       │
       ▼
     GAME
       │
       ├── Game Drawer
       │     ├── Continue
       │     ├── Options
       │     └── Quit
       │
       └── Session End
             │
             ▼
           RESULTS
             │
             ▼
           MENU
```

This means adding a new screen normally requires:

1. Add its HTML section.
2. Add DOM references.
3. Add a `show...Screen()` function or extend existing navigation.
4. Update relevant event handlers.
5. Ensure other screens are hidden appropriately.

---

# 7. Gameplay State Machine

The central gameplay phases are:

```text
menu
  │
  ▼
viewing
  │
  │ viewing time expires
  ▼
recall
  │
  │ submit
  ▼
result
  │
  ├── session complete → results screen
  │
  └── auto-advance → transition → viewing
```

The phase is stored in:

```js
state.phase
```

The important values currently used are:

- `menu`
- `viewing`
- `recall`
- `result`

`state.roundActive` and `state.answerLocked` provide additional protection around the current round.

### Why both phase and flags exist

The phase describes **where the player is in the lifecycle**.

The flags protect against invalid actions:

- `roundActive === false` prevents further submissions.
- `answerLocked === true` prevents double-submission.
- `session.active === false` prevents session progression.

This prevents a late timer frame, repeated click, or stale UI event from processing a round twice.

---

# 8. Session vs Round

This distinction is extremely important.

## Session

A **session** is the entire play run.

Examples:

- one 10-round Quick Rush session,
- an Endless run until quitting,
- a Survival run until all lives are lost,
- a 60-second Time Attack session,
- an Adaptive run.

Session data lives under:

```js
state.session
```

## Round

A **round** is one clock challenge inside a session.

Round-specific data includes:

```text
targetTime
activeClockFace
currentDifficulty
selectedHour
selectedMinute
phase
recognitionTime
roundActive
answerLocked
viewingStartTimestamp
```

### Lifecycle

```text
beginSession()
    │
    ├── reset session state
    ├── reset mode-specific state
    ├── reset stats
    │
    └── beginRound()
             │
             ├── choose difficulty
             ├── generate target
             ├── choose clock face
             ├── render clock
             └── start viewing timer
```

After the round:

```text
finalizeRound()
      │
      ├── update stats
      ├── update mode state
      ├── update feedback
      └── updateSessionProgress()
                    │
                    ├── endSession()
                    └── startRoundTransition()
```

---

# 9. Difficulty Architecture

Difficulty is configured in `difficultyPresets`.

Current presets:

| Difficulty | Viewing Time | Minute Increment | Clock Faces |
|---|---:|---:|---|
| Beginner | 30s | 5 minutes | Numbers |
| Easy | 20s | 5 minutes | Numbers, Roman |
| Medium | 15s | 1 minute | Numbers, Roman, Important Numbers |
| Hard | 10s | 1 minute | Numbers, Roman, Important Numbers, Minimal |
| Advanced | 5s | 1 minute | Minimal |

These definitions are centralized:

```js
const difficultyPresets = {
    Beginner: {...},
    Easy: {...},
    Medium: {...},
    Hard: {...},
    Advanced: {...}
};
```

### Custom difficulty

Custom difficulty lives in:

```js
settings.difficulty.custom
```

Current configurable values:

- `minutePrecision`
  - `"five"`
  - `"one"`
- `viewingTime`
  - 1–60 seconds
- `clockFace`
  - Numbers
  - Roman
  - Important Numbers
  - Minimal
  - Random

`getSelectedDifficultyConfig()` converts the UI settings into the same shape used by preset difficulties.

That is important: gameplay should consume a normalized difficulty configuration rather than knowing how the settings UI works.

---

# 10. Difficulty Resolution During Gameplay

`getCurrentDifficultyForSession()` determines which difficulty the current round should use.

Normal modes:

```text
selected difficulty
       ↓
getSelectedDifficultyConfig()
       ↓
current round difficulty
```

Adaptive mode:

```text
adaptive.currentKey
       ↓
difficultyPresets[currentKey]
       ↓
current round difficulty
```

The selected difficulty is therefore not necessarily the active difficulty in Adaptive mode.

This distinction must be preserved when extending Adaptive.

---

# 11. Clock Generation

A round's target is generated by:

```text
generateRandomTime()
```

The hour is random from:

```text
1–12
```

The minute is selected from the active difficulty's valid minute values.

Minute options are produced by:

```text
getMinuteOptionsForDifficulty()
```

Examples:

```text
5-minute difficulty:
0, 5, 10, 15, ... 55

1-minute difficulty:
0, 1, 2, 3, ... 59
```

This means **difficulty controls both the visual challenge and the valid answer space**.

---

# 12. Clock Face Selection

`chooseClockFace()` selects a random face from:

```js
getActiveDifficulty().clockFaces
```

Current supported face concepts are:

- `Numbers`
- `Roman`
- `Important Numbers`
- `Minimal`

Custom `Random` expands into a face set containing:

```text
Numbers
Roman
Important Numbers
Minimal
```

### Clock face rendering

The clock is not an image.

It is dynamically constructed inside the existing SVG:

```html
<svg id="clockSvg">
    <g id="clockFace"></g>
    <g id="clockHands">
        ...
    </g>
</svg>
```

`buildAnalogClock()`:

1. Clears the previous face.
2. Creates the clock face circle.
3. Creates 60 minute markers.
4. Creates hour labels when appropriate.
5. Calculates the hour hand angle.
6. Calculates the minute hand angle.
7. Updates the SVG hand endpoints.

---

# 13. Analog Clock Mathematics

The clock uses standard angular relationships.

Minute hand:

```text
minute × 6°
```

because:

```text
360° / 60 = 6°
```

Hour hand:

```text
(hour + minute / 60) × 30°
```

because:

```text
360° / 12 = 30°
```

The implementation converts these angles into SVG coordinates using:

```text
x = centerX + cos(angle) × radius
y = centerY + sin(angle) × radius
```

This is all handled by `buildAnalogClock()`.

### Important rule for future clock changes

If changing clock geometry, keep:

- the target time model (`{ hour, minute }`)
- clock rendering
- answer validation

separate.

The clock should visually represent `state.targetTime`; it should never become the source of truth for the answer.

---

# 14. Answer Input Architecture

There are two global input modes:

```text
Scroller
Type
```

Controlled by:

```js
state.answerMode
```

---

## 14.1 Scroller Mode

The scroller contains two wheels:

```text
Hour       Minute
```

The wheels support:

- pointer/touch dragging,
- mouse wheel interaction,
- normalized circular hour selection,
- difficulty-aware minute selection.

Wheel state is kept in:

```js
state.wheels
```

Each wheel tracks its current value and interaction state.

### Hour wheel

Hours are circular:

```text
1 → 2 → ... → 12 → 1
```

### Minute wheel

Minutes use only the values valid for the active difficulty.

For example:

```text
5-minute precision:
00 05 10 15 ... 55
```

The minute wheel therefore operates by **index in the allowed-minute list**, not by blindly incrementing a numeric value.

---

## 14.2 Type Mode

Type mode uses:

```html
<input id="hourTypeInput">
<input id="minuteTypeInput">
```

The inputs use:

```text
type="number"
inputmode="numeric"
```

The JavaScript still validates values explicitly.

`sanitizeTypedValue()` rejects:

- decimals,
- scientific notation,
- plus signs,
- minus signs,
- values outside the valid range,
- minute values that do not match the active difficulty precision.

Valid hours:

```text
1–12
```

Valid minutes:

```text
0–59
```

or the active five-minute set when five-minute precision is enabled.

---

# 15. Keeping Scroller and Type Mode in Sync

The selected answer is ultimately stored as:

```js
state.selectedHour
state.selectedMinute
```

The two input systems are merely different UI representations of those values.

The important functions are:

```text
setAnswerMode()
syncAnswerInputs()
updateSelectedValue()
setWheelValue()
```

This gives the architecture:

```text
             ┌───────────────┐
             │ selectedHour  │
             │ selectedMinute│
             └───────┬───────┘
                     │
             ┌───────┴───────┐
             ▼               ▼
        Scroller UI       Type UI
```

A future input method should follow the same rule: **update the shared selected values instead of creating a second answer state.**

---

# 16. Answer Validation

`submitAnswer()` reads:

```text
state.selectedHour
state.selectedMinute
```

and compares them against:

```text
state.targetTime.hour
state.targetTime.minute
```

The answer is correct only when both values match exactly.

```text
user hour   == target hour
AND
user minute == target minute
```

Recognition time is also captured here.

If the player submits during the viewing phase, the time is:

```text
performance.now() - viewingStartTimestamp
```

If the player waits until recall mode, the recorded recognition time remains the viewing duration.

---

# 17. Round Finalization

`finalizeRound()` is the main round-resolution function.

Its responsibilities are:

1. Guard against duplicate finalization.
2. Mark the round inactive.
3. Lock the answer.
4. Move phase to `result`.
5. Stop the viewing timer.
6. Increment answered count.
7. Update score/streak/correct/incorrect.
8. Update best recognition time.
9. Play success/error audio.
10. Apply Survival life loss if necessary.
11. Update visible stats.
12. Show feedback.
13. Update session counters.
14. Apply Adaptive difficulty logic when applicable.
15. Ask the session controller what happens next.

This function is therefore a major integration point.

### Do not duplicate this logic in individual game modes.

Game modes should influence **what happens after evaluation**, not implement separate copies of answer validation/stat handling.

---

# 18. Scoring and Statistics

Runtime stats live under:

```js
state.stats
```

Current fields:

| Field | Meaning |
|---|---|
| `score` | Current score |
| `streak` | Current consecutive-correct streak |
| `correct` | Number of correct answers |
| `answered` | Number of completed/answered rounds |
| `incorrect` | Number of incorrect answers |
| `bestTime` | Fastest recognition time in the session |
| `bestStreak` | Highest streak reached in the session |

### Current scoring rule

Each correct answer:

```text
score += 1
streak += 1
correct += 1
```

Each incorrect answer:

```text
streak = 0
incorrect += 1
```

There is currently no persistent player profile/database.

Stats are session-local.

---

# 19. Session Progress Controller

`updateSessionProgress()` acts as the central mode/session controller after a round.

It synchronizes:

```text
state.stats
    ↓
state.session
```

Then evaluates mode termination conditions.

Current rules:

### Quick Rush

Ends after 10 answered rounds.

```text
roundsPlayed >= 10
```

### Endless

No automatic round-count termination.

Continues until the player quits.

### Survival

Ends when:

```text
lives <= 0
```

### Time Attack

Ends when:

```text
remainingMs <= 0
```

### Adaptive

No round-count termination.

Continues until the player quits.

If the session is still active and the mode has automatic advancement enabled:

```text
phase === "result"
        ↓
startRoundTransition()
```

This is the main reason new modes should be integrated through the session controller rather than creating independent gameplay loops.

---

# 20. Game Modes

All modes reuse the same round engine.

The mode configuration is centralized in:

```js
gameModeConfig
```

Current modes:

```text
Quick Rush
Endless
Survival
Time Attack
Adaptive
```

Each mode specifies things such as:

- key,
- round limit,
- whether automatic advancement is enabled,
- transition duration,
- optional session duration,
- description.

---

## 20.1 Quick Rush

Rules:

```text
10 rounds
automatic advancement
```

Session ends after the tenth answered round.

---

## 20.2 Endless

Rules:

```text
unlimited rounds
automatic advancement
player quits to end
```

---

## 20.3 Survival

Survival adds one extra piece of session state:

```js
state.survival
```

The player can configure:

```text
1 Life
3 Lives
```

The selected setting is stored in:

```text
state.survival.livesSetting
```

The current remaining lives are stored in:

```text
state.survival.lives
```

An incorrect answer decrements the current lives.

The session ends when:

```text
lives === 0
```

### Important architectural distinction

Lives belong to **Survival only**.

They must not be reused as Adaptive state.

---

# 21. Adaptive Mode

Adaptive is an endless mode whose difficulty changes during the session.

It has its own state:

```js
state.adaptive = {
    currentKey,
    recentResults,
    performanceState
}
```

At the beginning of an Adaptive session:

```text
currentKey = Easy
recentResults = []
performanceState = Steady Pace
```

The active difficulty is resolved from:

```text
state.adaptive.currentKey
```

rather than from the normal selected difficulty.

---

## 21.1 Adaptive Decision Window

The engine keeps recent results.

Maximum stored window:

```text
5 results
```

Before there are at least 3 results, the engine does not perform a full ratio-based difficulty decision.

After enough evidence exists, it calculates:

```text
correctCount / recentResults.length
```

Current performance bands:

| Recent ratio | Behavior |
|---:|---|
| >= 0.85 | Move up one level when possible; `Locked In` |
| >= 0.70 | Stay; `Great Form` |
| >= 0.55 | Stay; `Finding Your Rhythm` |
| >= 0.40 | Stay; `Steady Pace` |
| >= 0.25 | Move down one level when possible; `Losing Pace` |
| < 0.25 | Move down when possible; `Under Pressure` |

Difficulty is clamped to:

```text
Beginner
Easy
Medium
Hard
Advanced
```

After a decision, the recent-result window is reset.

### Architectural intent

The current Adaptive engine is deliberately simple and predictable.

Future improvements can replace `adjustAdaptiveDifficulty()` without rewriting the round engine.

---

# 22. Time Attack Architecture

Time Attack has a **global 60-second session timer**.

The authoritative timer state is:

```text
state.session.deadlineMs
state.session.remainingMs
state.session.timerFrameId
```

`startTimeAttackTimer()` initializes the 60-second deadline.

`updateTimeAttackTimer()` continuously calculates remaining time.

When time reaches zero:

```text
endSession("Time expired", "Time expired")
```

---

## 22.1 Time Attack Round Clock

Time Attack also tracks time spent on the current clock:

```text
roundClockStartedAt
roundClockElapsedMs
clockSpecificRemainingMs
```

This is round-specific timing information.

The global 60-second timer remains authoritative for session termination.

### Transition pause

During automatic round transition:

```text
pauseTimeAttackTimer()
        ↓
transition countdown
        ↓
resumeTimeAttackTimer()
```

The global timer is paused during the transition.

This prevents the 2.5-second automatic transition from consuming the player's actual Time Attack time.

---

# 23. Standard Viewing Timer

For normal modes, the clock is visible during:

```text
viewing
```

When the viewing duration expires:

```text
phase = recall
clock becomes hidden
```

The player must then recall the time and enter it.

`updateViewingTimerDisplay()` is responsible for this normal flow.

The timer uses `requestAnimationFrame()` rather than `setInterval()`.

---

# 24. Time Attack Viewing Behavior

Time Attack has special timer behavior.

The current implementation tracks the current-clock elapsed time separately from the global session timer.

The architecture intentionally allows Time Attack's clock to remain available while the player is answering rather than treating the normal clock-hide behavior as the authoritative Time Attack rule.

When changing Time Attack behavior, be careful not to accidentally make the per-clock timer terminate the session. The **global 60-second timer is the session authority**.

---

# 25. Automatic Round Transition

Automatic progression is handled by:

```text
startRoundTransition()
updateTransitionCountdown()
clearTransitionCountdown()
```

Transition duration is currently:

```text
2.5 seconds
```

The UI contains:

```html
<section id="roundTransitionPanel">
```

with:

- countdown text,
- progress track,
- progress fill.

The transition lifecycle:

```text
Round result
    ↓
startRoundTransition()
    ↓
show "Next round"
    ↓
count down 2.5s
    ↓
clearTransitionCountdown()
    ↓
beginRound()
```

The progress fill is updated continuously from the remaining transition ratio.

### Important rule

Do not start a second transition while one is already active.

`clearTransitionCountdown()` is used to cancel/clean up the current transition.

---

# 26. Results Architecture

Every completed session is represented by the Results screen.

`endSession()` is the central session termination function.

It:

1. Marks the session inactive.
2. Stores the reason.
3. Stores the status label.
4. Stops session timers.
5. Clears transition timers.
6. Stops viewing timers.
7. Disables the active round.
8. Updates the Results screen.
9. Displays the Results screen.

Results currently include:

```text
Mode
Rounds
Correct
Incorrect
Accuracy
Score
Best Streak
Best Time
Status
```

The Results screen is therefore **session-level**, not round-level.

---

# 27. Quit Behavior

The game drawer exposes:

```text
Continue
Options
Quit Round
```

Quitting a live session calls:

```text
endSession("Quit", "Session ended")
```

The current round is not added as an answered round simply because the player quit.

The architecture therefore distinguishes:

```text
answered rounds
```

from:

```text
unfinished current round
```

This is important for accurate Results statistics.

---

# 28. Game Drawer and Modal Architecture

The drawer is controlled by:

```text
openGameMenu()
closeGameMenu()
```

The confirmation modal is controlled by:

```text
openConfirmationModal()
closeConfirmationModal()
```

The modal stores a callback in:

```js
state.modalConfirmAction
```

This lets the same confirmation UI be reused for different destructive/confirmable actions.

Example:

```text
Change difficulty during a round
        ↓
confirmation modal
        ↓
Restart Round
```

This is preferable to creating separate modal implementations for each feature.

---

# 29. Options Architecture

Options are stored in the `settings` object.

Current setting groups:

```text
settings
├── difficulty
│   ├── selectedKey
│   └── custom
│       ├── minutePrecision
│       ├── viewingTime
│       └── clockFace
│
├── audio
│   ├── soundEffects
│   └── music
│
└── appearance
    └── theme
```

Options UI functions include:

```text
renderDifficultyOptions()
renderDifficultyDescription()
syncCustomDifficultyForm()
updateOptionsBackButton()
applyDifficultyChange()
applyTheme()
updateAudioToggles()
```

---

# 30. Changing Difficulty During Gameplay

Options can be opened from inside the game.

If difficulty is changed while a round is active in:

```text
viewing
```

or:

```text
recall
```

the current round can be restarted.

For Custom Difficulty, the implementation explicitly asks for confirmation before discarding the current round.

This is intentional: changing difficulty changes the rules used to generate the next/current challenge.

### Future feature rule

If a setting changes the interpretation of the current challenge, decide explicitly whether it:

- affects the next round only, or
- restarts/discards the current round.

Do not silently change an active challenge's rules.

---

# 31. Theme Architecture

Themes are implemented entirely through CSS custom properties.

The base theme is defined in:

```css
:root
```

Theme overrides are applied through:

```css
body[data-theme="light"]
body[data-theme="forest"]
body[data-theme="skyline"]
body[data-theme="peach"]
body[data-theme="aurora"]
```

Current themes:

```text
Midnight
Light
Forest
Skyline
Peach
Aurora
```

JavaScript changes:

```html
<body data-theme="...">
```

through:

```text
applyTheme()
```

### Why this is useful

UI components do not need separate styles for every theme.

Instead they consume variables such as:

```text
--bg-deep
--bg-mid
--surface-panel
--surface-strong
--text
--muted
--accent
--danger
--success
--button-text
...
```

When adding a new theme:

1. Add a new `body[data-theme="name"]` block.
2. Define all required variables.
3. Add the option to the theme selector in `index.html`.
4. Make sure JavaScript uses the exact theme name.

---

# 32. Audio Architecture

Audio assets are instantiated at startup:

```js
const audio = {
    bgm: new Audio("assets/bgm.mp3"),
    confirm: new Audio("assets/confirm.mp3"),
    popup: new Audio("assets/popup.mp3"),
    error: new Audio("assets/error.mp3"),
    correct: new Audio("assets/correct.mp3")
};
```

Sound effects are controlled by:

```text
settings.audio.soundEffects
```

`playSfx(type)`:

1. Checks whether SFX are enabled.
2. Finds the requested audio object.
3. Resets `currentTime`.
4. Calls `.play()`.
5. Silently handles browser media restrictions.

Music has separate synchronization logic through:

```text
syncMusicState()
```

### Browser restriction consideration

Audio playback can be blocked until the user interacts with the page.

ClockRush therefore triggers music synchronization around user-initiated actions such as starting a game.

---

# 33. CSS Architecture

`style.css` is also monolithic but logically organized around:

```text
1. Global CSS variables
2. Theme overrides
3. Base element styles
4. App shell/header
5. Screens/cards
6. Buttons
7. Options controls
8. Game panel
9. Clock
10. Answer controls
11. Feedback
12. Transition
13. Stats
14. Drawer
15. Modal
16. Results
17. Responsive/mobile rules
```

The CSS uses CSS variables extensively, which should be preserved when extending the UI.

Avoid introducing hardcoded colors into individual components if the value is conceptually part of the theme system.

Prefer:

```css
color: var(--text);
background: var(--surface-panel);
border-color: var(--stroke);
```

over hardcoded colors.

---

# 34. Responsive / Mobile Architecture

The application is designed to work in a browser viewport and includes responsive CSS media queries.

The HTML includes:

```html
<meta name="viewport"
      content="width=device-width, initial-scale=1.0">
```

The main app shell is constrained by:

```text
min(92vw, 720px)
```

The UI uses flexible layouts and mobile-oriented numeric input attributes.

The answer inputs use:

```html
inputmode="numeric"
```

which helps mobile devices present a numeric keyboard.

### Mobile-first considerations for future work

When adding gameplay controls:

- keep touch targets large enough,
- avoid hover-only interactions,
- avoid relying only on mouse events,
- preserve pointer/touch behavior,
- test both portrait and landscape,
- verify numeric keyboard behavior,
- verify the drawer and modal fit small screens.

---

# 35. Initialization Flow

The entire app initializes from:

```js
document.addEventListener("DOMContentLoaded", () => {
    ...
});
```

Current initialization order is approximately:

```text
DOMContentLoaded
    │
    ├── renderWheel("hour", 12)
    ├── renderWheel("minute", 0)
    ├── setAnswerMode("scroller")
    ├── applyTheme()
    ├── updateAudioToggles()
    ├── renderDifficultyOptions()
    ├── syncCustomDifficultyForm()
    ├── updateOptionsBackButton()
    ├── updateStats()
    ├── updateSubmitButton()
    ├── showMenuScreen()
    │
    └── attach event listeners
```

This makes `DOMContentLoaded` the runtime bootstrap point.

---

# 36. Event-Driven Architecture

User interactions are wired directly through DOM event listeners.

Important events include:

```text
Start Game click
Options click
Back click
Custom Difficulty click
Save Custom Difficulty click
Cancel Custom Difficulty click
Theme change
Answer mode click
Survival lives change
Game mode click
Hour input
Minute input
Submit click
Game menu click
Drawer actions
Modal actions
Results menu click
```

Wheel interactions use pointer events and mouse wheel events.

The event handler should generally follow this pattern:

```text
DOM event
   ↓
update state
   ↓
call domain/game function
   ↓
update affected UI
```

Avoid putting large pieces of game logic directly inside event callbacks.

---

# 37. JavaScript Function Map

The current `script.js` contains 78 named functions.

They can be mentally grouped as follows.

## Generic utilities

```text
clamp
formatTimeDisplay
normalizeCircularValue
```

## Difficulty / clock configuration

```text
getWheelConfig
getFaceSetForConfig
describeClockFaceSet
getSelectedDifficultyConfig
getDifficultyMetadataForKey
getActiveDifficulty
getMinuteOptionsForDifficulty
normalizeMinuteValue
chooseClockFace
generateMinuteOptions
generateRandomTime
```

## Answer wheel/input system

```text
buildWheelValueList
updateSelectedValue
setWheelValue
syncAnswerInputs
setAnswerMode
sanitizeTypedValue
attachWheelInteractions
renderWheel
```

## Theme/audio

```text
applyTheme
playSfx
syncMusicState
updateAudioToggles
```

## Game header / mode display

```text
formatModeClockValue
getHeartString
getCurrentModeLabel
getSurvivalModeDescription
syncSurvivalModeDescription
updateGameHeaderMeta
```

## Session timers

```text
stopSessionTimer
pauseTimeAttackTimer
resumeTimeAttackTimer
updateTimeAttackTimer
startTimeAttackTimer
```

## Mode/session configuration

```text
getGameModeConfig
syncModeSelectionUI
setSelectedMode
resetSessionStats
getCurrentDifficultyForSession
adjustAdaptiveDifficulty
```

## Automatic progression

```text
clearTransitionCountdown
updateTransitionCountdown
startRoundTransition
```

## Results/session lifecycle

```text
showResultsScreen
updateResultsScreen
endSession
beginSession
updateSessionProgress
```

## Options/settings

```text
syncSurvivalLifeSetting
renderDifficultyOptions
renderDifficultyDescription
syncCustomDifficultyForm
updateOptionsBackButton
```

## Drawer/modal/navigation

```text
closeGameMenu
openGameMenu
closeConfirmationModal
openConfirmationModal
showMenuScreen
showOptionsScreen
showCustomDifficultyScreen
showGameScreen
```

## Gameplay/UI

```text
updatePhaseIndicator
setClockVisibility
stopViewingTimer
buildAnalogClock
updateViewingTimerDisplay
resetFeedback
showFeedback
updateStats
updateSubmitButton
finalizeRound
submitAnswer
beginRound
quitCurrentRound
applyDifficultyChange
```

---

# 38. Recommended Mental Model for New Features

Before changing code, classify the feature.

### If it changes a game rule

Look at:

```text
difficultyPresets
gameModeConfig
```

### If it adds persistent/user configuration

Look at:

```text
settings
```

### If it is temporary runtime state

Look at:

```text
state
```

### If it changes how a round starts

Look at:

```text
beginRound()
getCurrentDifficultyForSession()
generateRandomTime()
chooseClockFace()
```

### If it changes answer evaluation

Look at:

```text
submitAnswer()
finalizeRound()
```

### If it changes what happens after a round

Look at:

```text
updateSessionProgress()
startRoundTransition()
endSession()
```

### If it changes Adaptive behavior

Look at:

```text
state.adaptive
adjustAdaptiveDifficulty()
getCurrentDifficultyForSession()
```

### If it changes Survival behavior

Look at:

```text
state.survival
finalizeRound()
updateSessionProgress()
```

### If it changes Time Attack

Look at:

```text
startTimeAttackTimer()
updateTimeAttackTimer()
pauseTimeAttackTimer()
resumeTimeAttackTimer()
beginRound()
updateViewingTimerDisplay()
```

### If it changes the clock visual

Look at:

```text
buildAnalogClock()
style.css clock rules
```

### If it changes answer controls

Look at:

```text
setAnswerMode()
setWheelValue()
updateSelectedValue()
syncAnswerInputs()
sanitizeTypedValue()
attachWheelInteractions()
```

### If it changes navigation

Look at:

```text
showMenuScreen()
showOptionsScreen()
showCustomDifficultyScreen()
showGameScreen()
showResultsScreen()
```

### If it changes visuals

Prefer:

```text
style.css
```

before adding inline styles or hardcoded colors in JavaScript.

---

# 39. Critical Invariants

These are the rules that should remain true across future development.

## Invariant 1 — Target time is the source of truth

```text
state.targetTime
```

is authoritative.

The SVG is only a visual representation.

---

## Invariant 2 — Selected answer has one source of truth

```text
state.selectedHour
state.selectedMinute
```

Both Scroller and Type mode must synchronize with these values.

---

## Invariant 3 — Difficulty determines valid minutes

Never generate or accept a minute that violates:

```text
getMinuteOptionsForDifficulty()
```

---

## Invariant 4 — One round can only be finalized once

Use:

```text
state.roundActive
state.answerLocked
```

to protect against duplicate submissions/timer races.

---

## Invariant 5 — Session state is separate from round state

Do not put persistent session counters into round-only variables.

---

## Invariant 6 — Survival owns lives

Adaptive must not use Survival's life state.

---

## Invariant 7 — Time Attack global timer owns session expiration

The clock-specific timer must not independently terminate Time Attack.

---

## Invariant 8 — Results are session-level

An unfinished round should not accidentally become an answered round.

---

## Invariant 9 — Automatic progression goes through the transition controller

Do not create independent `setTimeout()`-based next-round loops for individual modes.

Use:

```text
startRoundTransition()
```

and:

```text
beginRound()
```

---

## Invariant 10 — Theme values belong in CSS variables

If a color needs to change with the theme, it should normally be a CSS custom property.

---

# 40. Common Extension Patterns

## Adding a new game mode

Recommended sequence:

```text
1. Add mode to gameModeConfig.
2. Add mode button to index.html.
3. Add mode-specific state only if truly necessary.
4. Add mode initialization in beginSession().
5. Add mode termination rule in updateSessionProgress().
6. Add mode-specific header information in updateGameHeaderMeta().
7. Add mode-specific result/status handling if needed.
8. Reuse beginRound(), submitAnswer(), finalizeRound().
9. Test quitting.
10. Test automatic progression.
11. Test Results.
```

Do **not** duplicate the entire gameplay loop.

---

## Adding a new difficulty

Add the preset to:

```js
difficultyPresets
```

Then ensure:

```text
difficulty selection UI
difficulty metadata
minute generation
clock-face selection
adaptive ordering
```

all understand the new difficulty.

Adaptive currently assumes this ordering:

```text
Beginner
Easy
Medium
Hard
Advanced
```

If that ordering changes, update `adjustAdaptiveDifficulty()` accordingly.

---

## Adding a new clock face

You need to update:

```text
getFaceSetForConfig()
buildAnalogClock()
```

and the Custom Difficulty UI if the face should be directly selectable.

The face name should remain consistent everywhere.

---

## Adding a new answer method

Create a UI representation that writes into:

```text
state.selectedHour
state.selectedMinute
```

Then make sure switching modes preserves/synchronizes the shared values.

---

# 41. Debugging Strategy

When a bug occurs, identify which state layer is wrong.

### Wrong clock shown?

Inspect:

```text
state.targetTime
state.activeClockFace
buildAnalogClock()
```

### Wrong answer accepted?

Inspect:

```text
state.selectedHour
state.selectedMinute
state.targetTime
submitAnswer()
sanitizeTypedValue()
```

### Timer behaving incorrectly?

Inspect:

```text
state.viewingStartTimestamp
state.session.deadlineMs
state.session.remainingMs
state.session.roundClockStartedAt
state.session.roundClockElapsedMs
state.session.timerPausedForTransition
```

Then inspect:

```text
updateViewingTimerDisplay()
updateTimeAttackTimer()
```

### Mode ending too early/late?

Inspect:

```text
state.session.modeKey
updateSessionProgress()
```

### Adaptive changing unexpectedly?

Inspect:

```text
state.adaptive.currentKey
state.adaptive.recentResults
state.adaptive.performanceState
adjustAdaptiveDifficulty()
```

### Survival lives wrong?

Inspect:

```text
state.survival.livesSetting
state.survival.lives
finalizeRound()
syncSurvivalLifeSetting()
```

### UI says the wrong thing?

Inspect the relevant `update...` function rather than changing the HTML default blindly.

---

# 42. Known Architectural Characteristics / Technical Debt

The current architecture is intentionally simple, but future development should recognize its limits.

## 42.1 `script.js` is monolithic

All game logic currently lives in one file.

This is convenient for a small vanilla project but will eventually make large features harder to isolate.

A future refactor could split responsibilities into modules such as:

```text
js/
├── config.js
├── state.js
├── game.js
├── modes/
│   ├── quickRush.js
│   ├── survival.js
│   ├── timeAttack.js
│   └── adaptive.js
├── clock.js
├── input.js
├── ui.js
├── audio.js
└── app.js
```

This is a **future architectural option**, not a requirement for the current codebase.

---

## 42.2 No persistence layer

Current settings/stats exist only in JavaScript memory.

Refreshing the page resets runtime state.

There is currently no:

```text
localStorage
IndexedDB
backend API
database
account system
```

Therefore long-term records cannot yet be treated as part of the runtime architecture.

When persistence is eventually added, keep it separate from the gameplay engine.

Recommended future direction:

```text
Game Engine
    │
    ├── reads current settings/state
    │
    └── emits completed-session data
                 │
                 ▼
          Persistence Layer
```

Do not make every gameplay function directly write to a database/storage system.

---

# 43. Recommended Future Persistence Architecture

When player records are eventually implemented, introduce a separate persistence abstraction.

For example:

```text
storage/
    profile
    settings
    records
    history
```

Conceptually:

```text
UI
 ↓
Game Engine
 ↓
Session Result
 ↓
Persistence Service
 ↓
localStorage / IndexedDB / backend
```

This keeps the current gameplay logic portable.

---

# 44. Testing Strategy

ClockRush currently does not have an automated test suite.

Until one is introduced, manually test changes against the relevant lifecycle.

## Minimum smoke test after gameplay changes

```text
1. Open app.
2. Start Quick Rush.
3. Complete a correct answer.
4. Complete an incorrect answer.
5. Verify score/streak/accuracy.
6. Verify automatic transition.
7. Complete/quit session.
8. Verify Results.
```

## Survival

Test:

```text
1 Life
3 Lives
correct answer
incorrect answer
last life
Results
```

## Time Attack

Test:

```text
global timer
round transition
timer pause during transition
timer resume
session expiration
Results
```

## Adaptive

Test:

```text
starts Easy
correct streak
difficulty increase
poor performance
difficulty decrease
difficulty boundaries
performance labels
```

## Input

Test:

```text
Scroller
Type
mobile numeric keyboard
5-minute precision
1-minute precision
invalid hour
invalid minute
mode switching
```

## Themes

Test all:

```text
Midnight
Light
Forest
Skyline
Peach
Aurora
```

especially buttons, text contrast, wheels, drawer, modal, and clock.

---

# 45. Deployment Architecture

ClockRush is a static web application.

There is no server-side runtime required.

Current production model:

```text
Git repository
      │
      ▼
main branch
      │
      ▼
GitHub Pages
      │
      ▼
Live ClockRush
      │
      ├── Desktop browser
      └── Mobile browser
```

Development workflow:

```text
develop
   │
   │ development work
   ▼
Pull Request
   │
   ▼
main
   │
   │ production
   ▼
GitHub Pages
```

This means `main` should remain production-ready.

---

# 46. Safe Development Workflow

For a new feature:

```text
1. Checkout develop.
2. Make the smallest coherent change.
3. Test locally.
4. Test mobile if the feature affects gameplay/UI.
5. Commit.
6. Push develop.
7. Open PR: develop → main.
8. Review/test.
9. Merge.
10. GitHub Pages deploys main.
```

Avoid direct feature development on `main`.

---

# 47. Where to Put New Code

Use this quick reference:

| Requirement | Primary location |
|---|---|
| New difficulty | `difficultyPresets` |
| New mode | `gameModeConfig` + session lifecycle |
| New persistent setting | `settings` |
| Temporary gameplay data | `state` |
| New result field | Results HTML + `updateResultsScreen()` |
| New clock face | `buildAnalogClock()` + face config |
| New answer method | Answer panel HTML + input functions |
| New sound | `assets/` + `audio` object |
| New theme | CSS theme variables + theme selector |
| New navigation | screen/drawer functions |
| New mode header info | `updateGameHeaderMeta()` |
| New mode termination rule | `updateSessionProgress()` |
| New round behavior | `beginRound()` / `finalizeRound()` |
| New adaptive behavior | `adjustAdaptiveDifficulty()` |
| New survival behavior | `state.survival` + round/session controllers |
| New Time Attack behavior | Time Attack timer functions + round lifecycle |
| New visual component | `style.css` first, HTML structure second |

---

# 48. Architecture Philosophy

The most important design principle of ClockRush is:

> **One reusable round engine, multiple session modes.**

The round engine handles:

```text
generate
→ display
→ time
→ input
→ validate
→ score
→ feedback
```

The session layer decides:

```text
How many rounds?
When does the session end?
Does difficulty adapt?
Are there lives?
Is there a global timer?
Should the next round start automatically?
```

This separation is what allows new modes to be added without rebuilding the entire game.

---

# 49. Canonical Gameplay Flow

The entire system can be reduced to this diagram:

```text
                         USER SELECTS MODE
                                │
                                ▼
                         beginSession()
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
          Reset Stats      Reset Mode State   Start Mode Timer
              │                                   │
              └─────────────────┬─────────────────┘
                                ▼
                           beginRound()
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
                  ▼             ▼             ▼
             Difficulty     Random Time    Clock Face
                  │             │             │
                  └─────────────┼─────────────┘
                                ▼
                         Render Analog Clock
                                │
                                ▼
                             VIEWING
                                │
                    viewing timer expires
                                │
                                ▼
                             RECALL
                                │
                    user enters answer
                                │
                                ▼
                         submitAnswer()
                                │
                                ▼
                         finalizeRound()
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
          Score/Stats       Survival State     Adaptive State
             │                  │                  │
             └──────────────────┼──────────────────┘
                                ▼
                    updateSessionProgress()
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
             Session ends                 Continue
                  │                           │
                  ▼                           ▼
             endSession()             startRoundTransition()
                  │                           │
                  ▼                           ▼
              RESULTS                    beginRound()
                                              │
                                              └─── loop
```

---

# 50. AI Handoff Instructions

If an AI assistant is taking over ClockRush development, it should follow this process.

## Step 1 — Read this document

Understand:

- state,
- session lifecycle,
- round lifecycle,
- mode architecture,
- difficulty architecture,
- input architecture,
- timer architecture.

## Step 2 — Inspect the relevant source

Do not rewrite the whole project immediately.

For a requested change, identify the smallest set of functions responsible for that behavior.

## Step 3 — Preserve the existing state model

Before introducing a new variable, ask:

```text
Does this belong in settings?
Does this belong in state?
Does this already exist under session/survival/adaptive/transition/stats?
```

Avoid duplicate sources of truth.

## Step 4 — Reuse the existing round lifecycle

Prefer extending:

```text
beginSession()
beginRound()
submitAnswer()
finalizeRound()
updateSessionProgress()
endSession()
```

rather than building parallel gameplay loops.

## Step 5 — Keep UI and game state synchronized

If a state value changes, identify its corresponding UI update function.

Examples:

```text
difficulty → renderDifficultyOptions()
theme → applyTheme()
stats → updateStats()
mode metadata → updateGameHeaderMeta()
phase → updatePhaseIndicator()
results → updateResultsScreen()
```

## Step 6 — Test the whole lifecycle

A feature is not complete just because the new UI works.

Verify:

```text
start
→ play
→ answer
→ result
→ transition
→ next round
→ session end
→ results
→ menu
```

and verify quitting from the active game as well.

---

# 51. Final Context Summary

ClockRush is currently a **vanilla JavaScript single-page game with a centralized runtime state and reusable round engine**.

The three core source files have clear responsibilities:

```text
index.html
    = structure

style.css
    = presentation

script.js
    = behavior + state + game engine
```

The most important runtime objects are:

```text
difficultyPresets
settings
audio
gameModeConfig
state
dom
```

The most important lifecycle functions are:

```text
beginSession()
beginRound()
submitAnswer()
finalizeRound()
updateSessionProgress()
startRoundTransition()
endSession()
```

The most important architectural split is:

```text
ROUND
    generates and evaluates one clock challenge

SESSION
    controls the rules around a sequence of rounds
```

Modes should customize the **session layer** while reusing the **round layer**.

Adaptive and Survival each own their own state.

Time Attack owns a global session timer plus current-round timing information.

The UI is DOM-driven, the analog clock is SVG-driven, themes are CSS-variable-driven, and audio is browser `Audio`-driven.

For future development, preserve the single-source-of-truth principle, avoid duplicating the round engine, keep mode-specific state isolated, and introduce persistence as a separate layer when long-term player records are eventually added.

---

## Current Source-of-Truth Files

When the architecture and implementation disagree, inspect the actual current files before changing behavior:

```text
index.html
script.js
style.css
```

This document describes the architecture of the current implementation; it should be updated whenever a major architectural change is introduced.
