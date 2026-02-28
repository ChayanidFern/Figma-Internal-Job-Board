"use client";

import { useState, useEffect } from "react";
import { 
  getJobs, createJob, updateJob, deleteJob, 
  getApplications, createApplication, updateAppStatus, deleteApplication,
  type Job, type Application 
} from "./actions";

// --- Icons (Scaled Up) ---
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconJobs = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const IconDashboard = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const IconUsers = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconClose = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// --- Professional Chart Component ---
const ChartComponent = ({ title, data, colors }: { title: string, data: { label: string, value: number }[], colors: string[] }) => {
  const maxVal = Math.max(...data.map(d => d.value), 5);
  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', width: '100%', flex: 1, minWidth: '400px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '25px', color: '#111827', fontSize: '18px', fontWeight: 700, borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>{title}</h3>
      <div style={{ display: 'flex', height: '220px', position: 'relative', paddingLeft: '45px', paddingBottom: '35px' }}>
        <div style={{ position: 'absolute', left: -15, top: '50%', transform: 'rotate(-90deg)', fontSize: '13px', color: '#6b7280', fontWeight: 600 }}>Count</div>
        <div style={{ position: 'absolute', left: '45px', top: 0, bottom: '35px', width: '1px', background: '#e5e7eb' }}></div>
        {/* Horizontal Guidelines */}
        <div style={{ position: 'absolute', left: '45px', right: 0, top: '0%', borderTop: '1px dashed #e5e7eb' }}></div>
        <div style={{ position: 'absolute', left: '45px', right: 0, top: '50%', borderTop: '1px dashed #e5e7eb' }}></div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', width: '100%', borderBottom: '1px solid #e5e7eb', zIndex: 1 }}>
          {data.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#374151' }}>{d.value}</div>
              <div style={{ 
                width: '50px', 
                height: `${(d.value / maxVal) * 180}px`, 
                background: colors[i % colors.length], 
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.5s ease'
              }}></div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: '45px', right: 0, display: 'flex', justifyContent: 'space-around', paddingTop: '12px' }}>
          {data.map((d, i) => <div key={i} style={{ fontSize: '14px', color: '#4b5563', fontWeight: 600 }}>{d.label}</div>)}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const USER = "Chaweewan";
  const PASS = "1234";

  // States
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  
  const [page, setPage] = useState<"jobs" | "dashboard" | "candidates">("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");

  // Modals
  const [viewId, setViewId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewAppId, setViewAppId] = useState<number | null>(null);
  const [createAppModal, setCreateAppModal] = useState(false);

  // Forms
  const [jobForm, setJobForm] = useState({ title: "", dept: "", desc: "", status: "Open", date: "" });
  const [appForm, setAppForm] = useState({ name: "", email: "", job_title: "" });

  useEffect(() => {
    if (logged) loadData();
  }, [logged, page]);

  async function loadData() {
    setIsLoading(true);
    try {
      const jobData = await getJobs();
      setJobs(jobData);
      const appData = await getApplications();
      setApps(appData);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogin() {
    if (email === USER && pass === PASS) setLogged(true);
    else alert("Invalid Credentials");
  }

  // Actions
  async function handleSaveJob() {
    if (!jobForm.title || !jobForm.dept) return;
    const dateStr = new Date().toLocaleDateString('en-GB');
    if (editId === -1) await createJob(jobForm.title, jobForm.dept, jobForm.desc, dateStr);
    else if (editId) await updateJob(editId, jobForm.title, jobForm.dept, jobForm.desc, jobForm.status);
    await loadData();
    setEditId(null);
  }
  async function handleDeleteJob(id: number) {
    if(confirm("Confirm deletion of this job posting?")) { await deleteJob(id); await loadData(); setViewId(null); }
  }
  async function handleStatusChange(id: number, status: string) {
    await updateAppStatus(id, status);
    await loadData();
    setViewAppId(null); 
  }
  async function handleDeleteApp(id: number) {
    if(confirm("Permanently delete this application?")) { await deleteApplication(id); await loadData(); setViewAppId(null); }
  }
  async function handleCreateApp() {
    if (!appForm.name || !appForm.job_title) return;
    const dateStr = new Date().toLocaleDateString('en-GB');
    await createApplication(appForm.name, appForm.email, appForm.job_title, dateStr);
    await loadData();
    setCreateAppModal(false);
    setAppForm({ name: "", email: "", job_title: "" });
  }

  // Helpers
  const openJobCreate = () => { setJobForm({ title:"", dept:"", desc:"", status:"Open", date:"" }); setEditId(-1); };
  const openJobEdit = (j: Job) => { setJobForm({ title: j.title, dept: j.dept, desc: j.desc, status: j.status, date: j.date }); setEditId(j.id); setViewId(null); };

  // Filtering
  const filteredJobs = jobs.filter(j => j.title.toLowerCase().includes(filterKeyword.toLowerCase()));
  const viewJob = jobs.find(j => j.id === viewId);
  const viewApp = apps.find(a => a.id === viewAppId);

  // Stats
  const jobStats = [
    { label: 'Total Jobs', value: jobs.length },
    { label: 'Active', value: jobs.filter(j=>j.status==="Open").length },
    { label: 'Archived', value: jobs.filter(j=>j.status==="Archived").length },
  ];
  const appStats = [
    { label: 'Pending', value: apps.filter(a=>a.status==="Pending").length },
    { label: 'Passed', value: apps.filter(a=>a.status==="Passed").length },
    { label: 'Failed', value: apps.filter(a=>a.status==="Failed").length },
  ];

  const recruitmentStats = jobs.map(job => {
    const jobApps = apps.filter(a => a.job_title === job.title);
    return {
      id: job.id,
      title: job.title,
      dept: job.dept,
      total: jobApps.length,
      pending: jobApps.filter(a => a.status === 'Pending').length,
      passed: jobApps.filter(a => a.status === 'Passed').length,
      failed: jobApps.filter(a => a.status === 'Failed').length,
      status: job.status
    };
  });

  // --- LOGIN SCREEN (UPSCALED) ---
  if (!logged) {
    return (
      <div className="login-screen" style={{
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div className="login-card" style={{
          background: 'white',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -10px rgba(0, 0, 0, 0.1)',
          width: '550px',
          padding: '80px 60px',
          borderRadius: '24px',
          textAlign: 'center'
        }}>
          <div style={{marginBottom: '30px'}}>
             <div style={{width: 80, height: 80, background: '#1f2937', borderRadius: '16px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{color: 'white', fontWeight: 900, fontSize: '32px'}}>HR</span>
             </div>
          </div>
          
          <h2 style={{
            marginBottom: '10px', 
            fontSize: '36px', 
            color: '#111827', 
            fontWeight: 800, 
            letterSpacing: '-0.03em'
          }}>
            Welcome Back
          </h2>
          <p style={{marginBottom: '50px', color: '#6b7280', fontSize: '18px'}}>Sign in to access the HR Portal</p>
          
          <div style={{marginBottom: '25px', textAlign: 'left'}}>
             <label style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: '#374151', fontSize: '16px'}}>Username</label>
             <input 
                className="input-login" 
                placeholder="Enter your username" 
                value={email} 
                onChange={e=>setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px 20px', 
                  fontSize: '18px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  background: '#f9fafb',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
              />
          </div>
          
          <div style={{marginBottom: '50px', textAlign: 'left'}}>
             <label style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: '#374151', fontSize: '16px'}}>Password</label>
             <input 
                className="input-login" 
                placeholder="Enter your password" 
                type="password" 
                value={pass} 
                onChange={e=>setPass(e.target.value)} 
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                style={{
                  width: '100%',
                  padding: '18px 20px', 
                  fontSize: '18px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  background: '#f9fafb',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
              />
          </div>
          
          <button 
            onClick={handleLogin}
            style={{
              width: '100%', 
              padding: '20px', 
              fontSize: '20px', 
              fontWeight: 700, 
              background: '#111827', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              cursor: 'pointer',
              transition: 'transform 0.1s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Sign In
          </button>
          
          <p style={{marginTop: '30px', color: '#9ca3af', fontSize: '14px'}}>© 2026 Internal Job Board System</p>
        </div>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div className="app">
      {/* SIDEBAR */}
      <div className="sidebar" style={{background: '#111827', color: 'white', width: '280px'}}>
        <div className="profile" style={{borderBottom: '1px solid #374151', padding: '30px 20px', marginBottom: 20}}>
          <img src="/image.png" className="profile-pic" alt="User" style={{width: 60, height: 60, border: '3px solid #4b5563'}} />
          <div>
            <div className="profile-name" style={{color: 'white', fontSize: '18px', fontWeight: 600}}>Gavano</div>
            <div className="profile-role" style={{color: '#9ca3af', fontSize: '14px'}}>HR Manager</div>
          </div>
        </div>
        <div className="menu" style={{padding: '0 15px'}}>
          <div className={`menu-item-dark ${page==="jobs"?"active":""}`} onClick={()=>setPage("jobs")}><IconJobs /> Job Postings</div>
          <div className={`menu-item-dark ${page==="candidates"?"active":""}`} onClick={()=>setPage("candidates")}><IconUsers /> Candidates</div>
          <div className={`menu-item-dark ${page==="dashboard"?"active":""}`} onClick={()=>setPage("dashboard")}><IconDashboard /> Dashboard</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main" style={{background: '#f3f4f6'}}>
        {/* ✅ FIXED: TOPBAR Layout for Left Alignment */}
        <div className="topbar" style={{
            background: 'white', 
            borderBottom: '1px solid #e5e7eb', 
            height: '80px', 
            padding: '0 40px',
            display: 'flex', // Important for layout
            justifyContent: 'space-between', // Push content to edges
            alignItems: 'center' // Vertically center
        }}>
          {/* Title on the LEFT */}
          <h2 style={{
              fontSize: 24, 
              fontWeight: 700, 
              color: '#111827', 
              letterSpacing: '-0.01em',
              margin: 0 // Remove default margin
          }}>
            {page === 'jobs' ? 'Job Management' : page === 'candidates' ? 'Applicant Tracking' : 'Executive Dashboard'}
          </h2>
          
          {/* Action Buttons on the RIGHT */}
          <div style={{display:'flex', alignItems:'center', gap: '15px'}}>
             {page === "jobs" && <button className="btn-primary" onClick={openJobCreate}>+ New Job</button>}
             {page === "candidates" && <button className="btn-primary" onClick={()=>setCreateAppModal(true)}>+ Add Candidate</button>}
          </div>
        </div>

        <div className="content" style={{padding: '40px', maxWidth: '1600px', margin: '0 auto'}}>
          
          {/* JOBS PAGE */}
          {page === "jobs" && (
            <>
              <div className="search-section" style={{padding: '20px', marginBottom: '30px'}}>
                 <div style={{color:'#9ca3af'}}><IconSearch /></div>
                 <input className="input" style={{border:'none', boxShadow:'none', fontSize: '16px'}} placeholder="Search by title or department..." value={searchInput} onChange={e => setSearchInput(e.target.value)}/>
                 <button className="search-btn" onClick={() => setFilterKeyword(searchInput)}>Search</button>
              </div>
              <div className="card">
                <table className="formal-table">
                  <thead><tr><th>Title</th><th>Department</th><th>Status</th><th>Date Posted</th><th>Action</th></tr></thead>
                  <tbody>
                    {filteredJobs.map(j => (
                      <tr key={j.id}>
                        <td style={{fontWeight: 700, color: '#1f2937', fontSize: '16px'}}>{j.title}</td>
                        <td style={{fontSize: '15px'}}>{j.dept}</td>
                        <td><span className={`badge badge-${j.status}`}>{j.status}</span></td>
                        <td style={{fontSize: '15px'}}>{j.date}</td>
                        <td><button className="btn-outline" onClick={() => setViewId(j.id)}>Details</button></td>
                      </tr>
                    ))}
                    {filteredJobs.length === 0 && <tr><td colSpan={5} style={{textAlign:'center', padding:40, color:'#6b7280', fontSize:'16px'}}>No jobs found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* CANDIDATES PAGE */}
          {page === "candidates" && (
            <div className="card">
              <table className="formal-table">
                <thead><tr><th>Candidate Name</th><th>Applied Position</th><th>Status</th><th>Date Applied</th><th>Action</th></tr></thead>
                <tbody>
                  {apps.map(a => (
                    <tr key={a.id}>
                      <td style={{fontWeight: 700, color: '#1f2937', fontSize: '16px'}}>{a.name}</td>
                      <td style={{fontSize: '15px'}}>{a.job_title}</td>
                      <td>
                        {a.status === 'Pending' ? <span style={{color:'#6b7280', fontSize:14, fontStyle:'italic'}}>Wait for Action</span> : 
                        <span className={`badge badge-${a.status}`}>{a.status}</span>}
                      </td>
                      <td style={{fontSize: '15px'}}>{a.date}</td>
                      <td><button className="btn-outline" onClick={() => setViewAppId(a.id)}>Review</button></td>
                    </tr>
                  ))}
                  {apps.length === 0 && <tr><td colSpan={5} style={{textAlign:'center', padding:40, color:'#6b7280', fontSize:'16px'}}>No applications received yet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* DASHBOARD PAGE */}
          {page === "dashboard" && (
            <div style={{display:'flex', flexDirection:'column', gap: '30px'}}>
              <div className="stats-grid">
                <div className="stat-box" style={{borderLeft: '5px solid #3b82f6'}}>
                   <div className="stat-label">Total Jobs</div>
                   <div className="stat-num">{jobs.length}</div>
                </div>
                <div className="stat-box" style={{borderLeft: '5px solid #8b5cf6'}}>
                   <div className="stat-label">Total Applicants</div>
                   <div className="stat-num">{apps.length}</div>
                </div>
                <div className="stat-box" style={{borderLeft: '5px solid #10b981'}}>
                   <div className="stat-label">Hired (Passed)</div>
                   <div className="stat-num" style={{color:'#10b981'}}>{apps.filter(a=>a.status==='Passed').length}</div>
                </div>
              </div>
              <div style={{display:'flex', gap:'30px', flexWrap:'wrap'}}>
                <ChartComponent title="Job Status Overview" data={jobStats} colors={['#3b82f6', '#10b981', '#6b7280']} />
                <ChartComponent title="Recruitment Pipeline" data={appStats} colors={['#9ca3af', '#10b981', '#ef4444']} />
              </div>
              <div className="card" style={{boxShadow: 'none', border: '1px solid #e5e7eb'}}>
                <div style={{padding: '20px 25px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb'}}>
                    <h3 style={{margin:0, fontSize: 18, color: '#111827', fontWeight: 700}}>Recruitment Summary by Position</h3>
                </div>
                <table className="formal-table">
                  <thead>
                    <tr style={{background: 'white'}}>
                        <th>Job Position</th>
                        <th>Department</th>
                        <th style={{textAlign:'center'}}>Total Candidates</th>
                        <th style={{textAlign:'center', color:'#f59e0b'}}>Pending</th>
                        <th style={{textAlign:'center', color:'#10b981'}}>Passed</th>
                        <th style={{textAlign:'center', color:'#ef4444'}}>Failed</th>
                        <th style={{textAlign:'center'}}>Job Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recruitmentStats.map(stat => (
                        <tr key={stat.id}>
                            <td style={{fontWeight:600, fontSize: '15px'}}>{stat.title}</td>
                            <td style={{fontSize: '15px'}}>{stat.dept}</td>
                            <td style={{textAlign:'center', fontWeight:'bold', fontSize: '16px'}}>{stat.total}</td>
                            <td style={{textAlign:'center', fontSize: '15px'}}>{stat.pending > 0 ? stat.pending : '-'}</td>
                            <td style={{textAlign:'center', fontSize: '15px'}}>{stat.passed > 0 ? stat.passed : '-'}</td>
                            <td style={{textAlign:'center', fontSize: '15px'}}>{stat.failed > 0 ? stat.failed : '-'}</td>
                            <td style={{textAlign:'center'}}><span className={`badge badge-${stat.status}`} style={{fontSize:12}}>{stat.status}</span></td>
                        </tr>
                    ))}
                    {recruitmentStats.length === 0 && <tr><td colSpan={7} style={{textAlign:'center', padding:40, fontSize:'15px'}}>No data available.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* JOB DETAILS MODAL */}
      {viewId && viewJob && (
        <div className="modal-overlay" onClick={()=>setViewId(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()} style={{padding: '40px', maxWidth: '700px'}}>
            <div className="close-icon" onClick={()=>setViewId(null)}><IconClose /></div>
            <h3 style={{fontSize:24, borderBottom:'1px solid #eee', paddingBottom:15, marginBottom:20, fontWeight: 700, color: '#111827'}}>Job Details</h3>
            <div style={{marginBottom: 25}}>
                <h2 style={{fontSize:28, color:'#1f2937', margin:'0 0 8px 0', fontWeight: 700}}>{viewJob.title}</h2>
                <div style={{color:'#6b7280', fontSize:16, fontWeight: 500}}>{viewJob.dept} • Posted on {viewJob.date}</div>
            </div>
            <div style={{background:'#f3f4f6', padding:25, borderRadius:8, marginBottom:30, fontSize:16, lineHeight:1.7, color: '#374151'}}>
                {viewJob.desc}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span className={`badge badge-${viewJob.status}`} style={{fontSize:14, padding:'8px 16px'}}>{viewJob.status}</span>
                <div className="modal-actions" style={{margin:0}}>
                    <button className="btn-outline" onClick={openJobEdit.bind(null, viewJob)} style={{padding: '10px 20px', fontSize: '15px'}}>Edit Posting</button>
                    <button className="btn-danger-outline" onClick={()=>handleDeleteJob(viewJob.id)} style={{padding: '10px 20px', fontSize: '15px'}}>Delete</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* JOB EDIT/CREATE MODAL */}
      {editId !== null && (
        <div className="modal-overlay" onClick={()=>setEditId(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()} style={{padding: '40px', maxWidth: '600px'}}>
            <div className="close-icon" onClick={()=>setEditId(null)}><IconClose /></div>
            <h3 style={{fontSize: 24, fontWeight: 700, marginBottom: 25, color: '#111827'}}>{editId===-1?"Create New Job":"Edit Job Posting"}</h3>
            <div style={{display:'grid', gap:20, marginTop:10}}>
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151'}}>Job Title</label>
                <input className="input-large" value={jobForm.title} onChange={e=>setJobForm({...jobForm, title:e.target.value})} placeholder="e.g. Senior Marketing Manager"/>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151'}}>Department</label>
                <input className="input-large" value={jobForm.dept} onChange={e=>setJobForm({...jobForm, dept:e.target.value})} placeholder="e.g. Marketing"/>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151'}}>Description</label>
                <textarea className="textarea-large" rows={6} value={jobForm.desc} onChange={e=>setJobForm({...jobForm, desc:e.target.value})} placeholder="Enter job description..."/>
              </div>
              <button className="btn-primary-large" onClick={handleSaveJob} style={{marginTop: 10}}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: CREATE CANDIDATE MODAL */}
      {createAppModal && (
        <div className="modal-overlay" onClick={()=>setCreateAppModal(false)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()} style={{padding: '40px', maxWidth: '500px'}}>
            <div className="close-icon" onClick={()=>setCreateAppModal(false)}><IconClose /></div>
            <h3 style={{fontSize: 24, fontWeight: 700, marginBottom: 25, color: '#111827'}}>Add New Candidate</h3>
            <div style={{display:'grid', gap:20}}>
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151'}}>Candidate Name</label>
                <input className="input-large" value={appForm.name} onChange={e=>setAppForm({...appForm, name:e.target.value})} placeholder="Full Name"/>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151'}}>Applied Position</label>
                <select className="input-large" value={appForm.job_title} onChange={e=>setAppForm({...appForm, job_title:e.target.value})}>
                    <option value="">-- Select Position --</option>
                    {jobs.filter(j=>j.status==='Open').map(j=><option key={j.id} value={j.title}>{j.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151'}}>Email</label>
                <input className="input-large" value={appForm.email} onChange={e=>setAppForm({...appForm, email:e.target.value})} placeholder="email@example.com"/>
              </div>
              <button className="btn-primary-large" onClick={handleCreateApp} style={{marginTop: 10}}>Add Candidate</button>
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE REVIEW MODAL */}
      {viewAppId && viewApp && (
        <div className="modal-overlay" onClick={()=>setViewAppId(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()} style={{padding: '40px', maxWidth: '600px'}}>
            <div className="close-icon" onClick={()=>setViewAppId(null)}><IconClose /></div>
            <h3 style={{fontSize:24, borderBottom:'1px solid #eee', paddingBottom:15, marginBottom:20, fontWeight: 700, color: '#111827'}}>Application Review</h3>
            
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:30, marginBottom:30}}>
                <div><label style={{fontSize:13, color:'#6b7280', fontWeight: 600, textTransform: 'uppercase'}}>Candidate Name</label><div style={{fontWeight:700, fontSize: '18px', color: '#1f2937'}}>{viewApp.name}</div></div>
                <div><label style={{fontSize:13, color:'#6b7280', fontWeight: 600, textTransform: 'uppercase'}}>Applying For</label><div style={{fontWeight:700, fontSize: '18px', color: '#1f2937'}}>{viewApp.job_title}</div></div>
                <div><label style={{fontSize:13, color:'#6b7280', fontWeight: 600, textTransform: 'uppercase'}}>Email</label><div style={{fontSize: '16px'}}>{viewApp.email}</div></div>
                <div><label style={{fontSize:13, color:'#6b7280', fontWeight: 600, textTransform: 'uppercase'}}>Date Applied</label><div style={{fontSize: '16px'}}>{viewApp.date}</div></div>
            </div>

            <div style={{border:'1px solid #e5e7eb', borderRadius:10, padding:25, marginBottom:30, background: '#f9fafb'}}>
                <label style={{fontSize:14, fontWeight:700, display:'block', marginBottom:15, color: '#374151'}}>Update Application Status</label>
                <div style={{display:'flex', gap:15}}>
                    <button onClick={()=>handleStatusChange(viewApp.id, 'Passed')} style={{flex:1, background: viewApp.status==='Passed'?'#10b981':'white', color: viewApp.status==='Passed'?'white':'#059669', border:'1px solid #10b981', padding:12, borderRadius:8, cursor:'pointer', fontWeight: 600, transition: '0.2s'}}>Pass</button>
                    <button onClick={()=>handleStatusChange(viewApp.id, 'Failed')} style={{flex:1, background: viewApp.status==='Failed'?'#ef4444':'white', color: viewApp.status==='Failed'?'white':'#b91c1c', border:'1px solid #ef4444', padding:12, borderRadius:8, cursor:'pointer', fontWeight: 600, transition: '0.2s'}}>Fail</button>
                    <button onClick={()=>handleStatusChange(viewApp.id, 'Pending')} style={{flex:1, background: viewApp.status==='Pending'?'#6b7280':'white', color: viewApp.status==='Pending'?'white':'#4b5563', border:'1px solid #9ca3af', padding:12, borderRadius:8, cursor:'pointer', fontWeight: 600, transition: '0.2s'}}>Pending</button>
                </div>
            </div>

            <div style={{textAlign:'right'}}>
              <button className="btn-text-danger" onClick={()=>handleDeleteApp(viewApp.id)} style={{fontSize: '14px', fontWeight: 500}}>Permanently Delete Application</button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles for Professional Look */}
      <style jsx global>{`
        body { background: #f3f4f6; color: #1f2937; font-family: 'Inter', system-ui, sans-serif; }
        .input, .textarea { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px 16px; font-size: 15px; width: 100%; transition: all 0.2s; background: white; }
        .input-large, .textarea-large { border: 1px solid #d1d5db; border-radius: 8px; padding: 14px 18px; font-size: 16px; width: 100%; transition: all 0.2s; background: white; }
        .input:focus, .textarea:focus, .input-large:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .input-login:focus { border-color: #111827 !important; box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1) !important; }
        
        .btn-primary { background: #111827; color: white; border: none; border-radius: 8px; padding: 12px 24px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 14px; }
        .btn-primary-large { background: #111827; color: white; border: none; border-radius: 8px; padding: 14px 28px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 16px; width: 100%; }
        .btn-primary:hover, .btn-primary-large:hover { background: #374151; transform: translateY(-1px); }
        
        .btn-outline { background: white; border: 1px solid #d1d5db; color: #374151; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-outline:hover { background: #f9fafb; border-color: #9ca3af; color: #111827; }

        .btn-danger-outline { background: white; border: 1px solid #fca5a5; color: #dc2626; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-danger-outline:hover { background: #fef2f2; border-color: #f87171; }

        .btn-text-danger { background: none; border: none; color: #ef4444; cursor: pointer; text-decoration: underline; transition: 0.2s; }
        .btn-text-danger:hover { color: #dc2626; }

        .menu-item-dark { padding: 16px 20px; cursor: pointer; display: flex; align-items: center; gap: 16px; color: #d1d5db; border-radius: 8px; transition: 0.2s; margin-bottom: 6px; font-size: 15px; }
        .menu-item-dark:hover { background: #374151; color: white; }
        .menu-item-dark.active { background: #374151; color: white; font-weight: 700; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }

        .formal-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 15px; }
        .formal-table th { text-align: left; padding: 18px 24px; background: #f9fafb; color: #4b5563; font-weight: 700; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
        .formal-table td { padding: 20px 24px; border-bottom: 1px solid #f3f4f6; color: #4b5563; vertical-align: middle; }
        .formal-table tr:last-child td { border-bottom: none; }
        .formal-table tr:hover td { background: #f9fafb; }
        
        .badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 12px; border-radius: 99px; font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
        .badge-Open, .badge-Passed { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .badge-Closed, .badge-Failed { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .badge-Archived { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }
        .badge-Pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

        .stat-box { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; flex: 1; transition: transform 0.2s; }
        .stat-box:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
        .stat-label { font-size: 14px; color: #6b7280; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-num { font-size: 36px; font-weight: 800; color: #111827; line-height: 1; }
        
        .modal-overlay { background: rgba(0,0,0,0.6); backdrop-filter: blur(2px); }
        .modal-content { border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
      `}</style>
    </div>
  );
}