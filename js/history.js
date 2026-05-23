/**
 * history.js — History screen and Settings screen
 */

// ── HISTORY ───────────────────────────────────────────────────────

const History = (() => {

  function render() {
    const filter  = document.getElementById("history-user-filter")?.value ?? "";
    const all     = Storage.getAllLogs();
    const entries = filter ? all.filter(e => e.userId === filter) : all;
    const list    = document.getElementById("history-list");
    if (!list) return;

    if (!entries.length) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="ei">📋</div>
          <div>هنوز تمرینی ثبت نشده</div>
        </div>`;
      return;
    }

    list.innerHTML = entries.map(entry => {
      // Group logs by exercise name
      const byEx = {};
      entry.logs.forEach(l => {
        const key = l.nameEn || l.nameFa;
        if (!byEx[key]) byEx[key] = { nameFa: l.nameFa, nameEn: l.nameEn, sets: [] };
        byEx[key].sets.push(`ست ${l.setNum + 1}: ${l.weight !== "" ? l.weight + "kg" : "—"} × ${l.reps !== "" ? l.reps : "—"}`);
      });

      const rows = Object.values(byEx).map(ex => `
        <div class="hist-row">
          <div class="hist-ex-names">
            <span class="hist-ex-fa">${ex.nameFa}</span>
            <span class="hist-ex-en">${ex.nameEn}</span>
          </div>
          <div class="hist-ex-sets">${ex.sets.join(" &nbsp;|&nbsp; ")}</div>
        </div>`).join("");

      return `
        <div class="hist-item">
          <div class="hist-head">
            <div>
              <div class="hist-title">${entry.userName} · ${entry.dayTitleFa}</div>
              <div class="hist-subtitle">${entry.userNameEn || ""} · ${entry.dayTitleEn || ""}</div>
            </div>
            <div class="hist-date">${entry.date}</div>
          </div>
          <div class="hist-ex-list">
            ${rows || '<span style="color:var(--text3)">ثبتی وجود ندارد</span>'}
          </div>
        </div>`;
    }).join("");
  }

  // Expose for select onchange
  function onFilterChange() { render(); }

  // Build user filter options from PROGRAM_CONFIG
  function buildFilter() {
    const select = document.getElementById("history-user-filter");
    if (!select) return;
    // Remove all options except "همه"
    while (select.options.length > 1) select.remove(1);
    Object.entries(PROGRAM_CONFIG).forEach(([id, user]) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = user.name;
      select.appendChild(opt);
    });
  }

  return { render, onFilterChange, buildFilter };

})();


// ── SETTINGS ──────────────────────────────────────────────────────

const Settings = (() => {

  const APPS_SCRIPT_CODE = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Logs") || ss.insertSheet("Logs");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Date", "User", "User (En)",
      "Day (Fa)", "Day (En)",
      "Exercise (Fa)", "Exercise (En)",
      "Set", "Weight (kg)", "Reps"
    ]);
  }
  data.logs.forEach(function(r) {
    sheet.appendRow([
      r.date, r.user, r.userEn,
      r.dayFa, r.dayEn,
      r.exerciseFa, r.exerciseEn,
      r.set, r.weight, r.reps
    ]);
  });
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Logs");
  if (!sheet) return ContentService
    .createTextOutput(JSON.stringify({ logs: [] }))
    .setMimeType(ContentService.MimeType.JSON);
  var data = sheet.getDataRange().getValues();
  return ContentService
    .createTextOutput(JSON.stringify({ logs: data }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  function init() {
    const input = document.getElementById("sheets-url");
    if (input) input.value = Storage.getSheetsUrl();

    const codeEl = document.getElementById("apps-script-code");
    if (codeEl) codeEl.textContent = APPS_SCRIPT_CODE;
  }

  function save() {
    const url = document.getElementById("sheets-url")?.value.trim() ?? "";
    Storage.setSheetsUrl(url);
    App.showToast("✅ تنظیمات ذخیره شد");
  }

  function copyCode() {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE).then(() => {
      App.showToast("✅ کد کپی شد");
    }).catch(() => {
      App.showToast("⚠️ کپی دستی انجام دهید");
    });
  }

  return { init, save, copyCode };

})();
