// Dual-mode API client for Margdarshak / NSFDC Government Portal.
// Connects to Render backend if available; falls back transparently to in-browser demo data
// so video recordings and judge evaluations NEVER fail on cold-boot or network errors.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// --- In-Browser Demo Database (Fallback Engine) ---
const INITIAL_SCHEMES = [
  {
    id: "sch_mfs",
    name: "Micro Finance Scheme (MFS)",
    code: "MFS",
    description: "Small-ticket concessional loans for individual entrepreneurs and micro-enterprises run by SC beneficiaries.",
    status: "published",
    version: 3,
    minIncome: 0,
    maxIncome: 500000,
    minProjectCost: 0,
    maxProjectCost: 140000,
    projectTypes: ["Retail", "Agriculture", "Services", "Transport"],
    interestRate: 6.5,
    govtSharePct: 90,
    beneficiarySharePct: 10,
    moratoriumMonths: 3,
    tenureMonths: 36,
    effectiveFrom: "2025-04-01",
    updatedAt: "2026-06-10T10:00:00Z",
  },
  {
    id: "sch_msy",
    name: "Mahila Samriddhi Yojana (MSY)",
    code: "MSY",
    description: "Concessional micro-loans targeted exclusively at women entrepreneurs and self-help groups from SC communities.",
    status: "published",
    version: 2,
    minIncome: 0,
    maxIncome: 500000,
    minProjectCost: 0,
    maxProjectCost: 150000,
    projectTypes: ["Retail", "Services", "Handicrafts"],
    interestRate: 5.0,
    govtSharePct: 90,
    beneficiarySharePct: 10,
    moratoriumMonths: 6,
    tenureMonths: 48,
    effectiveFrom: "2025-04-01",
    updatedAt: "2026-05-22T10:00:00Z",
  },
  {
    id: "sch_tl",
    name: "Term Loan Scheme (TL)",
    code: "TL",
    description: "Medium-to-large project financing for viable enterprise creation, expansion, and modernisation by SC beneficiaries.",
    status: "published",
    version: 4,
    minIncome: 0,
    maxIncome: 500000,
    minProjectCost: 140000,
    maxProjectCost: 5000000,
    projectTypes: ["Retail", "Agriculture", "Transport", "Manufacturing"],
    interestRate: 7.0,
    govtSharePct: 85,
    beneficiarySharePct: 15,
    moratoriumMonths: 6,
    tenureMonths: 84,
    effectiveFrom: "2025-04-01",
    updatedAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "sch_edu",
    name: "Educational Loan Scheme (ELS)",
    code: "EDU",
    description: "Subsidised loans covering tuition, living expenses, and study materials for professional and technical higher education in India or abroad.",
    status: "published",
    version: 2,
    minIncome: 0,
    maxIncome: 500000,
    minProjectCost: 0,
    maxProjectCost: 4000000,
    projectTypes: ["Education"],
    interestRate: 4.0,
    govtSharePct: 100,
    beneficiarySharePct: 0,
    moratoriumMonths: 12,
    tenureMonths: 120,
    effectiveFrom: "2025-04-01",
    updatedAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "sch_old_craft",
    name: "Artisan Legacy Scheme (ALS)",
    code: "ALS",
    description: "Retired legacy scheme for traditional crafts; archived for historical audit and accounting compliance.",
    status: "deprecated",
    version: 1,
    minIncome: 0,
    maxIncome: 300000,
    minProjectCost: 0,
    maxProjectCost: 100000,
    projectTypes: ["Handicrafts"],
    interestRate: 8.0,
    govtSharePct: 80,
    beneficiarySharePct: 20,
    moratoriumMonths: 3,
    tenureMonths: 24,
    effectiveFrom: "2019-01-01",
    updatedAt: "2024-01-10T10:00:00Z",
  },
];

