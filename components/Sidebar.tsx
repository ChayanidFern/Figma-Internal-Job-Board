import { IconDashboard, IconJobs, IconUsers } from "./icons";

interface SidebarProps {
  page: string;
  setPage: (page: "dashboard" | "jobs" | "applicant") => void;
  profileName: string;
}

export default function Sidebar({ page, setPage, profileName }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="profile-section" style={{ borderBottom: '1px solid #374151', padding: '30px 20px', marginBottom: 20 }}>
        <img src="/Chaweewan.png" className="profile-pic" alt="User" style={{ width: 60, height: 60, border: '3px solid #4b5563', borderRadius: '50%', objectFit: 'cover', marginBottom: 15 }} />
        <div>
          <div className="profile-name" style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>{profileName}</div>
          <div className="profile-role" style={{ color: '#9ca3af', fontSize: '14px' }}>System User</div>
        </div>
      </div>
      <div className="menu" style={{ padding: '0 15px', flex: 1 }}>
        <div className={`menu-item-dark ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}><IconDashboard /> Dashboard</div>
        <div className={`menu-item-dark ${page === "jobs" ? "active" : ""}`} onClick={() => setPage("jobs")}><IconJobs /> Job Management</div>
        <div className={`menu-item-dark ${page === "applicant" ? "active" : ""}`} onClick={() => setPage("applicant")}><IconUsers /> Applicant</div>
      </div>
    </div>
  );
}