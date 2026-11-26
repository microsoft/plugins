// Pure business logic for Fabrikam leave - no I/O, no MCP. Easy to unit test.
// Dates are handled as ISO "YYYY-MM-DD" strings in UTC to avoid timezone drift.

export const LEAVE_TYPES = ["annual", "personal"];

const DAY_MS = 24 * 60 * 60 * 1000;

export function parseDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso ?? "")) throw new Error(`Invalid date "${iso}". Use YYYY-MM-DD.`);
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso) throw new Error(`Invalid date "${iso}".`);
  return d;
}

export const toIso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * DAY_MS);

export function todayIso() {
  return process.env.TODAY || new Date().toISOString().slice(0, 10);
}

// ---------- Public holidays (illustrative national Australian set; swap for your payroll calendar) ----------
function easterSunday(year) {
  // Anonymous Gregorian algorithm
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function nthWeekdayOfMonth(year, monthIndex, weekday, n) {
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(year, monthIndex, 1 + offset + (n - 1) * 7));
}

export function publicHolidays(year) {
  const easter = easterSunday(year);
  const list = [
    [`${year}-01-01`, "New Year's Day"],
    [`${year}-01-26`, "Australia Day"],
    [toIso(addDays(easter, -2)), "Good Friday"],
    [toIso(addDays(easter, 1)), "Easter Monday"],
    [`${year}-04-25`, "Anzac Day"],
    [toIso(nthWeekdayOfMonth(year, 5, 1, 2)), "King's Birthday"],
    [`${year}-12-25`, "Christmas Day"],
    [`${year}-12-26`, "Boxing Day"]
  ];
  return list.map(([date, name]) => ({ date, name }));
}

const holidayCache = new Map();
function holidaySet(year) {
  if (!holidayCache.has(year)) holidayCache.set(year, new Set(publicHolidays(year).map((h) => h.date)));
  return holidayCache.get(year);
}

export function isWeekend(d) {
  const day = d.getUTCDay();
  return day === 0 || day === 6;
}
export function isPublicHoliday(d) {
  return holidaySet(d.getUTCFullYear()).has(toIso(d));
}

/** Business days (Mon-Fri, excluding public holidays) between two ISO dates, inclusive. */
export function businessDaysBetween(startIso, endIso) {
  const start = parseDate(startIso), end = parseDate(endIso);
  if (end < start) return 0;
  let count = 0;
  for (let d = start; d <= end; d = addDays(d, 1)) {
    if (!isWeekend(d) && !isPublicHoliday(d)) count++;
  }
  return count;
}

// ---------- Australian financial year (1 July - 30 June) ----------
/** "2025-26" -> { label, start: "2025-07-01", end: "2026-06-30" } */
export function fyRange(label) {
  const m = /^(\d{4})-(\d{2})$/.exec(label ?? "");
  if (!m) throw new Error(`Invalid financial year "${label}". Use the form 2025-26.`);
  const startYear = Number(m[1]);
  if ((startYear + 1) % 100 !== Number(m[2])) throw new Error(`Invalid financial year "${label}".`);
  return { label, start: `${startYear}-07-01`, end: `${startYear + 1}-06-30` };
}