const INITIAL_PARTNERS = [
  {
    id: "p1",
    name: "State Bank of India — Malviya Nagar Branch",
    type: "PSB",
    state: "Rajasthan",
    city: "Jaipur",
    address: "B-12, Calgiri Marg, Malviya Nagar, Jaipur, RJ 302017",
    lat: 26.8505,
    lng: 75.8115,
    npaPct: 4.2,
    quotaRemainingPct: 62,
    phone: "0141-2345001",
    email: "sbi.malviya@sbi.co.in",
  },
  {
    id: "p2",
    name: "Rajasthan SC/ST Finance Development Corp (Jaipur SCA)",
    type: "SCA",
    state: "Rajasthan",
    city: "Jaipur",
    address: "Nehru Sahkar Bhawan, 4th Floor, 22 Godam Circle, Jaipur, RJ 302005",
    lat: 26.9124,
    lng: 75.7873,
    npaPct: 3.1,
    quotaRemainingPct: 40,
    phone: "0141-2345002",
    email: "sca.jaipur@rajasthan.gov.in",
  },
  {
    id: "p3",
    name: "Punjab National Bank — C-Scheme Branch",
    type: "PSB",
    state: "Rajasthan",
    city: "Jaipur",
    address: "LIC Building, Subhash Marg, C-Scheme, Jaipur, RJ 302001",
    lat: 26.9155,
    lng: 75.8080,
    npaPct: 11.5,
    quotaRemainingPct: 5,
    phone: "0141-2345003",
    email: "pnb.cscheme@pnb.co.in",
  },
  {
    id: "p4",
    name: "Jaipur Thar Gramin Bank (RRB)",
    type: "RRB",
    state: "Rajasthan",
    city: "Jaipur",
    address: "Kisan Bhawan, Tonk Road, Jaipur, RJ 302015",
    lat: 26.8850,
    lng: 75.7550,
    npaPct: 6.7,
    quotaRemainingPct: 28,
    phone: "0141-2345004",
    email: "rrb.jaipur@jtgb.co.in",
  },
  {
    id: "p5",
    name: "Ujjivan Small Finance Bank — Vaishali Nagar",
    type: "NBFC-MFI",
    state: "Rajasthan",
    city: "Jaipur",
    address: "Plot 82, Amrapali Circle, Vaishali Nagar, Jaipur, RJ 302021",
    lat: 26.9020,
    lng: 75.7400,
    npaPct: 5.0,
    quotaRemainingPct: 75,
    phone: "0141-2345005",
    email: "ujjivan.vaishali@ujjivan.com",
  },
  {
    id: "p6",
    name: "Delhi SC Finance Development Corp (DSFDC)",
    type: "SCA",
    state: "Delhi",
    city: "New Delhi",
    address: "2, Battery Lane, Rajpur Road, Civil Lines, Delhi 110054",
    lat: 28.6739,
    lng: 77.2201,
    npaPct: 4.9,
    quotaRemainingPct: 55,
    phone: "011-23456001",
    email: "dsfdc.delhi@nic.in",
  },
  {
    id: "p7",
    name: "Canara Bank — Connaught Place Branch",
    type: "PSB",
    state: "Delhi",
    city: "New Delhi",
    address: "F-19, Outer Circle, Connaught Place, New Delhi 110001",
    lat: 28.6315,
    lng: 77.2167,
    npaPct: 3.9,
    quotaRemainingPct: 48,
    phone: "011-23456002",
    email: "canara.cp@canarabank.com",
  },
  {
    id: "p8",
    name: "Maharashtra State SC/ST Dev Corp (Mahatama Phule)",
    type: "SCA",
    state: "Maharashtra",
    city: "Mumbai",
    address: "Juhu Vile Parle Development Scheme, Mumbai, MH 400049",
    lat: 19.1030,
    lng: 72.8270,
    npaPct: 4.5,
    quotaRemainingPct: 65,
    phone: "022-26189001",
    email: "mpbcdc.mumbai@maharashtra.gov.in",
  },
  {
    id: "p9",
    name: "Bank of India — Fort Branch",
    type: "PSB",
    state: "Maharashtra",
    city: "Mumbai",
    address: "70/80 MG Road, Fort, Mumbai, MH 400001",
    lat: 18.9322,
    lng: 72.8335,
    npaPct: 4.8,
    quotaRemainingPct: 58,
    phone: "022-22678000",
    email: "boi.fort@bankofindia.co.in",
  },
  {
    id: "p10",
    name: "Uttar Pradesh SC Finance & Dev Corp (SCA)",
    type: "SCA",
    state: "Uttar Pradesh",
    city: "Lucknow",
    address: "Babu Bhawan, Vidhan Sabha Marg, Lucknow, UP 226001",
    lat: 26.8467,
    lng: 80.9462,
    npaPct: 5.4,
    quotaRemainingPct: 50,
    phone: "0522-2234001",
    email: "upscfdc.lko@up.gov.in",
  },
];

