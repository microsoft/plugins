import { test } from "node:test";
import assert from "node:assert/strict";
import { businessDaysBetween, fyRange, fyForDate, publicHolidays, leaveBalances, workingDaysForFy, validateNewRequest } from "../src/leave-logic.js";
import seed from "../data/seed.json" with { type: "json" };

const alex = seed.employees.find((e) => e.id === "E1001");

test("business days skip weekends and public holidays", () => {
  assert.equal(businessDaysBetween("2026-09-14", "2026-09-18"), 5);
  assert.equal(businessDaysBetween("2026-12-21", "2026-12-25"), 4); // Christmas Day
  assert.equal(businessDaysBetween("2026-11-28", "2026-11-29"), 0); // weekend
});

test("financial year helpers", () => {
  assert.deepEqual(fyRange("2025-26"), { label: "2025-26", start: "2025-07-01", end: "2026-06-30" });
  assert.equal(fyForDate("2026-11-25"), "2026-27");
  assert.equal(fyForDate("2026-03-01"), "2025-26");
  assert.throws(() => fyRange("2025-27"));
});

test("Easter-based holidays are correct for 2026", () => {
  const names = Object.fromEntries(publicHolidays(2026).map((h) => [h.name, h.date]));
  assert.equal(names["Good Friday"], "2026-04-03");
  assert.equal(names["Easter Monday"], "2026-04-06");
  assert.equal(names["King's Birthday"], "2026-06-08");
});

test("Alex's balances as of 2026-11-25", () => {
  const b = leaveBalances({ employee: alex, requests: seed.leaveRequests, policy: seed.leavePolicy, asOf: "2026-11-25" });
  const annual = b.find((x) => x.leaveType === "annual");
  assert.equal(annual.taken, 5);
  assert.equal(annual.pending, 4);
  assert.equal(annual.available, 6.5 + 20 - 5 - 4);
});

test("working days for a full FY", () => {
  const r = workingDaysForFy({ employee: alex, requests: seed.leaveRequests, fyLabel: "2025-26", asOf: "2026-11-25" });
  assert.equal(r.partialYear, false);
  assert.equal(r.workingDays, r.weekdays - r.publicHolidays);
  assert.ok(r.weekdays > 250 && r.weekdays < 263);
});

test("validation blocks overlaps and over-balance", () => {
  const args = { employee: alex, requests: seed.leaveRequests, policy: seed.leavePolicy, asOf: "2026-11-25" };
  assert.throws(() => validateNewRequest({ ...args, leaveType: "annual", startDate: "2026-12-23", endDate: "2026-12-30" }), /overlap/);
  assert.throws(() => validateNewRequest({ ...args, leaveType: "annual", startDate: "2027-02-01", endDate: "2027-04-30" }), /Not enough/);
  const ok = validateNewRequest({ ...args, leaveType: "annual", startDate: "2027-02-01", endDate: "2027-02-05" });
  assert.equal(ok.days, 5);
});
