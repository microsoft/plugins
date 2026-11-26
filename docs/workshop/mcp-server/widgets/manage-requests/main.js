import "../shared/styles.css";
import { startWidget, esc, fmtDate } from "../shared/bridge.js";

const root = document.getElementById("root");
let bridge;
let state = { requests: [] };

function render(data, notice) {
  state = { ...state, ...data };
  const rows = state.requests ?? [];
  root.innerHTML = `
    <header><div class="logo">F</div><div><h1>My leave requests</h1><small>Pending, or approved and not yet started</small></div></header>
    ${rows.length === 0 ? `<div class="empty">You have no open leave requests.</div>` : `
    <table>
      <thead><tr><th>Request</th><th>Dates</th><th>Days</th><th>Status</th><th></th></tr></thead>
      <tbody>${rows.map((r) => `
        <tr data-id="${esc(r.id)}">
          <td><b>${esc(r.id)}</b><div class="hint">${r.leaveType === "annual" ? "Annual" : "Personal"}${r.reason ? ` - ${esc(r.reason)}` : ""}</div></td>
          <td>${esc(fmtDate(r.startDate))}<div class="hint">to ${esc(fmtDate(r.endDate))}</div></td>
          <td>${esc(r.days)}</td>
          <td><span class="status ${esc(r.status)}">${esc(r.status)}</span></td>
          <td style="text-align:right"><button class="secondary" data-action="ask">Delete</button></td>
        </tr>`).join("")}
      </tbody>
    </table>`}
    ${notice ? `<div class="msg ${notice.type}">${esc(notice.text)}</div>` : ""}`;
}

root.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.closest("tr").dataset.id;
  if (btn.dataset.action === "ask") {
    // Two-step confirm: destructive actions should never be one click.
    btn.parentElement.innerHTML = `<button class="danger" data-action="confirm">Confirm</button> <button class="secondary" data-action="cancel">Keep</button>`;
    return;
  }
  if (btn.dataset.action === "cancel") return render({});
  if (btn.dataset.action === "confirm") {
    btn.disabled = true; btn.textContent = "Deleting...";
    try {
      const result = await bridge.callTool("delete_leave_request", { requestId: id });
      render({ requests: result.requests ?? [] }, { type: "ok", text: `${id} deleted. The days are back in your balance.` });
    } catch (err) {
      render({}, { type: "err", text: err.message });
    }
  }
});

(async () => {
  try {
    bridge = await startWidget("Fabrikam My Leave Requests", (data) => {
      if (data?.mode === "deleted") render({ requests: data.requests }, { type: "ok", text: `${data.deleted.id} deleted.` });
      else render(data ?? {});
    });
  } catch (err) {
    root.innerHTML = `<div class="msg err">Could not connect to the host: ${esc(err.message)}</div>`;
  }
})();
