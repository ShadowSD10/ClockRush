# ClockRush — Phase 3 Specification

## Goal

Build the app experience around the Phase 2 training engine.

Phase 3 focuses on **navigation, configuration, settings, and user control** rather than changing the fundamental clock-reading mechanic.

Phase 2 gameplay should remain stable.

## 1. Main Menu

The main menu should remain simple and polished.

Conceptually:

```text
CLOCKRUSH

Read it. Beat it.

[ START GAME ]

[ OPTIONS ]
```

Do not add a Stats menu yet.

Starting the game should use the currently selected difficulty configuration.

## 2. Options Menu

Add an Options screen accessible from the main menu.

Options should provide access to:
- Difficulty
- Audio settings
- Appearance/theme
- Return to main menu

Keep the current dark navy/cyan/mint ClockRush aesthetic as the default.

## 3. Difficulty Configuration

The Options menu should contain a Difficulty section.

Example:

```text
OPTIONS

Difficulty
──────────────

Current:
Medium

[ Configure Difficulty ]
```

The configuration screen should expose the Phase 2 presets:

```text
Beginner
Easy
Medium
Hard
Advanced
Custom
```

Selecting a preset applies its configuration.

The preset definitions remain:

| Preset | Minute Precision | Viewing Time | Clock Face |
|---|---|---:|---|
| Beginner | 5-minute increments | 30s | Classic |
| Easy | 5-minute increments | 20s | Classic |
| Medium | Every minute | 15s | Classic |
| Hard | Every minute | 10s | Classic + Minimal |
| Advanced | Every minute | 5s | Multiple |

## 4. Custom Difficulty

Add a Custom difficulty option.

The player should be able to configure:

### Minute Precision

```text
○ 5-minute increments
● Every minute
```

### Viewing Time

Allow approximately 1–60 seconds.

### Clock Face

Allow supported clock faces, including Random/Multiple where appropriate.

Example:

```text
CUSTOM

Minute precision
[ Every minute ]

Viewing time
[──────●────] 15s

Clock face
○ Classic
○ Minimal
○ Random

[ SAVE ]
```

Custom difficulty should use the same underlying configuration structure as presets.

Do not duplicate game logic for custom mode.

## 5. Audio Settings

The Options menu should include:

```text
AUDIO

Sound Effects     ON / OFF
Music             ON / OFF
```

Create the settings structure so future audio implementation can use it easily.

Potential future sound effects:
- Button press
- Wheel movement
- Round start
- Correct answer
- Incorrect answer
- Timer warning
- Streak milestone

Potential future music:
- Background/ambient music

Actual audio files do not need to be implemented merely to create the settings architecture.

## 6. Appearance / Themes

The Options menu should include:

```text
APPEARANCE

Theme
[ Midnight ▼ ]
```

Establish a theme architecture that makes future themes easy to add.

Possible future themes:
- Midnight
- Light
- Forest
- Sunset
- AMOLED

The existing dark navy/cyan/mint design remains the default.

Do not create a large theme library just for Phase 3.

## 7. Quit Round

During an active round, provide a way to quit and return to the main menu.

Example:

```text
[ Quit Round ]
```

Show a confirmation:

```text
Are you sure?

[ Continue ]    [ Quit ]
```

If the player quits:
- Stop the viewing timer.
- Cancel active animation frames.
- End the current round.
- Do not count the round as correct.
- Do not count the round as incorrect.
- Do not increase the question count.
- Return to the main menu.

Quitting should not negatively affect session statistics.

## 8. Navigation / Game State

The application should distinguish between:

```text
Main Menu
Viewing Phase
Input / Recall Phase
Round Result
Options
Difficulty Configuration
```

Navigation should be predictable and easy to use.

During an active game, the player should have a clear path to quit the round without accidentally submitting an answer.

Do not add Pause yet. If the player needs to leave an active round, use Quit Round.

## 9. Settings Behavior

Settings should be centralized rather than scattered throughout the game code.

Conceptually:

