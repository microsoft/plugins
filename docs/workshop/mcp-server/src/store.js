// Tiny JSON-file data store. Good enough for a workshop; swap for a real HR system later.
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SEED = join(root, "data", "seed.json");
const DB = join(root, "data", "db.json");
const ACCOUNT_ENVS = { E1001: "EMPLOYEE_UPN", E1002: "SECOND_EMPLOYEE_UPN", M2001: "MANAGER_UPN" };

export function resetDb() {
  mkdirSync(dirname(DB), { recursive: true });
  copyFileSync(SEED, DB);
}

function load() {
  if (!existsSync(DB)) resetDb();
  const db = JSON.parse(readFileSync(DB, "utf8"));
  // Resolve each fictional employee's sign-in name from .env so the demo maps to real tenant accounts.
  for (const e of db.employees) {
    // Also migrate existing workshop databases without resetting leave requests.
    e.upnEnv = ACCOUNT_ENVS[e.id] || e.upnEnv;
    e.upn = (process.env[e.upnEnv] || `${e.id}@demo.local`).trim().toLowerCase();
  }
  return db;
}

function save(db) {
  const copy = structuredClone(db);
  for (const e of copy.employees) delete e.upn;
  writeFileSync(DB, JSON.stringify(copy, null, 2));
}

export const store = {
  snapshot: () => load(),
  policy: () => load().leavePolicy,
  employees: () => load().employees,
  findEmployee(idOrUpn) {
    const key = String(idOrUpn ?? "").toLowerCase();
    return load().employees.find((e) => e.id.toLowerCase() === key || e.upn === key);
  },
  requests: () => load().leaveRequests,
  addRequest(req) {
    const db = load();
    const next = Math.max(1000, ...db.leaveRequests.map((r) => Number(r.id.split("-")[1]) || 0)) + 1;
    const created = { id: `LR-${next}`, createdAt: new Date().toISOString(), ...req };
    db.leaveRequests.push(created);
    save(db);
    return created;
  },
  updateRequest(id, patch) {
    const db = load();
    const r = db.leaveRequests.find((x) => x.id === id);
    if (!r) return undefined;
    Object.assign(r, patch);
    save(db);
    return r;
  },
  deleteRequest(id) {
    const db = load();
    const i = db.leaveRequests.findIndex((x) => x.id === id);
    if (i < 0) return undefined;
    const [removed] = db.leaveRequests.splice(i, 1);
    save(db);
    return removed;
  }
};