export function fyForDate(iso) {
  const d = parseDate(iso);
  const y = d.getUTCMonth() >= 6 ? d.getUTCFullYear() : d.getUTCFullYear() - 1;
  return `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
}

const maxIso = (a, b) => (a > b ? a : b);
const minIso = (a, b) => (a < b ? a : b);

/** Business days of a leave request that fall inside [fromIso, toIso]. */
export function overlapBusinessDays(req, fromIso, toIsoDate) {
  const s = maxIso(req.startDate, fromIso), e = minIso(req.endDate, toIsoDate);
  return s > e ? 0 : businessDaysBetween(s, e);
}

// ---------- Balances ----------
export function leaveBalances({ employee, requests, policy, asOf = todayIso() }) {
  const fy = fyRange(fyForDate(asOf));
  const mine = requests.filter((r) => r.employeeId === employee.id);
  return LEAVE_TYPES.map((type) => {
    const entitlement = policy[type].entitlementDaysPerYear;
    const opening = employee.openingBalance?.[type] ?? 0;
    const ofType = mine.filter((r) => r.leaveType === type);
    const taken = ofType.filter((r) => r.status === "approved")
      .reduce((n, r) => n + overlapBusinessDays(r, fy.start, fy.end), 0);
    const pending = ofType.filter((r) => r.status === "pending")
      .reduce((n, r) => n + businessDaysBetween(r.startDate, r.endDate), 0);
    return {
      leaveType: type,
      label: policy[type].label,
      financialYear: fy.label,
      openingBalance: opening,
      entitlementThisYear: entitlement,
      taken,
      pending,
      available: Math.round((opening + entitlement - taken - pending) * 10) / 10
    };
  });
}

// ---------- Working days for tax time ----------
export function workingDaysForFy({ employee, requests, fyLabel, asOf = todayIso() }) {
  const fy = fyRange(fyLabel);
  const periodStart = maxIso(fy.start, employee.startDate);
  const periodEnd = minIso(fy.end, asOf);
  const partial = periodEnd < fy.end;
  if (periodStart > periodEnd) {
    return { financialYear: fy.label, periodStart, periodEnd, partialYear: partial, weekdays: 0, publicHolidays: 0, leaveDays: { annual: 0, personal: 0 }, workingDays: 0, note: "No employment days in this period." };
  }
  let weekdays = 0, holidays = 0;
  for (let d = parseDate(periodStart); d <= parseDate(periodEnd); d = addDays(d, 1)) {
    if (isWeekend(d)) continue;
    weekdays++;
    if (isPublicHoliday(d)) holidays++;
  }
  const leaveDays = { annual: 0, personal: 0 };
  for (const r of requests) {
    if (r.employeeId !== employee.id || r.status !== "approved") continue;
    leaveDays[r.leaveType] += overlapBusinessDays(r, periodStart, periodEnd);
  }
  const workingDays = weekdays - holidays - leaveDays.annual - leaveDays.personal;
  return {
    financialYear: fy.label,
    periodStart,
    periodEnd,
    partialYear: partial,
    weekdays,
    publicHolidays: holidays,
    leaveDays,
    workingDays,
    note: "Working days = weekdays - public holidays - approved leave. Illustrative only; confirm with your payslips before lodging a tax return."
  };
}

// ---------- Validation for new requests ----------
export function validateNewRequest({ employee, requests, policy, leaveType, startDate, endDate, asOf = todayIso() }) {
  if (!LEAVE_TYPES.includes(leaveType)) throw new Error(`Leave type must be one of: ${LEAVE_TYPES.join(", ")}.`);
  parseDate(startDate); parseDate(endDate);
  if (endDate < startDate) throw new Error("End date must be on or after the start date.");
  if (leaveType === "annual" && startDate < asOf) throw new Error("Annual leave cannot start in the past.");
  const days = businessDaysBetween(startDate, endDate);
  if (days === 0) throw new Error("The selected dates contain no working days.");
  const overlap = requests.find((r) => r.employeeId === employee.id && ["pending", "approved"].includes(r.status)
    && !(r.endDate < startDate || r.startDate > endDate));
  if (overlap) throw new Error(`These dates overlap with request ${overlap.id} (${overlap.startDate} to ${overlap.endDate}).`);
  const balance = leaveBalances({ employee, requests, policy, asOf }).find((b) => b.leaveType === leaveType);
  if (days > balance.available) throw new Error(`Not enough ${balance.label.toLowerCase()}: requested ${days} day(s), ${balance.available} available.`);
  return { days, balanceAfter: Math.round((balance.available - days) * 10) / 10 };
}
