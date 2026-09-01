# ClockRush --- Phase 1 Specification

## Goal

Build the first fully playable version of ClockRush: a mobile-first web
game designed to help the player become faster and more fluent at
reading analog clocks.

Phase 1 should feel like a real, polished game rather than a bare
technical prototype, while keeping the implementation simple and
extensible.

------------------------------------------------------------------------

## Core Gameplay Loop

1.  Generate a random time.
2.  Display that time on an analog clock.
3.  Start a countdown timer.
4.  Player selects the hour and minute using scrollable numeric wheel
    pickers.
5.  Player submits the answer.
6.  Validate the answer.
7.  Show immediate feedback.
8.  Record basic session statistics.
9.  Allow the player to start the next round.

The game should not use manually defined levels in Phase 1.

------------------------------------------------------------------------

## Technology

Use:

-   Plain HTML
-   CSS
-   Vanilla JavaScript
-   SVG for rendering the analog clock
-   Browser-local state only

Do **not** use:

-   React
-   Vue
-   Angular
-   TypeScript
-   Backend services
-   Database
-   Firebase
-   Authentication
-   External APIs
-   Unnecessary npm packages

The project should remain deployable as a static website.

### Project Structure

``` text
ClockRush/
├── index.html
├── style.css
├── script.js
└── README.md
```

Keep responsibilities reasonably separated. Avoid putting the entire
application into one large, unstructured JavaScript function.

------------------------------------------------------------------------

# User Interface

## General Design

The interface should be:

-   Mobile-first
-   Responsive on desktop and mobile
-   Clean and modern
-   Game-like rather than corporate
-   Visually polished
-   Easy to understand without instructions
-   Comfortable to use with touch

Avoid generic browser-looking controls.

Use clear visual hierarchy, good spacing, attractive typography, subtle
animations, and appropriate feedback states.

The primary focus of the screen should always be the analog clock and
answer controls.

------------------------------------------------------------------------

## Main Screen

The main gameplay screen should contain:

1.  ClockRush branding/title
2.  Analog clock
3.  Countdown timer
4.  Hour wheel picker
5.  Minute wheel picker
6.  Submit button
7.  Session statistics
8.  Answer feedback

A conceptual layout:

``` text
             CLOCKRUSH
       Read it. Beat it.

          ┌───────────┐
          │           │
          │  ANALOG   │
          │   CLOCK   │
          │           │
          └───────────┘

              7.4s

       HOUR          MINUTE

        08              41
       ────            ────
        09              42
      ══════          ══════
        10              43
       ────            ────

           [ SUBMIT ]

       🔥 Streak: 4
       Score: 8
       Accuracy: 80%
```

The exact visual implementation can differ as long as the hierarchy and
usability remain strong.

------------------------------------------------------------------------

# Analog Clock

## Rendering

Render the clock using SVG.

The clock should contain:

-   Circular clock face
-   12 hour markers
-   Minute markers where visually appropriate
-   Hour hand
-   Minute hand
-   Center pin
-   Clear contrast between hands and background

The clock should look like a polished watch/clock face rather than a
default HTML drawing.

The clock must accurately represent arbitrary times.

## Time Representation

The internal representation should use:

``` text
hour: 1–12
minute: 0–59
```

The hour hand must move continuously based on the minute.

For example:

-   3:00 → hour hand exactly at 3
-   3:30 → hour hand halfway between 3 and 4
-   3:45 → hour hand three-quarters of the way toward 4

Do not keep the hour hand fixed at the hour number.

------------------------------------------------------------------------

# Answer Input

## Wheel Pickers

Use two scrollable numeric wheel pickers:

-   Hour
-   Minute

The interaction should resemble a mobile number wheel/spinner.

Example:

``` text
        HOUR          MINUTE

         08              41
        ────            ────
         09              42
       ══════          ══════
         10              43
        ────            ────
         11              44
```

Requirements:

-   Selected value is visually emphasized.
-   Nearby values are visible above/below the selected value.
-   Values can be changed by vertical scrolling/swiping.
-   Mouse wheel interaction should work on desktop where practical.
-   Touch interaction should work on mobile.
-   Hour values should cycle from 12 → 1 and 1 → 12.
-   Minute values should cycle from 59 → 0 and 0 → 59.
-   Prevent invalid values.
-   Provide a usable fallback for devices/browsers where custom
    scrolling behavior is unavailable.

The player should not need to type the answer manually.

------------------------------------------------------------------------

# Timer

Phase 1 uses a default time limit of **10 seconds**.

The timer should:

-   Start when a new clock is presented.
-   Count down visibly.
-   Update smoothly.
-   Clearly communicate when time is running low.
-   Stop when the player submits an answer.
-   Stop when time reaches zero.
-   Prevent duplicate submissions after the round has ended.

The timer value should be configurable in code rather than hardcoded
throughout the application.

Example configuration:

``` javascript
const difficulty = {
    timeLimit: 10,
    minuteIncrement: 1
};
```

Do not build a full difficulty-selection UI yet.

------------------------------------------------------------------------

# Random Time Generation

Generate a new random time for each round.

The time-generation logic should be configurable.

Phase 1 default:

``` text
Hours: 1–12
Minutes: 0–59
Minute increment: 1
```

Do not manually define individual levels or clock questions.

The architecture should allow future difficulty settings to modify:

-   Time limit
-   Minute precision
-   Allowed time patterns
-   Other clock complexity

without rewriting the core game.

------------------------------------------------------------------------

# Answer Validation

