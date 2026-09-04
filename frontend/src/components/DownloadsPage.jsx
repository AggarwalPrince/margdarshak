import { useState } from "react";

const DOWNLOADABLE_DOCUMENTS = [
  {
    id: "doc_1",
    title: "Common Loan Application Form (Form 1A)",
    category: "Prescribed Forms",
    code: "NSFDC-CLAF-2026",
    format: "PDF",
    size: "480 KB",
    date: "15 Apr 2026",
    desc: "Standard bilingual application format required for Micro Finance Scheme (MFS) and Term Loan Scheme (TL).",
  },
  {
    id: "doc_2",
    title: "Income & Caste Undertaking Declaration (Form 2B)",
    category: "Affidavits & Declarations",
    code: "MOSJE-AFF-2B",
    format: "PDF",
    size: "260 KB",
    date: "10 Mar 2026",
    desc: "Self-declaration format for annual family income below ₹5,00,000 and Scheduled Caste certificate verification.",
  },
  {
    id: "doc_3",
    title: "Project Feasibility & Machinery Quotation Template",
    category: "Technical Templates",
    code: "NSFDC-TECH-PR03",
    format: "PDF",
    size: "340 KB",
    date: "20 May 2026",
    desc: "Standard format for submitting itemised project cost and equipment quotations above ₹1,40,000.",
  },
  {
    id: "doc_4",
    title: "Operational Guidelines for Concessional Lending FY 2026–27",
    category: "Policy & Guidelines",
    code: "GOI-MOSJE-GL-26",
    format: "PDF",
    size: "1.2 MB",
    date: "01 Jul 2026",
    desc: "Official Ministry circular governing interest subventions, channel partner empanelment criteria, and NPA ceilings.",
  },
  {
    id: "doc_5",
    title: "Mandatory Document Checklist for Beneficiaries",
    category: "Information Guides",
    code: "MD-CKL-01",
    format: "PDF",
    size: "190 KB",
    date: "01 Sep 2026",
    desc: "Citizen reference checklist: Aadhaar, PAN (if applicable), Bank passbook, Caste certificate, and Land/Shop lease.",
  },
  {
    id: "doc_6",
    title: "Grievance Redressal Form (CPGRAMS-Linked)",
    category: "Citizen Rights",
    code: "GRV-FORM-V1",
    format: "PDF",
    size: "210 KB",
    date: "18 Jun 2026",
    desc: "Physical format for submitting grievances regarding delay in appraisal or branch rejection without stated grounds.",
  },
];

export default function DownloadsPage() {
  const [downloadingId, setDownloadingId] = useState(null);
  const [filter, setFilter] = useState("ALL");

  function triggerDownload(doc) {
    setDownloadingId(doc.id);
    setTimeout(() => {
      // Generate realistic mock text file download
      const content = `GOVERNMENT OF INDIA\nMINISTRY OF SOCIAL JUSTICE & EMPOWERMENT\nNSFDC / MARGDARSHAK PORTAL\n\nDocument: ${doc.title}\nDocument Code: ${doc.code}\nCategory: ${doc.category}\nDate of Issue: ${doc.date}\nOfficial Status: Authorized for Public Access\n\nNotice: This is a sample official document downloaded from the Margdarshak Portal for Smart India Hackathon (SIH) prototype demonstration.\n`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.code}_Sample.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadingId(null);
    }, 600);
  }

  const categories = ["ALL", ...new Set(DOWNLOADABLE_DOCUMENTS.map((d) => d.category))];
  const filtered = DOWNLOADABLE_DOCUMENTS.filter(
    (d) => filter === "ALL" || d.category === filter
  );

  return (
    <div className="gov-page-container">
      <div className="page-header">
        <span className="eyebrow-pill">Repository</span>
        <h1>Official Documents &amp; Prescribed Forms</h1>
        <p>
          Download official application forms, self-declaration affidavits, technical appraisal templates, and Gazette guidelines issued by the Ministry of Social Justice &amp; Empowerment and NSFDC.
        </p>
      </div>

      {/* Category filter */}
      <div className="directory-filter-bar">
        <div className="filter-group">
          <label>Filter by Category:</label>
          <div className="filter-chips">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-chip ${filter === c ? "active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="downloads-grid">
        {filtered.map((doc) => (
          <div className="download-card" key={doc.id}>
            <div className="download-card-header">
              <span className="doc-format-badge">{doc.format}</span>
              <span className="doc-category-badge">{doc.category}</span>
            </div>

            <h3 className="download-title">{doc.title}</h3>
            <p className="download-desc">{doc.desc}</p>

            <div className="download-meta">
              <span>Code: <strong>{doc.code}</strong></span>
              <span>Size: <strong>{doc.size}</strong></span>
              <span>Updated: <strong>{doc.date}</strong></span>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm download-action-btn"
              onClick={() => triggerDownload(doc)}
              disabled={downloadingId === doc.id}
            >
              {downloadingId === doc.id ? "Preparing Download…" : "📥 Download Document"}
            </button>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 32, background: "#f8fafc" }}>
        <h4 style={{ margin: "0 0 8px", fontSize: 16 }}>Need assistance filling out these forms?</h4>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
          Visit your nearest empanelled State Channelising Agency (SCA) or contact our National Citizen Toll-Free Helpline at <strong>1800-11-0031</strong> (9:30 AM – 6:00 PM, Mon–Fri).
        </p>
      </div>
    </div>
  );
}
