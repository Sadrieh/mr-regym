/**
 * storage.js — persistence layer
 * Handles localStorage (always) and Google Sheets sync (optional).
 */

const Storage = (() => {

  const LOGS_KEY   = "mrregym_logs";
  const CONFIG_KEY = "mrregym_config";
  const MAX_LOGS   = 500;

  // ── CONFIG ────────────────────────────────────────────────────────

  function getConfig() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveConfig(cfg) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  }

  function getSheetsUrl() {
    return getConfig().sheetsUrl || "";
  }

  function setSheetsUrl(url) {
    const cfg = getConfig();
    cfg.sheetsUrl = url;
    saveConfig(cfg);
  }

  // ── LOGS ──────────────────────────────────────────────────────────

  function getAllLogs() {
    try {
      return JSON.parse(localStorage.getItem(LOGS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  /**
   * Save a completed session to localStorage.
   * @param {object} session  { userId, userName, dayTitleFa, dayTitleEn, logs[] }
   */
  function saveSession(session) {
    const all = getAllLogs();
    const entry = {
      ...session,
      date:      new Date().toLocaleDateString("fa-IR"),
      dateIso:   new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
    };
    all.unshift(entry);
    if (all.length > MAX_LOGS) all.splice(MAX_LOGS);
    localStorage.setItem(LOGS_KEY, JSON.stringify(all));
    return entry;
  }

  /**
   * Get the last recorded weight for a user + exercise + set index.
   * Looks through all saved sessions for the most recent match.
   */
  function getLastWeight(userId, nameEn, setIdx) {
    const all = getAllLogs();
    for (const session of all) {
      if (session.userId !== userId) continue;
      const match = session.logs.find(
        l => l.nameEn === nameEn && l.setNum === setIdx && l.weight !== ""
      );
      if (match) return match.weight;
    }
    return "";
  }

  // ── GOOGLE SHEETS SYNC ────────────────────────────────────────────

  /**
   * Push a completed session to Google Sheets via Apps Script Web App.
   * Returns a Promise that resolves to { ok: true } or rejects.
   *
   * Sheets columns: Date | User | Day (Fa) | Day (En) | Exercise (Fa) | Exercise (En) | Set | Weight (kg) | Reps
   */
  async function syncToSheets(session) {
    const url = getSheetsUrl();
    if (!url || !url.startsWith("https://")) {
      return Promise.reject(new Error("Sheets URL not configured"));
    }

    const rows = session.logs.map(l => ({
      date:       session.dateIso,
      user:       session.userName,
      dayFa:      session.dayTitleFa,
      dayEn:      session.dayTitleEn,
      exerciseFa: l.nameFa,
      exerciseEn: l.nameEn,
      set:        l.setNum + 1,
      weight:     l.weight,
      reps:       l.reps,
    }));

    return fetch(url, {
      method:  "POST",
      mode:    "no-cors",           // Apps Script requires no-cors
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ logs: rows }),
    });
  }

  // ── FETCH FROM SHEETS ─────────────────────────────────────────────

  /**
   * Fetch all rows from Google Sheets via Apps Script doGet.
   * Apps Script redirects to a googleusercontent.com URL, so we must
   * follow redirects — fetch() does this automatically in browsers.
   * Returns array of row arrays (first row is headers).
   */
  async function fetchFromSheets() {
    const url = getSheetsUrl();
    if (!url || !url.startsWith("https://")) {
      throw new Error("Sheets URL not configured");
    }
    const res  = await fetch(url, { redirect: "follow" });
    const json = await res.json();
    return json.logs || [];
  }

  // ── PUBLIC API ────────────────────────────────────────────────────

  return {
    getSheetsUrl,
    setSheetsUrl,
    getAllLogs,
    saveSession,
    getLastWeight,
    syncToSheets,
    fetchFromSheets,
  };

})();
