# ClockRush — Phase 2 Specification

## Goal

Evolve the Phase 1 playable game into the core clock-reading training system.

Phase 2 focuses only on the **training mechanic and challenge engine**. App-wide settings/navigation belong to Phase 3.

The existing Phase 1 gameplay should remain stable.

## 1. Viewing Time & Recall Gameplay

The timer measures how long the clock is visible, not the total time available to answer.

```text
VIEWING PHASE
     ↓
Clock is visible
     ↓
Viewing timer counts down
     ↓
Timer reaches zero
     ↓
Clock disappears
     ↓
RECALL / INPUT PHASE
     ↓
Player selects hour + minute
     ↓
Player submits
```

When viewing time expires:
- Hide the clock.
- Do not mark the round incorrect.
- Keep answer wheels available.
- Allow unlimited time to enter the answer.
- Let the player submit whenever ready.

If the player answers early:
- Stop the viewing timer.
- Record elapsed viewing/recognition time.
- Validate the answer.
- Record recognition time.

Recognition time, not answer-input time, is the primary speed metric.

### Terminology

Prefer **Viewing Time** for the configurable challenge duration.

The post-clock phase can be called **Recall / Input**.

## 2. Difficulty Presets

Do not create manually authored levels. Difficulty is represented by configurable presets.

Each preset controls:
- Minute precision
- Viewing time
- Allowed clock faces

### Beginner

- Minute precision: 5-minute increments
- Viewing time: 30 seconds
- Clock face: Classic

### Easy

- Minute precision: 5-minute increments
- Viewing time: 20 seconds
- Clock face: Classic

### Medium

- Minute precision: Every minute
- Viewing time: 15 seconds
- Clock face: Classic

### Hard

- Minute precision: Every minute
- Viewing time: 10 seconds
- Clock faces: Classic + Minimal

### Advanced

- Minute precision: Every minute
- Viewing time: 5 seconds
- Clock faces: Multiple

Advanced should support multiple visual styles rather than being defined only by a shorter timer.

## 3. Difficulty Is Multi-Dimensional

Do not treat difficulty as a single linear scale.

### Minute Precision

```text
5-minute increments
        ↓
1-minute increments
```

### Viewing Time

```text
30s
20s
15s
10s
5s
```

### Clock Face Complexity

Potential faces:
- Classic
- Minimal
- Roman numerals
- No numbers
- Random / Multiple

A harder clock face does not automatically require a shorter viewing time.

Custom difficulty in Phase 3 should be able to combine these dimensions freely.

## 4. Clock-Face System

Clock faces are a separate challenge dimension, not a single "Expert" feature.

### Classic

- 12 visible numbers
- Clear minute markers
- Familiar clock appearance

### Minimal

- Reduced numerical assistance
- Strong visual focus on hand positions

The architecture should make future faces possible, including:
- Roman numerals
- No-number dial
- Sport
- Luxury
- Other custom watch-face styles

Do not require every future face to be implemented in Phase 2.

## 5. Random Time Generation

Use the existing configurable random-time approach.

Preset behavior should determine the minute increment.

Examples:

```text
Beginner / Easy:
3:00
7:15
11:30
4:45

Medium / Hard / Advanced:
7:43
2:17
11:52
4:38
```

The hour hand must continue to move proportionally according to the minute.

Do not manually define questions or levels.

## 6. Recognition Time

Distinguish between:

```text
Viewing / Recognition Time
```

and:

```text
Answer Input Time
```

Only recognition time should be used as the primary speed measurement.

Example:

```text
Viewing time: 10s

Player answers after 4.82s
        ↓
Correct
        ↓
Recognition time: 4.82s
```

If the clock reaches zero first, the player may take unlimited time to answer and the expired viewing timer should not be treated as an incorrect answer.

Future persistent statistics can include:
- Average Recognition Time
- Best Recognition Time
- Accuracy

## 7. Session Statistics

Keep the existing in-game session statistics:
- Score
- Current streak
- Accuracy
- Best recognition time
- Questions answered

These remain session-only and reset on refresh.

Do not build a dedicated Stats screen in Phase 2.

## 8. Game State

The game should distinguish between:

```text
Main Menu
Viewing Phase
Input / Recall Phase
Round Result
```

Options and Difficulty Configuration are Phase 3 concerns.

A round ends after:
- Correct answer
- Incorrect answer
- Quit

When viewing time expires, the round remains active because the player still needs to answer.

## 9. Round Flow

```text
Main Menu
    ↓
Start Game
    ↓
Generate random time
    ↓
Select clock face
    ↓
Display clock
    ↓
Start viewing timer
    ↓
       ┌─────────────────────┐
       │                     │
       │ Player answers      │ Viewing timer expires
       │ early               │
       │                     │
       └──────────┬──────────┘
                  ↓
             Hide clock
                  ↓
            Input / Recall
                  ↓
              Submit
                  ↓
             Validate
                  ↓
          Show result + stats
                  ↓
             Next Round
```

## 10. Non-Goals

Do not implement in Phase 2:
- Options menu
- Custom difficulty UI
- Audio settings
- Music settings
- Theme selection UI
- Multiple game modes
- Persistent statistics
- User accounts
- Cloud synchronization
- Backend
- Database
- Weak-spot training
- Achievements
- Online leaderboards

These belong to later phases.

## 11. Definition of Done

Phase 2 is complete when:
- Viewing Time replaces the old total-answer timer behavior.
- The clock disappears when viewing time expires.
- Expiration does not count as an incorrect answer.
- The player has unlimited time to enter the answer after the clock disappears.
- Answering early records recognition time.
- Recognition time is separate from input time.
- Beginner = 5-minute increments / 30s.
- Easy = 5-minute increments / 20s.
- Medium = 1-minute increments / 15s.
- Hard = 1-minute increments / 10s.
- Advanced = 1-minute increments / 5s.
- Difficulty is represented through configuration rather than manually authored levels.
- Classic and Minimal clock-face support can be selected by the difficulty engine where applicable.
- Existing wheel picker, clock rendering, validation, scoring, streak, and session statistics remain functional.
- The project remains a static website with no backend or database.