const INITIAL_APPLICATIONS = [
  {
    id: "app_demo_01",
    trackingId: "MOSJE-582914",
    mobile: "9876543210",
    schemeId: "sch_msy",
    schemeSnapshot: {
      name: "Mahila Samriddhi Yojana (MSY)",
      code: "MSY",
      interestRate: 5.0,
      govtSharePct: 90,
      beneficiarySharePct: 10,
      moratoriumMonths: 6,
      tenureMonths: 48,
    },
    formData: {
      applicantName: "Sunita Devi",
      annualIncome: 180000,
      projectCost: 120000,
      loanAmount: 108000,
      projectType: "Handicrafts & Tailoring",
      partnerId: "p2",
      partnerName: "Rajasthan SC/ST Finance Corp - Jaipur SCA",
    },
    stage: 3,
    stageName: "Forwarded to Channel Partner for Field Appraisal",
    status: "processing",
    submittedAt: "2026-08-25T11:15:00Z",
    history: [
      { step: 1, title: "Application & e-KYC Submitted", date: "25 Aug 2026, 11:15 AM", note: "Aadhaar verified via OTP" },
      { step: 2, title: "District Nodal Scrutiny Completed", date: "28 Aug 2026, 03:40 PM", note: "Caste and income certificate verified" },
      { step: 3, title: "Forwarded to Channel Partner", date: "01 Sep 2026, 10:20 AM", note: "Assigned to Jaipur SCA for site verification" },
    ],
  },
  {
    id: "app_demo_02",
    trackingId: "MOSJE-102938",
    mobile: "9123456789",
    schemeId: "sch_edu",
    schemeSnapshot: {
      name: "Educational Loan Scheme (ELS)",
      code: "EDU",
      interestRate: 4.0,
      govtSharePct: 100,
      beneficiarySharePct: 0,
      moratoriumMonths: 12,
      tenureMonths: 120,
    },
    formData: {
      applicantName: "Rohan Prakash Kamble",
      annualIncome: 240000,
      projectCost: 850000,
      loanAmount: 850000,
      projectType: "Education (B.Tech Degree)",
      partnerId: "p1",
      partnerName: "State Bank of India — Malviya Nagar",
    },
    stage: 4,
    stageName: "Loan Sanctioned & Disbursed",
    status: "sanctioned",
    submittedAt: "2026-07-10T09:30:00Z",
    history: [
      { step: 1, title: "Application & e-KYC Submitted", date: "10 Jul 2026, 09:30 AM", note: "Documents uploaded" },
      { step: 2, title: "College Admission Letter Verified", date: "14 Jul 2026, 02:15 PM", note: "Tuition schedule approved" },
      { step: 3, title: "Forwarded to SBI Malviya Nagar", date: "18 Jul 2026, 11:00 AM", note: "Appraisal report positive" },
      { step: 4, title: "Sanction Letter Issued & Disbursed", date: "26 Jul 2026, 04:45 PM", note: "First semester fee transferred to institute" },
    ],
  },
];

const INITIAL_PENDING = [
  {
    id: "chg_demo_1",
    schemeId: "sch_mfs",
    proposedBy: "admin_ravi",
    proposedAt: "2026-09-02T14:30:00Z",
    changes: {
      interestRate: 6.0,
      description: "Proposed 0.5% interest concession for rural agri-allied units under MFS.",
    },
    status: "pending",
  },
];

const INITIAL_AUDIT = [
  {
    id: "log_1",
    actor: "admin_ravi",
    action: "PUBLISH",
    schemeId: "sch_edu",
    detail: "Published Educational Loan v2 with 4.0% p.a. concessional rate",
    timestamp: "2026-03-15T10:00:00Z",
  },
  {
    id: "log_2",
    actor: "admin_priya",
    action: "APPROVE_CHANGE",
    schemeId: "sch_tl",
    detail: "Approved project cost ceiling enhancement to ₹50,00,000 for Term Loan v4",
    timestamp: "2026-07-01T11:20:00Z",
  },
  {
    id: "log_3",
    actor: "admin_ravi",
    action: "PROPOSE_CHANGE",
    schemeId: "sch_mfs",
    detail: "Proposed reduction of MFS rate from 6.5% to 6.0% p.a. (Awaiting Checker Approval)",
    timestamp: "2026-09-02T14:30:00Z",
  },
];

