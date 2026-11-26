import "../shared/styles.css";
import { startWidget, esc, weekdaysBetween, fmtDate } from "../shared/bridge.js";

const root = document.getElementById("root");
let bridge;

function balancesHtml(balances = []) {
  return `<div class="balances">${balances.map((b) => `
    <div class="pill"><b>${esc(b.available)}</b><span>${esc(b.label)} available${b.pending ? ` (${esc(b.pending)} pending)` : ""}</span></div>`).join("")}</div>`;
}

function header(sub) {
  return `<header><div class="logo">F</div><div><h1>Leave request</h1><small>${esc(sub)}</small></div></header>`;
}

function renderForm(data, error) {
  const p = data.prefill ?? {};
  root.innerHTML = `
    ${header(`Approver: ${data.approver?.name ?? "your manager"}`)}
    ${balancesHtml(data.balances)}
    <form id="f" novalidate>
      <label>Leave type
        <select name="leaveType">
          <option value="annual" ${p.leaveType !== "personal" ? "selected" : ""}>Annual leave</option>
          <option value="personal" ${p.leaveType === "personal" ? "selected" : ""}>Personal leave</option>
        </select>
      </label>
      <span></span>
      <label>First day<input type="date" name="startDate" required min="${esc(data.today)}" value="${esc(p.startDate)}" /></label>
      <label>Last day<input type="date" name="endDate" required min="${esc(data.today)}" value="${esc(p.endDate)}" /></label>
      <label class="full">Reason (optional)<textarea name="reason" maxlength="200">${esc(p.reason)}</textarea></label>
      <div class="row"><span class="hint" id="days">Select dates</span><button type="submit" id="submit">Submit request</button></div>
    </form>
    ${error ? `<div class="msg err">${esc(error)}</div>` : ""}`;

  const form = root.querySelector("#f");
  const daysEl = root.querySelector("#days");
  const update = () => {
    const n = weekdaysBetween(form.startDate.value, form.endDate.value);
    daysEl.textContent = n ? `${n} weekday(s) - public holidays are excluded when you submit` : "Select dates";
  };
  form.addEventListener("input", update);
  update();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const args = Object.fromEntries(new FormData(form));
    if (!args.startDate || !args.endDate) return renderForm({ ...data, prefill: args }, "Please choose a first and last day.");
    const btn = root.querySelector("#submit");
    btn.disabled = true; btn.textContent = "Submitting...";
    try {
      render(await bridge.callTool("create_leave_request", args));
    } catch (err) {
      renderForm({ ...data, prefill: args }, err.message);
    }
  });
}

function renderCreated(data) {
  const r = data.request;
  root.innerHTML = `
    ${header(`Sent to ${data.approver?.name ?? "your manager"} for approval`)}
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <b>${esc(r.id)} - ${r.leaveType === "annual" ? "Annual" : "Personal"} leave</b>
        <span class="status pending">${esc(r.status)}</span>
      </div>
      <div style="margin-top:6px">${esc(fmtDate(r.startDate))} to ${esc(fmtDate(r.endDate))} - <b>${esc(r.days)}</b> working day(s)</div>
      ${r.reason ? `<div class="hint" style="margin-top:4px">${esc(r.reason)}</div>` : ""}
    </div>
    <div style="margin-top:12px">${balancesHtml(data.balances)}</div>
    <div class="msg ok">Request submitted. You'll be notified when ${esc(data.approver?.name ?? "your manager")} decides.</div>`;
}

function render(data) {
  if (data?.mode === "created") return renderCreated(data);
  return renderForm(data ?? {});
}

(async () => {
  try {
    bridge = await startWidget("Fabrikam Leave Request", render);
  } catch (err) {
    root.innerHTML = `<div class="msg err">Could not connect to the host: ${esc(err.message)}</div>`;
  }
})();
