/**
 * history.js — History screen (device + Sheets tabs) and Settings screen
 */

// ── HISTORY ───────────────────────────────────────────────────────

const History = (() => {

  let _sheetsRows  = [];   // raw rows fetched from Sheets (excluding header)
  let _sheetsHeader = [];  // column headers

  // ── DEVICE TAB ──────────────────────────────────────────────────

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
      const byEx = {};
      entry.logs.forEach(l => {
        const key = l.nameEn || l.nameFa;
        if (!byEx[key]) byEx[key] = { nameFa: l.nameFa, nameEn: l.nameEn, sets: [] };
        byEx[key].sets.push(
          `ست ${l.setNum + 1}: ${l.weight !== "" ? l.weight + "kg" : "—"} × ${l.reps !== "" ? l.reps : "—"}`
        );
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

  function onFilterChange() { render(); }

  function buildFilter() {
    const select = document.getElementById("history-user-filter");
    if (!select) return;
    while (select.options.length > 1) select.remove(1);
    Object.entries(PROGRAM_CONFIG).forEach(([id, user]) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = user.name;
      select.appendChild(opt);
    });
  }

  // ── TAB SWITCHING ────────────────────────────────────────────────

  function switchTab(tab) {
    document.getElementById("tab-device").classList.toggle("active", tab === "device");
    document.getElementById("tab-sheets").classList.toggle("active", tab === "sheets");
    document.getElementById("tab-panel-device").style.display = tab === "device" ? "" : "none";
    document.getElementById("tab-panel-sheets").style.display = tab === "sheets" ? "" : "none";
  }

  // ── SHEETS TAB ───────────────────────────────────────────────────

  async function loadSheets() {
    const statusEl = document.getElementById("sheets-status");
    const tableWrap = document.getElementById("sheets-table-wrap");

    if (!Storage.getSheetsUrl()) {
      statusEl.style.display = "";
      statusEl.className = "sheets-status error";
      statusEl.textContent = "⚠️ Google Sheets URL تنظیم نشده — ابتدا در تنظیمات وارد کنید.";
      tableWrap.innerHTML = "";
      return;
    }

    statusEl.style.display = "";
    statusEl.className = "sheets-status loading";
    statusEl.textContent = "⏳ در حال بارگذاری از Google Sheets...";
    tableWrap.innerHTML = "";

    try {
      const rows = await Storage.fetchFromSheets();

      if (!rows || rows.length < 2) {
        statusEl.className = "sheets-status ok";
        statusEl.textContent = "✅ اتصال برقرار شد — هنوز داده‌ای ثبت نشده.";
        tableWrap.innerHTML = `<div class="sheets-empty"><div class="sei">📋</div><div>No data yet</div></div>`;
        return;
      }

      _sheetsHeader = rows[0];
      _sheetsRows   = rows.slice(1);

      statusEl.className = "sheets-status ok";
      statusEl.textContent = `✅ ${_sheetsRows.length} ردیف بارگذاری شد.`;

      renderSheetsTable(_sheetsRows);

    } catch (err) {
      statusEl.className = "sheets-status error";
      statusEl.textContent = `⚠️ خطا در بارگذاری: ${err.message}`;
      tableWrap.innerHTML = "";
    }
  }

  function filterSheets() {
    if (!_sheetsRows.length) return;
    const filter = document.getElementById("sheets-user-filter").value.trim().toLowerCase();
    // User column is index 1 (User Fa name)
    const filtered = filter
      ? _sheetsRows.filter(r => String(r[1] || "").toLowerCase().includes(filter))
      : _sheetsRows;
    renderSheetsTable(filtered);
  }

  /**
   * Render rows as a clean table.
   * Expected columns from Apps Script:
   * [0] Date  [1] User  [2] User(En)  [3] Day(Fa)  [4] Day(En)
   * [5] Exercise(Fa)  [6] Exercise(En)  [7] Set  [8] Weight(kg)  [9] Reps
   */
  function renderSheetsTable(rows) {
    const wrap = document.getElementById("sheets-table-wrap");
    if (!rows.length) {
      wrap.innerHTML = `<div class="sheets-empty"><div class="sei">🔍</div><div>No matching rows</div></div>`;
      return;
    }

    // Sort newest first — col 0 is ISO date string
    const sorted = [...rows].sort((a, b) => String(b[0]).localeCompare(String(a[0])));

    const rowsHtml = sorted.map(r => {
      const date    = r[0] || "—";
      const user    = r[1] || "—";
      const dayFa   = r[3] || "—";
      const exFa    = r[5] || "—";
      const exEn    = r[6] || "";
      const set     = r[7] !== undefined ? r[7] : "—";
      const weight  = r[8] !== undefined && r[8] !== "" ? `${r[8]} kg` : "—";
      const reps    = r[9] !== undefined && r[9] !== "" ? r[9] : "—";

      return `
        <tr>
          <td class="td-date">${date}</td>
          <td class="td-user">${user}</td>
          <td>${dayFa}</td>
          <td>
            <span class="td-fa">${exFa}</span>
            <span class="td-en">${exEn}</span>
          </td>
          <td class="td-num">${set}</td>
          <td class="td-num">${weight}</td>
          <td class="td-num">${reps}</td>
        </tr>`;
    }).join("");

    wrap.innerHTML = `
      <table class="sheets-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Day</th>
            <th>Exercise</th>
            <th>Set</th>
            <th>Weight</th>
            <th>Reps</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>`;
  }

  return { render, onFilterChange, buildFilter, switchTab, loadSheets, filterSheets };

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
  // Return all rows including header so client can parse columns correctly
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
