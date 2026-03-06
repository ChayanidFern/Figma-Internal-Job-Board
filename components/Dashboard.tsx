import { Job, Application } from "../types";

interface DashboardProps {
  jobs?: Job[];
  myApps?: Application[];
  myPostedJobs?: Job[];
}

export default function Dashboard({ jobs = [], myApps = [], myPostedJobs = [] }: DashboardProps) {
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeMyPostedJobs = Array.isArray(myPostedJobs) ? myPostedJobs : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        <div className="stat-box" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #6367FF' }}>
          <div className="stat-label" style={{ fontSize: '13px', fontWeight: 700, color: '#8494FF', marginBottom: '8px', textTransform: 'uppercase' }}>TOTAL OPEN JOBS</div>
          <div className="stat-num" style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>
            {safeJobs.filter(j => j && j.status === 'Open').length}
          </div>
        </div>
        
        <div className="stat-box" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #8494FF' }}>
          <div className="stat-label" style={{ fontSize: '13px', fontWeight: 700, color: '#8494FF', marginBottom: '8px', textTransform: 'uppercase' }}>TOTAL CLOSED JOBS</div>
          <div className="stat-num" style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>
            {safeJobs.filter(j => j && j.status === 'Closed').length}
          </div>
        </div>
        
        <div className="stat-box" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #C9BEFF' }}>
          <div className="stat-label" style={{ fontSize: '13px', fontWeight: 700, color: '#8494FF', marginBottom: '8px', textTransform: 'uppercase' }}>JOBS I POSTED</div>
          <div className="stat-num" style={{ fontSize: '32px', fontWeight: 800, color: '#6367FF' }}>
            {safeMyPostedJobs.length}
          </div>
        </div>

      </div>

      <div className="card" style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', color: '#6367FF', fontSize: '18px', fontWeight: 700 }}>Recently Posted Jobs</h3>
        
        {safeJobs.slice(0, 5).map(j => (
          j ? (
            <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f8fafc' }}>
              <div>
                <strong style={{ color: '#1e293b', fontSize: '16px' }}>{j.title}</strong> 
                <div style={{ fontSize: 13, color: '#8494FF', marginTop: 4 }}>{j.dept} • {j.date}</div>
              </div>
              <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: j.status === 'Open' ? '#FFDBFD' : '#fef2f2', color: j.status === 'Open' ? '#6367FF' : '#dc2626' }}>
                {j.status}
              </span>
            </div>
          ) : null
        ))}
        
        {safeJobs.length === 0 && <div style={{ textAlign: 'center', color: '#8494FF', padding: '20px 0' }}>No jobs posted yet.</div>}
      </div>
    </div>
  );
}