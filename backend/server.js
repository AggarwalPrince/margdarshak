import express from "express";
import cors from "cors";
import {
  schemes,
  pendingChanges,
  auditLog,
  partners,
  otpStore,
  applications,
  grievances,
} from "./data.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ---------- helpers ----------
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function newId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function logAction(actor, action, schemeId, detail) {
  auditLog.unshift({
    id: newId("log"),
    actor,
    action,
    schemeId,
    detail,
    timestamp: new Date().toISOString(),
  });
}

// ---------- health ----------
app.get("/api/health", (req, res) => res.json({ ok: true, service: "mosje-demo-backend" }));

// ---------- OTP (mock) ----------
app.post("/api/otp/send", (req, res) => {
  const { mobile } = req.body || {};
  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number" });
  }
  const otp = "123456"; // fixed for demo purposes so judges don't need an SMS gateway
  otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  res.json({ ok: true, message: "OTP sent", devHint: "Demo OTP is 123456" });
});

app.post("/api/otp/verify", (req, res) => {
  const { mobile, otp } = req.body || {};
  const record = otpStore.get(mobile);
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }
  const token = Buffer.from(`${mobile}:${Date.now()}`).toString("base64");
  res.json({ ok: true, token, mobile });
});

// ---------- Schemes (public: published only) ----------
app.get("/api/schemes", (req, res) => {
  res.json(schemes.filter((s) => s.status === "published"));
});

// Simple rule-based matcher against sample scheme data (stand-in for the
// FastAPI decision engine).
app.post("/api/schemes/match", (req, res) => {
  const { income, projectCost, projectType } = req.body || {};
  const income_ = Number(income) || 0;
  const cost_ = Number(projectCost) || 0;

  const matches = schemes
    .filter((s) => s.status === "published")
    .filter((s) => income_ <= s.maxIncome)
    .filter((s) => cost_ >= s.minProjectCost && cost_ <= s.maxProjectCost)
    .filter((s) => !projectType || s.projectTypes.includes(projectType))
    .sort((a, b) => a.interestRate - b.interestRate);

  res.json({ count: matches.length, matches });
});

// ---------- Admin: schemes (all statuses) ----------
app.get("/api/admin/schemes", (req, res) => {
  res.json(schemes);
});

app.post("/api/admin/schemes", (req, res) => {
  const body = req.body || {};
  const scheme = {
    id: newId("sch"),
    version: 1,
    status: "draft",
    updatedAt: new Date().toISOString(),
    ...body,
  };
  schemes.push(scheme);
  logAction(body.actor || "admin", "CREATE", scheme.id, `Created "${scheme.name}" as draft`);
  res.status(201).json(scheme);
});

// Direct update (used for draft schemes, which don't need approval)
app.put("/api/admin/schemes/:id", (req, res) => {
  const idx = schemes.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Scheme not found" });

  const before = schemes[idx];
  const actor = req.body.actor || "admin";

  if (before.status === "published") {
    // Published schemes go through maker-checker: stage the change instead
    // of applying it immediately, and bump the version only on approval.
    const change = {
      id: newId("chg"),
      schemeId: before.id,
      proposedBy: actor,
      proposedAt: new Date().toISOString(),
      changes: req.body,
      status: "pending",
    };
    pendingChanges.push(change);
    logAction(actor, "PROPOSE_CHANGE", before.id, `Proposed changes to "${before.name}", awaiting approval`);
    return res.status(202).json({ ok: true, pending: change });
  }

  const updated = { ...before, ...req.body, updatedAt: new Date().toISOString() };
  schemes[idx] = updated;
  logAction(actor, "UPDATE", before.id, `Updated draft "${before.name}"`);
  res.json(updated);
});

app.post("/api/admin/schemes/:id/publish", (req, res) => {
  const idx = schemes.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Scheme not found" });
  const actor = req.body?.actor || "admin";
  schemes[idx] = {
    ...schemes[idx],
    status: "published",
    version: schemes[idx].version + (schemes[idx].status === "draft" ? 0 : 1),
    updatedAt: new Date().toISOString(),
  };
  logAction(actor, "PUBLISH", schemes[idx].id, `Published "${schemes[idx].name}" (v${schemes[idx].version})`);
  res.json(schemes[idx]);
});

app.post("/api/admin/schemes/:id/deprecate", (req, res) => {
  const idx = schemes.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Scheme not found" });
  const actor = req.body?.actor || "admin";
  schemes[idx] = { ...schemes[idx], status: "deprecated", updatedAt: new Date().toISOString() };
  logAction(actor, "DEPRECATE", schemes[idx].id, `Deprecated "${schemes[idx].name}"`);
  res.json(schemes[idx]);
});

// Maker-checker: list & approve/reject pending changes
app.get("/api/admin/pending-changes", (req, res) => {
  res.json(pendingChanges.filter((c) => c.status === "pending"));
});

app.post("/api/admin/pending-changes/:id/approve", (req, res) => {
  const change = pendingChanges.find((c) => c.id === req.params.id);
  if (!change) return res.status(404).json({ error: "Pending change not found" });
  const approver = req.body?.actor || "admin_checker";
  if (approver === change.proposedBy) {
    return res.status(400).json({ error: "A different admin must approve this change" });
  }
  const idx = schemes.findIndex((s) => s.id === change.schemeId);
  if (idx === -1) return res.status(404).json({ error: "Scheme not found" });

  const before = schemes[idx];
  schemes[idx] = {
    ...before,
    ...change.changes,
    version: before.version + 1,
    updatedAt: new Date().toISOString(),
  };
  change.status = "approved";
  logAction(approver, "APPROVE_CHANGE", before.id, `Approved change to "${before.name}" (now v${schemes[idx].version})`);
  res.json(schemes[idx]);
});

