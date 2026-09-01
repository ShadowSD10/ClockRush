# 🕐 ClockRush

> **Read it. Beat it.**

ClockRush is a fast-paced clock-reading game designed to test how quickly you can **look at an analog clock, remember the time, and beat the clock**.

What starts as a simple clock-reading challenge quickly turns into a test of recognition speed, accuracy, consistency, and eventually... survival. 🔥

---

## 🎮 How It Works

Each round shows you an analog clock for a limited amount of time.

Your job:

1. 👀 **Read the clock**
2. 🧠 **Remember the time**
3. ⏱️ **Enter the hour and minute**
4. 🎯 **Submit your answer**
5. 🔥 **Keep your streak alive**

As the difficulty increases, you'll have less time to recognize the clock and encounter more challenging clock faces.

---

## 🚀 Game Modes

### ⚡ Quick Rush

A focused 10-round challenge.

- 10 rounds
- Automatic round progression
- Track your score, accuracy, streak, and speed
- Perfect for a quick session

### ♾️ Endless

No round limit.

Keep playing until you decide to stop.

How far can you go?

### ❤️ Survival

You have a limited number of lives.

Choose between:

- ❤️ **1 Life** — one mistake ends the run
- ❤️❤️❤️ **3 Lives** — you've got a little room for mistakes

Wrong answers and timeouts cost a life.

Correct answers keep the run alive.

### ⏱️ Time Attack

You have **60 seconds**.

Answer as many clocks as possible before the global timer reaches zero.

The clock-specific timer tracks how long you spend on each clock, while the 60-second session timer determines the end of the run.

### 🧠 Adaptive

An endless mode that adapts to your performance.

Start at **Easy** and gradually move through the difficulty levels as your performance improves.

If things start getting rough, the difficulty can come back down.

The goal isn't simply to survive — it's to find your limit.

---

## 🎯 Difficulty Levels

ClockRush currently has five standard difficulty levels:

| Difficulty | Viewing Time | Minute Precision | Clock Faces |
|---|---:|---|---|
| 🟢 Beginner | 30s | 5 minutes | Numbers |
| 🔵 Easy | 20s | 5 minutes | Numbers + Roman |
| 🟡 Medium | 15s | 1 minute | Numbers + Roman + Important |
| 🟠 Hard | 10s | 1 minute | Numbers + Roman + Important + Minimal |
| 🔴 Advanced | 5s | 1 minute | Minimal |

### Custom Difficulty

Want to make your own challenge?

Custom mode lets you configure:

- Viewing time
- Minute precision
- Clock face

---

## 🕰️ Clock Faces

ClockRush includes several clock styles:

### Numbers

Classic analog clock with numbers **1–12**.

### Roman

Roman numerals from **I–XII**.

### Important Numbers

Only the four major positions:

**12 · 3 · 6 · 9**

### Minimal

No numbers.

Just the clock, the hands, and your brain. 😈

Higher difficulties introduce increasingly challenging combinations of these faces.

---

## 🎛️ Answer Modes

Choose how you want to enter your answer.

### 🔄 Scroller

Use the circular hour and minute selectors to choose your answer.

The minute wheel automatically respects the active difficulty's precision.

### ⌨️ Type

Enter the hour and minute directly using numeric inputs.

Input is validated according to the current difficulty:

- Hour: `1–12`
- 1-minute precision: `00–59`
- 5-minute precision: `00, 05, 10 ... 55`

---

## 🔥 Scoring & Stats

ClockRush tracks your performance throughout a session.

Current statistics include:

- Score
- Streak
- Accuracy
- Best recognition time
- Questions answered
- Best streak

Every correct answer builds your streak.

One mistake?

💀 Your streak is gone.

---

## 🎨 Themes

ClockRush comes with multiple visual themes:

- 🌑 Midnight
- ☀️ Light
- 🌲 Forest
- 🌤️ Skyline
- 🍑 Peach
- 🌌 Aurora

---

## 🔊 Audio

ClockRush includes audio feedback for gameplay interactions.

- 🎵 Background music
- 🔘 UI confirmation sounds
- 🪟 Popup sounds
- ❌ Incorrect answer sound
- ✅ Correct answer sound

Audio can be controlled independently through the options menu.

---

## 📱 Built for the Browser

ClockRush is designed to run directly in the browser with no installation required.

The interface is responsive and designed to work across:

- 💻 Desktop
- 📱 Mobile
- 🖥️ Larger screens

The goal is simple:

**Open it. Play it. Get faster.**

---

## 🛠️ Tech Stack

ClockRush is intentionally lightweight.

- HTML
- CSS
- Vanilla JavaScript
- SVG
- Web Audio API

No frameworks.  
No backend.  
No unnecessary dependencies.

Just a browser and a clock. 🕐

---

## 📂 Project Structure

```text
ClockRush/
├── index.html
├── script.js
├── style.css
├── assets/
│   ├── bgm.mp3
│   ├── confirm.mp3
│   ├── popup.mp3
│   ├── correct.mp3
│   └── error.mp3
└── docs/
    └── ...
```

---

## 🚧 Project Status

ClockRush is an actively evolving project.

The core gameplay loop is playable, with multiple difficulty levels, game modes, adaptive difficulty, themes, audio, statistics, and multiple answer methods already in place.

More improvements are planned as the game evolves.

---

## 🗺️ Roadmap

Some ideas planned for future versions:

- 💾 Persistent personal records
- 📊 Long-term statistics
- 📈 Performance history
- 🎯 More advanced adaptive difficulty
- 🗓️ Daily challenges
- 🏆 Achievements
- 📱 Progressive Web App support
- 🌐 Online leaderboards

The focus is currently on making the core gameplay loop feel **fast, polished, and addictive** before expanding into larger systems.

---

## 🤝 Contributing

ClockRush is currently a personal project, but suggestions, bug reports, and ideas are welcome.

If you find something broken or have an idea that could make the game better, feel free to open an issue.

---

## 📜 License

License information will be added as the project develops.

---

<div align="center">

### 🕐 ClockRush

**Read it. Beat it.**

*How fast can you really read a clock?*

</div>