When the player submits:

1.  Read the selected hour and minute.
2.  Compare them against the generated target time.
3.  Determine whether the answer is correct.
4.  Stop the timer.
5.  Calculate response time.
6.  Update session statistics.
7.  Show feedback.

Correct answer:

``` text
✓ Correct!

08:42
Response time: 3.21s
```

Incorrect answer:

``` text
✕ Not quite

The correct time was 08:42
```

The feedback should be visually clear but not overly disruptive.

------------------------------------------------------------------------

# Session Statistics

Track basic statistics during the current session:

-   Score
-   Current streak
-   Accuracy
-   Best response time
-   Number of questions answered

Example:

``` text
Score       8
Streak      🔥 4
Accuracy    80%
Best Time   2.41s
```

A score should increase for correct answers.

A correct answer should increase the streak.

An incorrect answer or timeout should reset the current streak.

Keep the scoring system simple in Phase 1.

------------------------------------------------------------------------

# Round Flow

A round should behave approximately like this:

``` text
START
  ↓
Generate random time
  ↓
Render clock
  ↓
Reset answer controls
  ↓
Start 10-second timer
  ↓
Player selects answer
  ↓
Player submits
  ↓
Validate
  ↓
Show feedback
  ↓
Update statistics
  ↓
Next Round
```

The player should be able to start another round quickly after feedback.

------------------------------------------------------------------------

# Difficulty Architecture

Do **not** implement a level system in Phase 1.

Instead, create a configurable difficulty object or equivalent
structure.

Example:

``` javascript
const difficulty = {
    name: "Beginner",
    timeLimit: 10,
    minuteIncrement: 1
};
```

The game should use these settings rather than scattering magic numbers
throughout the code.

Future versions may introduce:

-   Beginner
-   Easy
-   Medium
-   Hard
-   Custom mode
-   Progressive difficulty

Phase 1 only needs one default configuration.

------------------------------------------------------------------------

# State Management

Maintain the game's state in JavaScript.

At minimum, track:

``` text
Current target time
Selected hour
Selected minute
Timer state
Time remaining
Score
Streak
Accuracy
Question count
Best response time
```

Keep game state separate from presentation logic where practical.

------------------------------------------------------------------------

# Responsive Design

The game must work well on:

-   Mobile phones
-   Tablets
-   Desktop browsers

Prioritize the mobile experience.

On narrow screens:

-   Clock remains prominent.
-   Wheel pickers remain comfortably tappable.
-   Buttons have sufficiently large touch targets.
-   No horizontal scrolling should be required.
-   Text should remain readable.
-   The primary gameplay should fit naturally without feeling cramped.

------------------------------------------------------------------------

# Accessibility

Include basic accessibility from the beginning:

-   Semantic HTML
-   Labels for controls
-   Keyboard navigation where practical
-   Visible focus states
-   Sufficient contrast
-   Buttons that clearly communicate their purpose
-   Avoid relying exclusively on color for feedback

------------------------------------------------------------------------

# Animation & Feedback

Use subtle animations to make the game feel responsive.

Potential animations:

-   Wheel picker movement
-   Button press
-   Correct answer feedback
-   Incorrect answer feedback
-   Timer warning state
-   Transition between rounds

Do not over-animate the interface.

The gameplay should remain fast and distraction-free.

------------------------------------------------------------------------

# Phase 1 Non-Goals

Do not implement these yet:

-   User accounts
-   Cloud synchronization
-   Backend
-   Database
-   Online leaderboard
-   Multiplayer
-   Authentication
-   Achievements
-   Complex progression system
-   Multiple game modes
-   Multiple watch-face themes
-   Sound effects
-   PWA installation
-   Analytics
-   Social sharing

These can be considered after the core gameplay has been tested.

------------------------------------------------------------------------

# Future Extensibility

The implementation should make it reasonably easy to add later:

## Difficulty Modes

``` text
Beginner
Easy
Medium
Hard
Custom
```

## Game Modes

Possible future modes:

-   Classic
-   Speed Run
-   Survival
-   Streak Challenge
-   Practice
-   Time Attack

## Watch Faces

Possible future visual styles:

-   Minimal
-   Classic
-   Roman numerals
-   Luxury
-   Dark
-   Sport
-   Custom

## Persistent Progress

Later, browser local storage can be used for:

-   Best scores
-   Highest streak
-   Personal records
-   Settings
-   Unlocked modes

Cloud synchronization can be considered much later if needed.

------------------------------------------------------------------------

# Definition of Done

Phase 1 is complete when:

-   The application opens successfully in a browser.
-   A polished analog clock is displayed.
-   The clock shows a randomly generated time.
-   The hour and minute can be selected using wheel pickers.
-   The player can submit an answer.
-   Answers are correctly validated.
-   A 10-second countdown works.
-   Timeout works correctly.
-   Correct and incorrect feedback is displayed.
-   Score and streak work.
-   Accuracy is calculated.
-   Response time is recorded.
-   A new round can be started.
-   The layout works well on a phone-sized screen.
-   The interface looks like a small finished game rather than a raw
    prototype.
-   No backend or database is required.
-   The project can be deployed as a static website.

------------------------------------------------------------------------

# Development Principle

Build Phase 1 as a **complete playable experience**, not a disposable
mock-up.

Prefer simple, maintainable solutions over unnecessary frameworks or
infrastructure.

Do not add features that are not required by this specification.

The goal is to make the first version genuinely fun to use while keeping
the codebase small enough to evolve easily.