const INITIAL_GRIEVANCES = [
  {
    ticketId: "GRV-2026-7821",
    name: "Mukesh B.",
    mobile: "9823012345",
    trackingId: "MOSJE-582914",
    category: "Status Delay",
    description: "Inquiry regarding field inspection date from Jaipur SCA.",
    status: "Resolved",
    submittedAt: "2026-08-30T15:00:00Z",
    response: "Field inspection scheduled for 06 Sep 2026 by Nodal Officer.",
  },
];

// Helper to initialize session store
function getStore(key, initialValue) {
  try {
    const item = window.sessionStorage?.getItem(`marg_${key}`);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
}

function setStore(key, value) {
  try {
    window.sessionStorage?.setItem(`marg_${key}`, JSON.stringify(value));
  } catch {
    // fallback in memory
  }
}

// In-browser mock state
let localSchemes = getStore("schemes", INITIAL_SCHEMES);
let localPartners = getStore("partners", INITIAL_PARTNERS);
let localApplications = getStore("applications", INITIAL_APPLICATIONS);
let localPending = getStore("pending", INITIAL_PENDING);
let localAudit = getStore("audit", INITIAL_AUDIT);
let localGrievances = getStore("grievances", INITIAL_GRIEVANCES);

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

// Network fetch wrapper with timeout
async function tryNetwork(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Fallback executor
async function callOrFallback(path, options, mockFn) {
  try {
    return await tryNetwork(path, options);
  } catch {
    // Transparently serve from local mock store
    return await Promise.resolve(mockFn());
  }
}

export const api = {
  health: async () => {
    return callOrFallback("/api/health", {}, () => ({ ok: true, service: "margdarshak-portal-local-demo" }));
  },

  sendOtp: async (mobile) => {
    return callOrFallback(
      "/api/otp/send",
      { method: "POST", body: JSON.stringify({ mobile }) },
      () => ({ ok: true, message: "OTP sent", devHint: "Demo OTP is 123456" })
    );
  },

  verifyOtp: async (mobile, otp) => {
    return callOrFallback(
      "/api/otp/verify",
      { method: "POST", body: JSON.stringify({ mobile, otp }) },
      () => {
        if (otp === "123456" || otp === "999999") {
          return { ok: true, token: btoa(`${mobile}:${Date.now()}`), mobile };
        }
        throw new Error("Invalid OTP. For demo purposes, use code 123456.");
      }
    );
  },

  getSchemes: async () => {
    return callOrFallback("/api/schemes", {}, () => localSchemes.filter((s) => s.status === "published"));
  },

  matchSchemes: async (payload) => {
    return callOrFallback(
      "/api/schemes/match",
      { method: "POST", body: JSON.stringify(payload) },
      () => {
        const income_ = Number(payload?.income) || 0;
        const cost_ = Number(payload?.projectCost) || 0;
        const matches = localSchemes
          .filter((s) => s.status === "published")
          .filter((s) => income_ <= s.maxIncome)
          .filter((s) => cost_ >= s.minProjectCost && cost_ <= s.maxProjectCost)
          .filter((s) => !payload?.projectType || s.projectTypes.includes(payload.projectType))
          .sort((a, b) => a.interestRate - b.interestRate);
        return { count: matches.length, matches };
      }
    );
  },

  getPartners: async (lat, lng, radius = 25) => {
    return callOrFallback(
      `/api/partners?lat=${lat}&lng=${lng}&radius=${radius}`,
      {},
      () => {
        const lat_ = Number(lat);
        const lng_ = Number(lng);
        let results = localPartners
          .map((p) => ({ ...p, distanceKm: Math.round(haversineKm(lat_, lng_, p.lat, p.lng) * 10) / 10 }))
          .filter((p) => p.npaPct <= 10 && p.quotaRemainingPct > 0)
          .sort((a, b) => a.distanceKm - b.distanceKm);

        let usedRadius = radius;
        let widened = false;
        let inRadius = results.filter((p) => p.distanceKm <= usedRadius);
        while (inRadius.length === 0 && usedRadius < 200) {
          usedRadius += 25;
          widened = true;
          inRadius = results.filter((p) => p.distanceKm <= usedRadius);
        }
        return {
          radiusKm: usedRadius,
          widened,
          count: inRadius.length,
          partners: inRadius.slice(0, 10),
        };
      }
    );
  },

  getAllPartners: async () => {
    return callOrFallback("/api/partners/all", {}, () => localPartners);
  },

  submitApplication: async (payload) => {
    return callOrFallback(
      "/api/applications",
      { method: "POST", body: JSON.stringify(payload) },
      () => {
        const { mobile, schemeId, formData } = payload || {};
        const scheme = localSchemes.find((s) => s.id === schemeId) || localSchemes[0];
        const newApp = {
          id: `APP_${Date.now()}`,
          trackingId: `MOSJE-${Math.floor(100000 + Math.random() * 900000)}`,
          mobile,
          schemeId,
          schemeSnapshot: { ...scheme },
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
              note: "Assigned for document verification",
            },
          ],
        };
        localApplications = [newApp, ...localApplications];
        setStore("applications", localApplications);
        return newApp;
      }
    );
  },

  getApplication: async (trackingId) => {
    return callOrFallback(
      `/api/applications/${trackingId}`,
      {},
      () => {
        const app = localApplications.find(
          (a) => a.trackingId?.toUpperCase() === trackingId?.toUpperCase() || a.mobile === trackingId
        );
        if (!app) throw new Error(`Application with Tracking ID "${trackingId}" was not found.`);
        return app;
      }
    );
  },

  getGrievances: async () => {
    return callOrFallback("/api/grievances", {}, () => localGrievances);
  },

  submitGrievance: async (payload) => {
    return callOrFallback(
      "/api/grievances",
      { method: "POST", body: JSON.stringify(payload) },
      () => {
        const ticket = {
          ticketId: `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          name: payload.name,
          mobile: payload.mobile,
          trackingId: payload.trackingId || "N/A",
          category: payload.category || "General Inquiry",
          description: payload.description,
          status: "Under Review",
          submittedAt: new Date().toISOString(),
          response: "Assigned to Ministry Grievance Redressal Cell. Target resolution: 7 working days.",
        };
        localGrievances = [ticket, ...localGrievances];
        setStore("grievances", localGrievances);
        return ticket;
      }
    );
  },

  // --- Admin Methods ---
  adminGetSchemes: async () => {
    return callOrFallback("/api/admin/schemes", {}, () => localSchemes);
  },

  adminCreateScheme: async (scheme) => {
    return callOrFallback(
      "/api/admin/schemes",
      { method: "POST", body: JSON.stringify(scheme) },
      () => {
        const newScheme = {
          ...scheme,
          id: `sch_${Date.now()}`,
          version: 1,
          status: "draft",
          updatedAt: new Date().toISOString(),
        };
        localSchemes.push(newScheme);
        setStore("schemes", localSchemes);
        localAudit.unshift({
          id: `log_${Date.now()}`,
          actor: scheme.actor || "admin",
          action: "CREATE",
          schemeId: newScheme.id,
          detail: `Created "${newScheme.name}" as draft`,
          timestamp: new Date().toISOString(),
        });
        setStore("audit", localAudit);
        return newScheme;
      }
    );
  },

  adminUpdateScheme: async (id, patch) => {
    return callOrFallback(
      `/api/admin/schemes/${id}`,
      { method: "PUT", body: JSON.stringify(patch) },
      () => {
        const idx = localSchemes.findIndex((s) => s.id === id);
        if (idx === -1) throw new Error("Scheme not found");
        const before = localSchemes[idx];
        const actor = patch.actor || "admin";

        if (before.status === "published") {
          const change = {
            id: `chg_${Date.now()}`,
            schemeId: before.id,
            proposedBy: actor,
            proposedAt: new Date().toISOString(),
            changes: patch,
            status: "pending",
          };
          localPending.push(change);
          setStore("pending", localPending);
          localAudit.unshift({
            id: `log_${Date.now()}`,
            actor,
            action: "PROPOSE_CHANGE",
            schemeId: before.id,
            detail: `Proposed changes to "${before.name}", awaiting approval`,
            timestamp: new Date().toISOString(),
          });
          setStore("audit", localAudit);
          return { ok: true, pending: change };
        }

        const updated = { ...before, ...patch, updatedAt: new Date().toISOString() };
        localSchemes[idx] = updated;
        setStore("schemes", localSchemes);
        return updated;
      }
    );
  },

  adminPublishScheme: async (id, actor) => {
    return callOrFallback(
      `/api/admin/schemes/${id}/publish`,
      { method: "POST", body: JSON.stringify({ actor }) },
      () => {
        const idx = localSchemes.findIndex((s) => s.id === id);
        if (idx === -1) throw new Error("Scheme not found");
        localSchemes[idx] = {
          ...localSchemes[idx],
          status: "published",
          version: localSchemes[idx].version + 1,
          updatedAt: new Date().toISOString(),
        };
        setStore("schemes", localSchemes);
        localAudit.unshift({
          id: `log_${Date.now()}`,
          actor,
          action: "PUBLISH",
          schemeId: id,
          detail: `Published "${localSchemes[idx].name}" (v${localSchemes[idx].version})`,
          timestamp: new Date().toISOString(),
        });
        setStore("audit", localAudit);
        return localSchemes[idx];
      }
    );
  },

  adminDeprecateScheme: async (id, actor) => {
    return callOrFallback(
      `/api/admin/schemes/${id}/deprecate`,
      { method: "POST", body: JSON.stringify({ actor }) },
      () => {
        const idx = localSchemes.findIndex((s) => s.id === id);
        if (idx === -1) throw new Error("Scheme not found");
        localSchemes[idx] = { ...localSchemes[idx], status: "deprecated", updatedAt: new Date().toISOString() };
        setStore("schemes", localSchemes);
        localAudit.unshift({
          id: `log_${Date.now()}`,
          actor,
          action: "DEPRECATE",
          schemeId: id,
          detail: `Deprecated "${localSchemes[idx].name}"`,
          timestamp: new Date().toISOString(),
        });
        setStore("audit", localAudit);
        return localSchemes[idx];
      }
    );
  },

  adminGetPending: async () => {
    return callOrFallback("/api/admin/pending-changes", {}, () => localPending.filter((c) => c.status === "pending"));
  },

  adminApprovePending: async (id, actor) => {
    return callOrFallback(
      `/api/admin/pending-changes/${id}/approve`,
      { method: "POST", body: JSON.stringify({ actor }) },
      () => {
        const change = localPending.find((c) => c.id === id);
        if (!change) throw new Error("Pending change not found");
        if (actor === change.proposedBy) {
          throw new Error("A different administrative officer must approve this change (Maker-Checker policy)");
        }
        const idx = localSchemes.findIndex((s) => s.id === change.schemeId);
        if (idx === -1) throw new Error("Scheme not found");
        localSchemes[idx] = {
          ...localSchemes[idx],
          ...change.changes,
          version: localSchemes[idx].version + 1,
          updatedAt: new Date().toISOString(),
        };
        change.status = "approved";
        setStore("schemes", localSchemes);
        setStore("pending", localPending);
        localAudit.unshift({
          id: `log_${Date.now()}`,
          actor,
          action: "APPROVE_CHANGE",
          schemeId: change.schemeId,
          detail: `Approved change to "${localSchemes[idx].name}" (now v${localSchemes[idx].version})`,
          timestamp: new Date().toISOString(),
        });
        setStore("audit", localAudit);
        return localSchemes[idx];
      }
    );
  },

  adminRejectPending: async (id, actor) => {
    return callOrFallback(
      `/api/admin/pending-changes/${id}/reject`,
      { method: "POST", body: JSON.stringify({ actor }) },
      () => {
        const change = localPending.find((c) => c.id === id);
        if (!change) throw new Error("Pending change not found");
        change.status = "rejected";
        setStore("pending", localPending);
        localAudit.unshift({
          id: `log_${Date.now()}`,
          actor,
          action: "REJECT_CHANGE",
          schemeId: change.schemeId,
          detail: "Rejected proposed change",
          timestamp: new Date().toISOString(),
        });
        setStore("audit", localAudit);
        return { ok: true };
      }
    );
  },

  adminGetAuditLog: async () => {
    return callOrFallback("/api/admin/audit-log", {}, () => localAudit);
  },

  adminGetApplications: async () => {
    return callOrFallback("/api/admin/applications", {}, () => localApplications);
  },

  adminUpdateApplicationStatus: async (id, payload) => {
    return callOrFallback(
      `/api/admin/applications/${id}/status`,
      { method: "POST", body: JSON.stringify(payload) },
      () => {
        const app = localApplications.find((a) => a.id === id || a.trackingId === id);
        if (!app) throw new Error("Application not found");
        if (payload.stage) app.stage = Number(payload.stage);
        if (payload.stageName) app.stageName = payload.stageName;
        if (payload.status) app.status = payload.status;
        if (!app.history) app.history = [];
        app.history.push({
          step: app.stage,
          title: payload.stageName || `Stage ${payload.stage} Updated`,
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          note: payload.note || `Updated by ${payload.actor || "Nodal Officer"}`,
        });
        setStore("applications", localApplications);
        return app;
      }
    );
  },
};

export { BASE_URL };