app.post("/api/admin/pending-changes/:id/reject", (req, res) => {
  const change = pendingChanges.find((c) => c.id === req.params.id);
  if (!change) return res.status(404).json({ error: "Pending change not found" });
  const approver = req.body?.actor || "admin_checker";
  change.status = "rejected";
  logAction(approver, "REJECT_CHANGE", change.schemeId, `Rejected proposed change`);
  res.json({ ok: true });
});

app.get("/api/admin/audit-log", (req, res) => {
  res.json(auditLog);
});

// ---------- Partners Directory (all) ----------
app.get("/api/partners/all", (req, res) => {
  res.json(partners);
});

// ---------- Partners (geo, list-based — no map tiles) ----------
app.get("/api/partners", (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = Number(req.query.radius) || 25;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: "lat and lng query params are required" });
  }

  let results = partners
    .map((p) => ({ ...p, distanceKm: Math.round(haversineKm(lat, lng, p.lat, p.lng) * 10) / 10 }))
    .filter((p) => p.npaPct <= 10 && p.quotaRemainingPct > 0) // health filter
    .sort((a, b) => a.distanceKm - b.distanceKm);

  let usedRadius = radiusKm;
  let widened = false;
  let inRadius = results.filter((p) => p.distanceKm <= usedRadius);

  // Progressive widen if nothing found nearby, rather than a dead end.
  while (inRadius.length === 0 && usedRadius < 200) {
    usedRadius += 25;
    widened = true;
    inRadius = results.filter((p) => p.distanceKm <= usedRadius);
  }

  res.json({
    radiusKm: usedRadius,
    widened,
    count: inRadius.length,
    partners: inRadius.slice(0, 10),
  });
});

// ---------- Applications ----------
app.get("/api/admin/applications", (req, res) => {
  res.json(applications);
});

app.post("/api/admin/applications/:id/status", (req, res) => {
  const app_ = applications.find((a) => a.id === req.params.id || a.trackingId === req.params.id);
  if (!app_) return res.status(404).json({ error: "Application not found" });
  const { stage, stageName, status, note, actor } = req.body || {};
  if (stage) app_.stage = Number(stage);
  if (stageName) app_.stageName = stageName;
  if (status) app_.status = status;
  if (!app_.history) app_.history = [];
  app_.history.push({
    step: app_.stage,
    title: stageName || `Stage ${stage} Updated`,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    note: note || `Updated by ${actor || "Nodal Officer"}`,
  });
  logAction(actor || "admin", "UPDATE_APPLICATION", app_.id, `Updated ${app_.trackingId} to ${app_.stageName}`);
  res.json(app_);
});

app.post("/api/applications", (req, res) => {
  const { mobile, schemeId, formData } = req.body || {};
  const scheme = schemes.find((s) => s.id === schemeId);
  if (!scheme) return res.status(404).json({ error: "Scheme not found" });

  const application = {
    id: newId("APP"),
    trackingId: `MOSJE-${Math.floor(100000 + Math.random() * 900000)}`,
    mobile,
    schemeId,
    schemeSnapshot: { ...scheme }, // frozen terms at submission time
    formData: formData || {},
    stage: 1,
    stageName: "Application & e-KYC Submitted",
    status: "submitted",
    submittedAt: new Date().toISOString(),
    history: [
      {
        step: 1,
        title: "Application & e-KYC Submitted",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        note: "Aadhaar e-KYC verified via OTP",
      },
      {
        step: 2,
        title: "Awaiting Scrutiny by District Nodal Officer",
        date: "Pending Verification",
        note: "Assigned for document scrutiny",
      },
    ],
  };
  applications.unshift(application);
  logAction("citizen", "SUBMIT_APPLICATION", application.id, `New application submitted: ${application.trackingId}`);
  res.status(201).json(application);
});

app.get("/api/applications/:trackingId", (req, res) => {
  const app_ = applications.find(
    (a) => a.trackingId?.toUpperCase() === req.params.trackingId?.toUpperCase() || a.mobile === req.params.trackingId
  );
  if (!app_) return res.status(404).json({ error: "Application tracking ID not found" });
  res.json(app_);
});

// ---------- Grievances ----------
app.get("/api/grievances", (req, res) => {
  res.json(grievances);
});

app.post("/api/grievances", (req, res) => {
  const { name, mobile, trackingId, category, description } = req.body || {};
  if (!name || !mobile || !description) {
    return res.status(400).json({ error: "Name, mobile, and grievance description are required" });
  }
  const ticket = {
    ticketId: `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    mobile,
    trackingId: trackingId || "N/A",
    category: category || "General Inquiry",
    description,
    status: "Under Review",
    submittedAt: new Date().toISOString(),
    response: "Assigned to Ministry Grievance Redressal Cell. Resolution target: 7 working days.",
  };
  grievances.unshift(ticket);
  res.status(201).json(ticket);
});

app.listen(PORT, () => {
  console.log(`MoSJE / MARG demo backend running on port ${PORT}`);
});
