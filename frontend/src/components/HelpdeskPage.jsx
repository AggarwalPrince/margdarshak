import { useState } from "react";
import { api } from "../api";

const FAQS = [
  {
    q: "Who is eligible to apply for concessional loan schemes under NSFDC / Margdarshak?",
    a: "Any Indian citizen belonging to the Scheduled Caste (SC) community whose annual family income is below ₹5,00,000 per annum is eligible for concessional refinance schemes. Specific criteria such as age (minimum 18 years) and project type apply depending on the scheme selected.",
  },
  {
    q: "Is there any collateral or third-party guarantee required for loans below ₹1,40,000?",
    a: "No. Under the Micro Finance Scheme (MFS) and Mahila Samriddhi Yojana (MSY), loans up to ₹1,40,000 – ₹1,50,000 are collateral-free, backed by government refinance guarantee and hypothecation of assets created.",
  },
  {
    q: "Does Margdarshak charge any processing fee or service fee for scheme matching or application?",
    a: "Absolutely not. The Margdarshak portal and its conversational matching engine are 100% free of charge as a public service of the Government of India. Citizens are advised never to pay money to private agents or intermediaries.",
  },
  {
    q: "How does the moratorium period work?",
    a: "A moratorium is a grace period before principal repayment begins. For example, a 6-month moratorium allows you to establish your shop or machinery without monthly principal pressure. You only pay nominal concessional interest during this initial period.",
  },
  {
    q: "Why are some banks or channel partner branches not shown in my area?",
    a: "Margdarshak incorporates an automated credit health safeguard: only channel partners with a Non-Performing Asset (NPA) ratio below 10% and active lending quotas are recommended. This protects beneficiaries from uncooperative or financially distressed branches.",
  },
];

export default function HelpdeskPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    trackingId: "",
    category: "Appraisal Delay",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmitGrievance(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.submitGrievance(form);
      setTicket(res);
      setForm({ name: "", mobile: "", trackingId: "", category: "Appraisal Delay", description: "" });
    } catch (err) {
      setError(err.message || "Could not submit grievance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="gov-page-container">
      <div className="page-header">
        <span className="eyebrow-pill">Public Assistance</span>
        <h1>Citizen Helpdesk &amp; Grievance Redressal (CPGRAMS)</h1>
        <p>
          Need assistance or facing an issue with scheme appraisal? Submit a formal grievance to the Ministry's Grievance Redressal Cell or consult our citizen FAQ repository.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="helpdesk-contact-grid">
        <div className="contact-card">
          <div className="contact-icon">☎️</div>
          <h3>National Toll-Free Helpline</h3>
          <div className="contact-highlight">1800-11-0031</div>
          <p>Toll-free across all telecom networks in India. Available 9:30 AM to 6:00 PM (Monday through Friday).</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">✉️</div>
          <h3>Public Support Email</h3>
          <div className="contact-highlight">helpdesk-marg@gov.in</div>
          <p>Average response within 2 working days. Please mention your Application Tracking ID if already registered.</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">🏛️</div>
          <h3>Apex Corporation Office</h3>
          <div className="contact-highlight">Scope Minar, New Delhi</div>
          <p>NSFDC Public Relations Counter, Core 1, Laxmi Nagar District Centre, Delhi 110092.</p>
        </div>
      </div>

      {/* Two Column Layout: Grievance Form & FAQs */}
      <div className="helpdesk-main-split">
        {/* Left: File a Grievance */}
        <div className="panel">
          <h3 className="panel-title" style={{ fontSize: 18, marginBottom: 8 }}>
            File a Citizen Grievance
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>
            In accordance with Central Government CPGRAMS directives, all grievances are logged with a unique tracking ticket and monitored by the Nodal Grievance Officer.
          </p>

          {ticket && (
            <div className="panel" style={{ background: "#ecfdf5", borderColor: "#10b981", marginBottom: 20 }}>
              <h4 style={{ color: "#065f46", margin: "0 0 6px", fontSize: 15 }}>
                ✅ Grievance Registered Successfully!
              </h4>
              <p style={{ margin: "0 0 8px", fontSize: 14 }}>
                Ticket Registration Number: <strong>{ticket.ticketId}</strong>
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#047857" }}>
                {ticket.response}
              </p>
            </div>
          )}

          {error && <div className="field-error" style={{ marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmitGrievance}>
            <div className="calc-grid">
              <div className="field">
                <label>Citizen Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Registered Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />
              </div>
            </div>

            <div className="calc-grid">
              <div className="field">
                <label>Application Tracking ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. MOSJE-582914"
                  value={form.trackingId}
                  onChange={(e) => setForm({ ...form, trackingId: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Grievance Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="Appraisal Delay">Appraisal Delay by Channel Partner</option>
                  <option value="Branch Rejection">Groundless Branch Rejection</option>
                  <option value="Interest Query">Interest Subvention Discrepancy</option>
                  <option value="Technical Issue">Portal / Document Upload Issue</option>
                  <option value="General Inquiry">General Grievance</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Detailed Grievance Description *</label>
              <textarea
                rows={4}
                required
                placeholder="Explain the specific issue encountered with the channel partner, branch, or scheme..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting to Grievance Cell…" : "Submit Formal Grievance →"}
            </button>
          </form>
        </div>

        {/* Right: FAQs */}
        <div className="panel">
          <h3 className="panel-title" style={{ fontSize: 18, marginBottom: 16 }}>
            Frequently Asked Questions (FAQs)
          </h3>

          <div className="faq-accordion">
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  type="button"
                  className={`faq-question ${openFaq === i ? "active" : ""}`}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
