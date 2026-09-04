import { useState } from "react";

const DEMO_OFFICIALS = [
  {
    id: "off_1",
    name: "Shri Rajesh Kumar, IAS",
    designation: "Secretary",
    department: "Department of Social Justice & Empowerment",
    ministry: "Ministry of Social Justice & Empowerment, GoI",
    email: "sec-msje@nic.in",
    phone: "011-23381001",
    room: "Room 604, 'A' Wing, Shastri Bhawan, New Delhi",
    avatarColor: "#0b3c5d",
    roleType: "Ministry Leadership",
  },
  {
    id: "off_2",
    name: "Smt. Sunita Verma, IAS",
    designation: "Joint Secretary (Credit & Economic Development)",
    department: "Department of Social Justice & Empowerment",
    ministry: "Ministry of Social Justice & Empowerment, GoI",
    email: "js-credit@nic.in",
    phone: "011-23381005",
    room: "Room 412, Shastri Bhawan, New Delhi",
    avatarColor: "#138808",
    roleType: "Ministry Leadership",
  },
  {
    id: "off_3",
    name: "Shri Alok Anand",
    designation: "Managing Director",
    department: "National Scheduled Castes Finance & Development Corporation",
    ministry: "NSFDC Head Office",
    email: "md-nsfdc@nic.in",
    phone: "011-22054321",
    room: "Scope Minar, Core 1, Laxmi Nagar, Delhi 110092",
    avatarColor: "#002147",
    roleType: "NSFDC Executive",
  },
  {
    id: "off_4",
    name: "Smt. Kavita Sharma",
    designation: "Chief General Manager (Project Appraisal & Risk)",
    department: "Credit Operations Vertical",
    ministry: "NSFDC Head Office",
    email: "cgm-credit@nsfdc.nic.in",
    phone: "011-22054325",
    room: "14th Floor, Scope Minar, Delhi",
    avatarColor: "#d96500",
    roleType: "NSFDC Executive",
  },
  {
    id: "off_5",
    name: "Shri Manoj Patel",
    designation: "Director & Nodal Grievance Officer",
    department: "Citizen Services & CPGRAMS Coordination",
    ministry: "Ministry of Social Justice & Empowerment",
    email: "nodal-grievance@socialjustice.gov.in",
    phone: "011-23381099",
    room: "Room 205, C-Wing, Shastri Bhawan, New Delhi",
    avatarColor: "#5333ed",
    roleType: "Grievance & Public Relations",
  },
  {
    id: "off_6",
    name: "Dr. Arvind Meena",
    designation: "General Manager (Channel Partner Empanelment)",
    department: "State Coordination & Recovery Cell",
    ministry: "NSFDC Regional Desk",
    email: "gm-partners@nsfdc.nic.in",
    phone: "011-22054330",
    room: "12th Floor, Scope Minar, Delhi",
    avatarColor: "#007a87",
    roleType: "NSFDC Executive",
  },
];

export default function OfficialsDirectory() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = DEMO_OFFICIALS.filter((off) => {
    const matchesCategory = filter === "ALL" || off.roleType === filter;
    const matchesSearch =
      off.name.toLowerCase().includes(search.toLowerCase()) ||
      off.designation.toLowerCase().includes(search.toLowerCase()) ||
      off.department.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="gov-page-container">
      <div className="page-header">
        <span className="eyebrow-pill">Directory of Officials</span>
        <h1>Officials &amp; Key Functionaries</h1>
        <p>
          Official directory of supervisory authorities, apex corporation directors, and nodal grievance officers administering concessional loan schemes under the Ministry of Social Justice &amp; Empowerment and NSFDC.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="directory-filter-bar">
        <div className="filter-group">
          <label>Filter by Role:</label>
          <div className="filter-chips">
            {["ALL", "Ministry Leadership", "NSFDC Executive", "Grievance & Public Relations"].map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-chip ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="search-box-wrap">
          <input
            type="text"
            className="directory-search-input"
            placeholder="Search by name, designation, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Officials Cards Grid */}
      <div className="officials-grid">
        {filtered.map((off) => (
          <div className="official-card" key={off.id}>
            <div className="official-card-top">
              <div
                className="official-avatar-placeholder"
                style={{ backgroundColor: off.avatarColor }}
                aria-hidden="true"
              >
                {off.name
                  .split(" ")
                  .filter((p) => !["Shri", "Smt.", "Dr."].includes(p))
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="official-meta">
                <span className="official-role-badge">{off.roleType}</span>
                <h3 className="official-name">{off.name}</h3>
                <div className="official-designation">{off.designation}</div>
              </div>
            </div>

            <div className="official-card-body">
              <div className="official-detail-row">
                <span className="label">Department:</span>
                <span className="value">{off.department}</span>
              </div>
              <div className="official-detail-row">
                <span className="label">Office Location:</span>
                <span className="value">{off.room}</span>
              </div>
              <div className="official-detail-row">
                <span className="label">Email:</span>
                <a href={`mailto:${off.email}`} className="value official-email">
                  {off.email}
                </a>
              </div>
              <div className="official-detail-row">
                <span className="label">Telephone:</span>
                <span className="value">{off.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Directory Table View */}
      <div className="panel" style={{ marginTop: 32 }}>
        <h3 className="panel-title" style={{ fontSize: 17, marginBottom: 16 }}>
          Official Contact Roster (Tabular View)
        </h3>
        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Officer Name</th>
                <th>Designation</th>
                <th>Department / Office</th>
                <th>Telephone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((off) => (
                <tr key={off.id}>
                  <td><strong>{off.name}</strong></td>
                  <td>{off.designation}</td>
                  <td>{off.department}</td>
                  <td>{off.phone}</td>
                  <td><code>{off.email}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="footnote" style={{ marginTop: 24 }}>
        <strong>Transparency &amp; Demo Notice:</strong> The names and contact coordinates presented on this page are sample illustrative entries curated specifically for the Smart India Hackathon (SIH) prototype demonstration. For active, Gazette-notified office incumbents, consult the official ministry portal at <a href="https://socialjustice.gov.in" target="_blank" rel="noreferrer" className="inline-link">socialjustice.gov.in</a> and <a href="https://nsfdc.nic.in" target="_blank" rel="noreferrer" className="inline-link">nsfdc.nic.in</a>.
      </p>
    </div>
  );
}
