# MR.REGYM Fitness Tracker

A mobile-first gym session tracker for two users (افشین & شیوا), built as a static web app — no server required.

## Features

- 📱 Works offline — add to Home Screen on iPhone/Android
- 👥 Multi-user: separate programs and logs per person
- 📋 All exercises visible on one scrollable page per session
- ⚖️ Pre-fills weight from your last session
- 🔄 Pre-fills reps with median of the prescribed range
- ▶️ YouTube tutorial link on every exercise
- ⏱ Rest timer between exercises
- 💾 Logs saved locally on device
- 📊 Optional Google Sheets sync for permanent cloud storage

---

## Project Structure

```
mr-regym/
├── index.html          ← App shell (screens, markup only)
├── css/
│   └── styles.css      ← All styling
├── js/
│   ├── app.js          ← Router, screen management
│   ├── session.js      ← Day select, session flow, timer
│   ├── history.js      ← History screen, Settings screen
│   └── storage.js      ← localStorage + Google Sheets sync
└── data/
    └── program.js      ← ⭐ PROGRAM CONFIG — edit this when program changes
```

---

## Updating the Program

**Only edit `data/program.js`.**

When your coach gives you a new program, find the relevant user block and update the `exercises` array for the relevant day. Each exercise has these fields:

| Field         | Type      | Description |
|---------------|-----------|-------------|
| `nameFa`      | string    | Persian name (shown in app) |
| `nameEn`      | string    | English name (saved in logs) |
| `sets`        | number    | Number of sets |
| `reps`        | string    | `"8-10"`, `"12"`, `"max"`, `"15+10+10"` |
| `system`      | string    | `"خطی"`, `"هرمی"`, `"سوپرست"`, `"رست پاز"`, `"مایورپس"` |
| `rest`        | number    | Rest in seconds (0 = no timer) |
| `superset`    | boolean   | `true` if this is a superset block |
| `note`        | string    | Optional coach note |
| `videoSearch` | string    | YouTube search query for tutorial |

### Adding a new user

Add a new key to `PROGRAM_CONFIG` in `data/program.js`, following the same structure as `afshin` or `shiva`. The app automatically picks it up — no other file needs changing.

---

## Deploying to GitHub Pages

### First time

```bash
# 1. Create a GitHub repo (e.g. "mr-regym")
# 2. Push this folder:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mr-regym.git
git push -u origin main

# 3. In GitHub: Settings → Pages → Source: Deploy from branch → main / (root)
# 4. Your URL: https://YOUR_USERNAME.github.io/mr-regym/
```

### After updating the program

```bash
# Edit data/program.js, then:
git add data/program.js
git commit -m "Update program — new exercises week X"
git push
```

GitHub Pages deploys in ~60 seconds.

---

## Google Sheets Setup (optional)

1. Create a new Google Sheet
2. Open **Extensions → Apps Script**
3. Paste the code from the app's Settings screen (or copy from below)
4. Click **Deploy → New deployment → Web app**
5. Set: Execute as **Me** · Access **Anyone**
6. Copy the Web App URL
7. Open the app → Settings → paste the URL → Save

### Sheets columns saved

`Date | User | User (En) | Day (Fa) | Day (En) | Exercise (Fa) | Exercise (En) | Set | Weight (kg) | Reps`

---

## Running locally

Just open `index.html` in a browser — no build step, no npm, no server needed.

For the best local experience (avoids CORS on script imports):

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then open `http://localhost:8080`.

---

## Add to Home Screen (iOS)

1. Open the GitHub Pages URL in Safari
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. Done — it opens like a native app
