import { Job, Application } from "../types";

interface DashboardProps {
  jobs: Job[];
  myApps: Application[]; // รับค่าใบสมัครเข้ามาเป็น Array
  myPostedJobs: Job[];
}

export default function Dashboard({ jobs, myApps, myPostedJobs }: DashboardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* ส่วนแสดงสถิติ (Stats Grid) */}
      <div className="stats-grid">
        
        {/* กล่องที่ 1: งานที่เปิดรับทั้งหมด */}
        <div className="stat-box" style={{ borderLeft: '5px solid #3b82f6' }}>
          <div className="stat-label">Total Open Jobs</div>
          <div className="stat-num">
            {jobs.filter(j => j.status === 'Open').length}
          </div>
        </div>

        {/* กล่องที่ 2: ใบสมัครของฉัน (My Applications) */}
        <div className="stat-box" style={{ borderLeft: '5px solid #8b5cf6' }}>
          <div className="stat-label">My Applications</div>
          {/* ✅ จุดนี้คือการนับจำนวนใบสมัครทั้งหมดครับ */}
          <div className="stat-num">
            {myApps.length}
          </div>
        </div>

        {/* กล่องที่ 3: งานที่ฉันลงประกาศ */}
        <div className="stat-box" style={{ borderLeft: '5px solid #10b981' }}>
          <div className="stat-label">Jobs I Posted</div>
          <div className="stat-num" style={{ color: '#10b981' }}>
            {myPostedJobs.length}
          </div>
        </div>

      </div>

      {/* ส่วนแสดงงานล่าสุด */}
      <div className="card" style={{ padding: '25px' }}>
        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#111827' }}>
          Recently Posted Jobs
        </h3>
        {jobs.length > 0 ? (
          jobs.slice(0, 5).map(j => (
            <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <strong style={{ color: '#111827' }}>{j.title}</strong> 
                <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                  {j.dept} • {j.date}
                </div>
              </div>
              <span className={`badge badge-${j.status}`}>{j.status}</span>
            </div>
          ))
        ) : (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}