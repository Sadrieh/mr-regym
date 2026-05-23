/**
 * app.js — screen router and global state
 */

const App = (() => {

  // ── STATE ──────────────────────────────────────────────────────────
  let currentUserId   = null;
  let currentUserData = null;

  // ── ROUTER ────────────────────────────────────────────────────────

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add("active");

    // Trigger screen-specific init
    if (id === "screen-history")  History.render();
    if (id === "screen-settings") Settings.init();
  }

  function showToast(msg, duration = 2800) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), duration);
  }

  // ── USER SELECT ───────────────────────────────────────────────────

  function selectUser(userId) {
    currentUserId   = userId;
    currentUserData = PROGRAM_CONFIG[userId];
    if (!currentUserData) return console.error("Unknown user:", userId);
    DaySelect.render(userId, currentUserData);
    showScreen("screen-day");
  }

  function getCurrentUser() {
    return { id: currentUserId, data: currentUserData };
  }

  // ── INIT ──────────────────────────────────────────────────────────

  function init() {
    buildUserSelect();
  }

  function buildUserSelect() {
    const container = document.getElementById("user-cards-container");
    if (!container) return;
    container.innerHTML = "";

    Object.entries(PROGRAM_CONFIG).forEach(([id, user]) => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.onclick = () => selectUser(id);
      card.innerHTML = `
        <div class="user-avatar" style="background:${user.avatarColor}">${user.avatar}</div>
        <div class="user-info">
          <div class="name">${user.name}</div>
          <div class="meta">${user.info}</div>
          <div class="days-count">${user.days.length} روز تمرین</div>
        </div>
        <div class="arrow">‹</div>`;
      container.appendChild(card);
    });
  }

  return { init, showScreen, showToast, selectUser, getCurrentUser };

})();
