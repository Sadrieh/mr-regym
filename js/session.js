/**
 * session.js — day selection, exercise session, rest timer
 */

// ── DAY SELECT MODULE ─────────────────────────────────────────────

const DaySelect = (() => {

  function render(userId, userData) {
    document.getElementById("day-screen-name").textContent = userData.name;
    const container = document.getElementById("day-cards-container");
    container.innerHTML = "";

    userData.days.forEach((day, i) => {
      const card = document.createElement("div");
      card.className = "day-card";
      card.onclick = () => Session.start(i);
      card.innerHTML = `
        <div class="day-num">${i + 1}</div>
        <div class="day-info">
          <div class="day-title">${day.titleFa}</div>
          <div class="day-sub">${day.titleEn}</div>
          <div class="day-ex">${day.exercises.length} حرکت</div>
        </div>
        <div class="arrow">‹</div>`;
      container.appendChild(card);
    });
  }

  return { render };

})();


// ── SESSION MODULE ────────────────────────────────────────────────

const Session = (() => {

  let exercises      = [];
  let dayTitleFa     = "";
  let dayTitleEn     = "";
  let activeIdx      = 0;
  let timerInterval  = null;
  let timerRemaining = 0;
  let timerTotal     = 0;
  let timerCb        = null;

  // ── HELPERS ─────────────────────────────────────────────────────

  /**
   * Parse a reps string and return the default (median) integer value.
   * "8-10"       → 9
   * "12-15"      → 13  (rounds to nearest)
   * "10-12-15"   → 10  (pyramid: use first)
   * "15+10+10"   → 15  (myo-reps: use first number)
   * "max"        → ""  (empty, user fills)
   * "15"         → 15
   * "15 دقیقه"  → ""  (cardio duration, no numeric prefill)
   */
  function parseRepsDefault(repsStr) {
    if (!repsStr) return "";
    const s = String(repsStr).trim();
    if (s === "max") return "";
    if (/[^0-9\-\+\s]/.test(s)) return ""; // contains non-numeric chars (e.g. "دقیقه")
    if (s.includes("+")) return parseInt(s.split("+")[0]) || "";
    const parts = s.split("-").map(x => parseInt(x)).filter(x => !isNaN(x));
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return Math.round((parts[0] + parts[1]) / 2);
    return parts[0]; // pyramid: use first
  }

  // ── START ────────────────────────────────────────────────────────

  function start(dayIdx) {
    const { id: userId, data: userData } = App.getCurrentUser();
    if (!userData) return;

    if (dayIdx === "corrective") {
      exercises  = [...userData.corrective, ...userData.cardio];
      dayTitleFa = "تمرینات اصلاحی + هوازی";
      dayTitleEn = "Corrective Exercises + Cardio";
    } else {
      const day  = userData.days[dayIdx];
      exercises  = day.exercises;
      dayTitleFa = day.titleFa;
      dayTitleEn = day.titleEn;
    }

    activeIdx = 0;
    document.getElementById("session-title").textContent = dayTitleFa;
    document.getElementById("session-sub").textContent   = dayTitleEn;
    document.getElementById("session-date").textContent  =
      new Date().toLocaleDateString("fa-IR");

    renderAllExercises();
    updateProgress();
    App.showScreen("screen-session");
  }

  // ── RENDER ALL EXERCISES ─────────────────────────────────────────

  function renderAllExercises() {
    const { id: userId } = App.getCurrentUser();
    const scroll = document.getElementById("exercises-scroll");
    scroll.innerHTML = "";

    exercises.forEach((ex, i) => {
      const block = document.createElement("div");
      block.className = "ex-block" + (i === 0 ? " active-ex open" : "");
      block.id = `ex-block-${i}`;

      // Build set rows
      const totalSets = ex.sets || 3;
      let setsHtml = `<div class="sets-label">ثبت وزنه و تکرار</div>`;

      for (let s = 0; s < totalSets; s++) {
        const lastW       = Storage.getLastWeight(userId, ex.nameEn, s);
        const defaultReps = parseRepsDefault(ex.reps);
        const wClass = lastW        !== "" ? "set-input prefilled" : "set-input";
        const rClass = defaultReps  !== "" ? "set-input prefilled" : "set-input";

        setsHtml += `
          <div class="set-row">
            <div class="set-num">${s + 1}</div>
            <div class="set-input-wrap">
              <span class="set-input-label">وزنه kg</span>
              <input type="number"
                class="${wClass}"
                id="w-${i}-${s}"
                value="${lastW}"
                inputmode="decimal" min="0" step="0.5"
                oninput="Session.onInput(this)">
            </div>
            <div class="set-input-wrap">
              <span class="set-input-label">تکرار</span>
              <input type="number"
                class="${rClass}"
                id="r-${i}-${s}"
                value="${defaultReps}"
                inputmode="numeric" min="0"
                oninput="Session.onInput(this)">
            </div>
          </div>`;

        if (ex.superset && s < totalSets - 1) {
          setsHtml += `
            <div class="superset-divider">
              <div class="sd-line"></div>
              <div class="sd-text">سوپرست</div>
              <div class="sd-line"></div>
            </div>`;
        }
      }

      // Video link
      const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.videoSearch || ex.nameEn)}`;

      block.innerHTML = `
        <div class="ex-header" onclick="Session.toggleBlock(${i})">
          <div class="ex-header-left">
            <div class="ex-index">
              <span id="ex-badge-${i}" class="ex-badge">حرکت ${i + 1}</span>
            </div>
            <div class="ex-title-fa">${ex.nameFa}</div>
            <div class="ex-title-en">${ex.nameEn}</div>
            <div class="ex-chips">
              <span class="chip chip-sets">📦 ${ex.sets} ست</span>
              <span class="chip chip-reps">🔄 ${ex.reps}</span>
              ${ex.system ? `<span class="chip chip-sys">⚡ ${ex.system}</span>` : ""}
              ${ex.rest > 0 ? `<span class="chip chip-rest">⏱ ${ex.rest}s</span>` : ""}
            </div>
          </div>
          <div class="ex-toggle-icon" id="tog-${i}">›</div>
        </div>
        <div class="ex-body">
          ${ex.note ? `<div class="ex-note">📌 ${ex.note}</div>` : ""}
          <a class="video-link" href="${ytUrl}" target="_blank" rel="noopener">
            <span class="video-icon">▶</span>
            مشاهده ویدیوی آموزشی
            <span class="video-en">${ex.nameEn}</span>
          </a>
          ${setsHtml}
        </div>`;

      scroll.appendChild(block);
    });
  }

  function toggleBlock(i) {
    const block = document.getElementById(`ex-block-${i}`);
    if (block) block.classList.toggle("open");
  }

  function onInput(el) {
    el.classList.remove("prefilled");
    el.classList.toggle("edited", el.value !== "");
  }

  // ── PROGRESS ────────────────────────────────────────────────────

  function updateProgress() {
    const total = exercises.length;
    const pct   = total > 0 ? Math.round(((activeIdx + 1) / total) * 100) : 0;
    document.getElementById("prog-fill").style.width  = pct + "%";
    document.getElementById("prog-label").textContent =
      `${activeIdx + 1} از ${total} حرکت`;

    const isLast = activeIdx >= total - 1;
    // Next hidden on last exercise. Finish ALWAYS visible so user can stop any time.
    document.getElementById("btn-next").style.display   = isLast ? "none" : "flex";
    document.getElementById("btn-finish").style.display = "flex";
    document.getElementById("btn-prev").style.opacity   = activeIdx === 0 ? "0.4" : "1";
  }

  // ── NAVIGATION ──────────────────────────────────────────────────

  function scrollToBlock(i) {
    document.querySelectorAll(".ex-block").forEach((b, idx) => {
      b.classList.remove("active-ex");
      if (idx !== i) b.classList.remove("open");
    });
    const block = document.getElementById(`ex-block-${i}`);
    if (!block) return;
    block.classList.add("active-ex", "open");
    setTimeout(() => block.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function nav(dir) {
    const newIdx = activeIdx + dir;
    if (newIdx < 0 || newIdx >= exercises.length) return;

    const ex = exercises[activeIdx];
    if (dir === 1 && ex.rest > 0) {
      startTimer(ex.rest, () => {
        activeIdx = newIdx;
        updateProgress();
        scrollToBlock(activeIdx);
      });
    } else {
      activeIdx = newIdx;
      updateProgress();
      scrollToBlock(activeIdx);
    }
  }

  // ── TIMER ────────────────────────────────────────────────────────

  function startTimer(seconds, callback) {
    timerTotal     = seconds;
    timerRemaining = seconds;
    timerCb        = callback;

    const el          = document.getElementById("rest-timer");
    const circle      = document.getElementById("timer-circle");
    const countEl     = document.getElementById("timer-count");
    const circumference = 2 * Math.PI * 68;
    circle.style.strokeDasharray = circumference;
    el.classList.add("show");

    function tick() {
      const pct = timerRemaining / timerTotal;
      circle.style.strokeDashoffset = circumference * (1 - pct);
      countEl.textContent = timerRemaining;
    }
    tick();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timerRemaining--;
      tick();
      if (timerRemaining <= 0) skipTimer();
    }, 1000);
  }

  function skipTimer() {
    clearInterval(timerInterval);
    document.getElementById("rest-timer").classList.remove("show");
    if (timerCb) { timerCb(); timerCb = null; }
  }

  // ── COLLECT LOGS ─────────────────────────────────────────────────

  function collectLogs() {
    const logs = [];
    exercises.forEach((ex, i) => {
      for (let s = 0; s < (ex.sets || 3); s++) {
        const w = document.getElementById(`w-${i}-${s}`)?.value ?? "";
        const r = document.getElementById(`r-${i}-${s}`)?.value ?? "";
        if (w !== "" || r !== "") {
          logs.push({
            nameFa: ex.nameFa,
            nameEn: ex.nameEn,
            setNum: s,
            weight: w,
            reps:   r,
          });
        }
      }
    });
    return logs;
  }

  // ── FINISH ───────────────────────────────────────────────────────

  async function finish(destination) {
    clearInterval(timerInterval);
    document.getElementById("rest-timer").classList.remove("show");

    const { id: userId, data: userData } = App.getCurrentUser();
    const logs = collectLogs();

    const session = {
      userId,
      userName:   userData.name,
      userNameEn: userData.nameEn,
      dayTitleFa,
      dayTitleEn,
      logs,
    };

    const saved = Storage.saveSession(session);

    // If called from exit-modal (destination set), navigate silently without done screen
    if (destination) {
      _leaveSession(destination);
      App.showToast("✅ تمرین ذخیره شد");
      return;
    }

    // Normal finish: show done screen
    document.getElementById("done-name").textContent      = userData.name;
    document.getElementById("done-ex-count").textContent  = exercises.length;
    document.getElementById("done-set-count").textContent = logs.length;
    App.showScreen("screen-done");

    // Sync to Sheets
    const statusEl = document.getElementById("save-status");
    const iconEl   = document.getElementById("save-icon");
    const msgEl    = document.getElementById("save-msg");

    if (Storage.getSheetsUrl()) {
      statusEl.className = "save-status saving";
      iconEl.textContent = "⏳";
      msgEl.textContent  = "در حال ذخیره در Google Sheets...";
      try {
        await Storage.syncToSheets(saved);
        statusEl.className = "save-status saved";
        iconEl.textContent = "✅";
        msgEl.textContent  = "ذخیره شد در Google Sheets!";
      } catch {
        statusEl.className = "save-status error";
        iconEl.textContent = "⚠️";
        msgEl.textContent  = "ذخیره موقت — بررسی اتصال";
      }
    } else {
      statusEl.className = "save-status saved";
      iconEl.textContent = "💾";
      msgEl.textContent  = "ذخیره شد روی دستگاه (Google Sheets تنظیم نشده)";
    }
  }

  // ── EXIT HELPERS ─────────────────────────────────────────────────

  function _hasAnyLog() {
    return exercises.some((ex, i) => {
      for (let s = 0; s < (ex.sets || 3); s++) {
        const w = document.getElementById(`w-${i}-${s}`)?.value ?? "";
        const r = document.getElementById(`r-${i}-${s}`)?.value ?? "";
        if (w !== "" || r !== "") return true;
      }
      return false;
    });
  }

  function _leaveSession(destination) {
    clearInterval(timerInterval);
    document.getElementById("rest-timer").classList.remove("show");
    if (destination === "home") App.showScreen("screen-user");
    else App.showScreen("screen-day");
  }

  /**
   * Called by the ✕ button (exit to home) and the ‹ back button (exit to day select).
   * destination: "home" | "days"
   * If there are any logged values, show a 3-option dialog: Save & Exit | Discard | Cancel.
   * If nothing logged, just confirm a simple discard.
   */
  function confirmExit(destination) {
    destination = destination || "days";

    if (!_hasAnyLog()) {
      if (confirm("از تمرین خارج می‌شوید؟")) {
        _leaveSession(destination);
      }
      return;
    }

    // Has data — use a custom modal overlay instead of nested confirms
    _showExitModal(destination);
  }

  function _showExitModal(destination) {
    // Remove any existing modal
    const old = document.getElementById("exit-modal");
    if (old) old.remove();

    const modal = document.createElement("div");
    modal.id = "exit-modal";
    modal.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:200;
      display:flex;align-items:flex-end;justify-content:center;padding:0 0 20px;`;

    modal.innerHTML = `
      <div style="background:#1e1e2e;border:1px solid rgba(255,255,255,0.12);border-radius:16px;
                  padding:22px 20px;width:100%;max-width:380px;text-align:center;">
        <div style="font-size:17px;font-weight:700;margin-bottom:8px;">خروج از تمرین</div>
        <div style="font-size:13px;color:#8888a8;margin-bottom:22px;line-height:1.6;">
          پیشرفت ثبت‌شده را ذخیره کنید؟
        </div>
        <div style="display:flex;flex-direction:column;gap:9px;">
          <button id="em-save"
            style="padding:13px;border-radius:11px;border:none;font-size:15px;font-weight:700;
                   background:linear-gradient(135deg,#e8501a,#f07030);color:#fff;cursor:pointer;">
            ذخیره و خروج
          </button>
          <button id="em-discard"
            style="padding:13px;border-radius:11px;border:1px solid rgba(255,255,255,0.1);
                   font-size:15px;font-weight:600;background:#1a1a28;color:#e06060;cursor:pointer;">
            بدون ذخیره خارج شو
          </button>
          <button id="em-cancel"
            style="padding:11px;border-radius:11px;border:1px solid rgba(255,255,255,0.08);
                   font-size:14px;background:transparent;color:#8888a8;cursor:pointer;">
            ادامه تمرین
          </button>
        </div>
      </div>`;

    document.body.appendChild(modal);

    document.getElementById("em-save").onclick = async () => {
      modal.remove();
      await finish(destination);   // save then navigate to destination
    };
    document.getElementById("em-discard").onclick = () => {
      modal.remove();
      _leaveSession(destination);
    };
    document.getElementById("em-cancel").onclick = () => {
      modal.remove();
    };
  }

  // ── PUBLIC ───────────────────────────────────────────────────────

  return {
    start,
    toggleBlock,
    onInput,
    nav,
    skipTimer,
    finish,
    confirmExit,
  };

})();