```text
App Settings
├── Difficulty
├── Audio
│   ├── Sound Effects
│   └── Music
└── Appearance
    └── Theme
```

The gameplay engine should consume the selected difficulty configuration rather than knowing how the settings UI works.

## 10. Session Statistics

Keep statistics visible during gameplay:

- Score
- Current streak
- Accuracy
- Best recognition time
- Questions answered

Do not create a dedicated Stats screen yet because these values are still session-only and reset on refresh.

A persistent Stats screen should be introduced only after persistent storage exists.



---

# Phase 3 Implementation Notes / Changes from Phase 2 QA

These items were identified during Phase 2 QA and are explicitly part of Phase 3.

## A. Recall Layout — Remove Empty Clock Space

When the clock enters the Recall/Input phase, the large clock area must not remain as an empty container.

Current Phase 2 behavior:
- The clock SVG is hidden.
- The surrounding clock card/container remains at approximately the same height.
- This leaves a large empty area above the answer wheels.

Phase 3 must fix this.

### Desired behavior

During Viewing:

```text
┌──────────────────────────┐
│ Viewing Time             │
│                          │
│         CLOCK            │
│                          │
└──────────────────────────┘
          ↓ timer expires

┌──────────────────────────┐
│ Recall Phase             │
└──────────────────────────┘

      HOUR       MINUTE
       wheels / answer controls
```

The layout should collapse/reflow naturally when the clock is hidden.

Do not simply make the SVG invisible while preserving its full layout footprint.

The Recall state should feel intentionally designed rather than like an empty clock was removed.

## B. Difficulty Testing Must Be Enabled

Phase 2 introduced the difficulty configuration engine, but the current build does not expose a way to change the active difficulty.

Phase 3 must provide a UI for selecting and applying difficulty presets so all Phase 2 difficulty behavior can be tested.

The selected difficulty must actually affect newly started rounds.

Changing difficulty should not require modifying JavaScript source code.

## C. Mobile / Touch Validation

Phase 2 wheel interactions were manually validated on desktop.

Phase 3 should prioritize responsive behavior and touch-friendly controls so the game can be used comfortably on a phone.

Verify:
- Wheel dragging works naturally on touch.
- Buttons have comfortable touch targets.
- No accidental page scrolling occurs while interacting with wheels.
- The Recall layout works well on narrow screens.
- Clock and answer controls fit without horizontal overflow.
- Options and Custom Difficulty controls are usable on mobile.

## D. Preserve Phase 2 Behavior

Phase 3 must not regress the Phase 2 training mechanic.

In particular:
- Viewing Time still controls clock visibility.
- The clock still disappears when Viewing Time expires.
- Expiry does not count as an incorrect answer.
- Recall/Input remains unlimited.
- Recognition time remains separate from input time.
- Difficulty configuration continues to use the same underlying engine.

## 11. Non-Goals

Do not implement in Phase 3:
- Persistent cloud statistics
- User accounts
- Backend
- Database
- Online leaderboards
- Multiplayer
- Weak-spot training
- Achievements
- Multiple game modes
- Cloud synchronization
- Full audio library
- Large theme library
- PWA installation

## 12. Definition of Done

Phase 3 is complete when:
- The main menu has Start Game and Options.
- Options can be opened from the main menu.
- A difficulty preset can be selected.
- Beginner = 5-minute increments / 30s.
- Easy = 5-minute increments / 20s.
- Medium = 1-minute increments / 15s.
- Hard = 1-minute increments / 10s.
- Advanced = 1-minute increments / 5s.
- Custom difficulty can configure minute precision.
- Custom difficulty can configure viewing time.
- Custom difficulty can configure clock-face selection.
- Difficulty configuration uses the same underlying engine as presets.
- Sound Effects ON/OFF setting exists.
- Music ON/OFF setting exists.
- Theme selection architecture exists with Midnight as the default.
- An active round can be quit.
- Quit requires confirmation.
- Quitting does not affect score, accuracy, streak, or question count.
- There is still no Stats menu.
- Phase 2 viewing/recall gameplay remains functional.
- The project remains a static website with no backend or database.
