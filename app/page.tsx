"use client";

import { useState, useEffect } from "react";
// ⚠️ หมายเหตุ: ต้องไปเพิ่มฟิลด์เหล่านี้ใน actions.ts และ Database ของคุณด้วยนะครับ
// import { getJobs, createJob, updateJob, deleteJob, getApplications, createApplication, updateAppStatus, deleteApplication } from "./actions";

// --- Types (อัปเดตเพื่อรองรับฟิลด์ใหม่) ---
export interface Job {
  id: number;
  title: string;
  dept: string;
  desc: string;
  requirements: string;
  responsibilities: string;
  status: string; // "Open" | "Closed" | "Draft"
  date: string;
  closingDate: string;
  creator: string; // ชื่อ Username คนสร้าง
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  applicant: string;
  email: string;
  phone: string;
  resume: string;
  reason: string;
  status: string; // "Pending" | "Interview" | "Rejected" | "Accepted"
  date: string;
  creatorOfJob: string; // ชื่อเจ้าของงาน
}

// --- Icons (Original) ---
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconJobs = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const IconDashboard = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const IconUsers = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconClose = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconLogout = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconCheckCircle = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

export default function Page() {
  // --- Auth & User State ---
  const [logged, setLogged] = useState(false);
  const [currentUser, setCurrentUser] = useState(""); // ใช้จำลองว่าเป็นใครล็อกอิน
  const [pass, setPass] = useState("");
  
  // Profile State
  const [profile, setProfile] = useState({ name: "", phone: "081-234-5678", resume: "https://drive.google.com/resume", password: "123" });

  // --- App State ---
  const [page, setPage] = useState<"dashboard" | "jobs" | "my_apps" | "profile">("dashboard");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  
  // Search & Filters
  const [searchInput, setSearchInput] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Toast State
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Modals
  const [viewJobId, setViewJobId] = useState<number | null>(null);
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [applyJobId, setApplyJobId] = useState<number | null>(null);
  const [manageAppId, setManageAppId] = useState<number | null>(null);

  // Forms
  const [jobForm, setJobForm] = useState({ title: "", dept: "", desc: "", requirements: "", responsibilities: "", status: "Open", closingDate: "" });
  const [applyForm, setApplyForm] = useState({ reason: "", resumeLink: "" });

  // Mock Load Data (แทนที่การดึง API ชั่วคราวเพื่อให้ฟังก์ชันใหม่ทำงานได้ทันที)
  useEffect(() => {
    if (logged) {
      setProfile(prev => ({ ...prev, name: currentUser }));
      setJobs([
        { id: 1, title: "Frontend Developer", dept: "IT", desc: "พัฒนาเว็บแอปพลิเคชันด้วย React/Next.js", requirements: "ประสบการณ์ 2 ปีขึ้นไป", responsibilities: "ออกแบบและพัฒนาหน้า UI", status: "Open", date: "01/03/2026", closingDate: "30/03/2026", creator: "Admin" },
        { id: 2, title: "Marketing Executive", dept: "Marketing", desc: "ดูแลแคมเปญโฆษณาออนไลน์", requirements: "คิดวิเคราะห์เก่ง", responsibilities: "จัดการงบโฆษณา", status: "Open", date: "02/03/2026", closingDate: "15/03/2026", creator: currentUser },
      ]);
      setApps([
        { id: 1, jobId: 1, jobTitle: "Frontend Developer", applicant: currentUser, email: `${currentUser}@mail.com`, phone: "080", resume: "link", reason: "อยากเขียนโค้ด", status: "Pending", date: "03/03/2026", creatorOfJob: "Admin" },
        { id: 2, jobId: 2, jobTitle: "Marketing Executive", applicant: "Somchai", email: "somchai@mail.com", phone: "099", resume: "link", reason: "ชอบการตลาด", status: "Interview", date: "03/03/2026", creatorOfJob: currentUser }
      ]);
    }
  }, [logged, currentUser]);

  useEffect(() => { setCurrentPage(1); }, [filterKeyword, filterDept, filterStatus]);

  function handleLogin() {
    if (currentUser.trim() !== "") setLogged(true);
    else alert("Please enter your Username");
  }

  const handleLogout = () => {
    if(confirm("Are you sure you want to log out?")) {
        setLogged(false);
        setCurrentUser("");
        setPass("");
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Actions ---
  const handleSaveJob = () => {
    if (!jobForm.title || !jobForm.dept || !jobForm.closingDate) {
        showToast("Please fill in Title, Dept, and Closing Date.", "error");
        return;
    }
    const dateStr = new Date().toLocaleDateString('en-GB');
    if (editJobId === -1) {
      setJobs([{ id: Date.now(), ...jobForm, date: dateStr, creator: currentUser }, ...jobs]);
      showToast("Job created successfully!");
    } else {
      setJobs(jobs.map(j => j.id === editJobId ? { ...j, ...jobForm } : j));
      showToast("Job updated successfully!");
    }
    setEditJobId(null);
  };

  const handleToggleJobStatus = (job: Job) => {
    const newStatus = job.status === "Open" ? "Closed" : "Open";
    setJobs(jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
    showToast(`Job status changed to ${newStatus}`);
  };

  const handleApply = () => {
    if (!applyForm.resumeLink || !applyForm.reason) { showToast("Please fill all fields", "error"); return; }
    const job = jobs.find(j => j.id === applyJobId);
    if(job) {
      setApps([{
        id: Date.now(), jobId: job.id, jobTitle: job.title, applicant: currentUser, 
        email: `${currentUser}@mail.com`, phone: profile.phone, resume: applyForm.resumeLink, reason: applyForm.reason, 
        status: "Pending", date: new Date().toLocaleDateString('en-GB'), creatorOfJob: job.creator
      }, ...apps]);
      showToast("Application submitted successfully!");
      setApplyJobId(null);
      setApplyForm({ reason: "", resumeLink: "" });
    }
  };

  const handleUpdateAppStatus = (id: number, status: string) => {
    setApps(apps.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Applicant marked as ${status}`);
    setManageAppId(null);
  };

  // --- Filtering & Pagination ---
  const filteredJobs = jobs.filter(j => {
    return (j.title.toLowerCase().includes(filterKeyword.toLowerCase()) || j.dept.toLowerCase().includes(filterKeyword.toLowerCase())) &&
           (filterDept === "" || j.dept === filterDept) &&
           (filterStatus === "" || j.status === filterStatus);
  });
  
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const viewJob = jobs.find(j => j.id === viewJobId);
  const applicantsForViewJob = apps.filter(a => a.jobId === viewJobId);
  const myApps = apps.filter(a => a.applicant === currentUser);
  const myPostedJobs = jobs.filter(j => j.creator === currentUser);

  // --- LOGIN SCREEN (Original Style) ---
  if (!logged) {
    return (
      <div className="login-screen" style={{
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif"
      }}>
        <div className="login-card" style={{
          background: 'white', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -10px rgba(0, 0, 0, 0.1)', width: '550px', padding: '80px 60px', borderRadius: '24px', textAlign: 'center'
        }}>
          <div style={{marginBottom: '30px'}}>
             <div style={{width: 80, height: 80, background: '#1f2937', borderRadius: '16px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{color: 'white', fontWeight: 900, fontSize: '32px'}}>HR</span>
             </div>
          </div>
          <h2 style={{ marginBottom: '10px', fontSize: '36px', color: '#111827', fontWeight: 800, letterSpacing: '-0.03em' }}>Welcome Back</h2>
          <p style={{marginBottom: '50px', color: '#6b7280', fontSize: '18px'}}>Sign in to access the Job Portal</p>
          
          <div style={{marginBottom: '25px', textAlign: 'left'}}>
             <label style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: '#374151', fontSize: '16px'}}>Username (Your Name)</label>
             <input className="input-login" placeholder="Enter your username" value={currentUser} onChange={e=>setCurrentUser(e.target.value)} style={{ width: '100%', padding: '18px 20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e5e7eb', background: '#f9fafb', transition: 'all 0.2s', boxSizing: 'border-box' }}/>
          </div>
          <div style={{marginBottom: '50px', textAlign: 'left'}}>
             <label style={{display: 'block', marginBottom: '10px', fontWeight: 600, color: '#374151', fontSize: '16px'}}>Password</label>
             <input className="input-login" placeholder="Enter your password" type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{ width: '100%', padding: '18px 20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e5e7eb', background: '#f9fafb', transition: 'all 0.2s', boxSizing: 'border-box' }}/>
          </div>
          <button onClick={handleLogin} style={{ width: '100%', padding: '20px', fontSize: '20px', fontWeight: 700, background: '#111827', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.1s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Sign In</button>
        </div>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div className="app">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999,
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white', padding: '16px 24px', borderRadius: '10px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: 600,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {toast.type === 'success' && <IconCheckCircle />}
          {toast.message}
        </div>
      )}

      {/* SIDEBAR (Original Style) */}
      <div className="sidebar" style={{background: '#111827', color: 'white', width: '280px', display: 'flex', flexDirection: 'column'}}>
        <div className="profile" style={{borderBottom: '1px solid #374151', padding: '30px 20px', marginBottom: 20}}>
          <img src="/Chaweewan.png" className="profile-pic" alt="User" style={{width: 60, height: 60, border: '3px solid #4b5563', borderRadius: '50%', objectFit: 'cover', marginBottom: 15}} />
          <div>
            <div className="profile-name" style={{color: 'white', fontSize: '18px', fontWeight: 600}}>{profile.name}</div>
            <div className="profile-role" style={{color: '#9ca3af', fontSize: '14px'}}>System User</div>
          </div>
        </div>
        <div className="menu" style={{padding: '0 15px', flex: 1}}>
          <div className={`menu-item-dark ${page==="dashboard"?"active":""}`} onClick={()=>setPage("dashboard")}><IconDashboard /> Dashboard</div>
          <div className={`menu-item-dark ${page==="jobs"?"active":""}`} onClick={()=>setPage("jobs")}><IconJobs /> Job Management</div>
          <div className={`menu-item-dark ${page==="my_apps"?"active":""}`} onClick={()=>setPage("my_apps")}><IconUsers /> My Applications</div>
          <div className={`menu-item-dark ${page==="profile"?"active":""}`} onClick={()=>setPage("profile")}><IconUsers /> Profile</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main" style={{background: '#f3f4f6'}}>
        {/* TOPBAR (Original Style) */}
        <div className="topbar" style={{ background: 'white', borderBottom: '1px solid #e5e7eb', height: '80px', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', margin: 0 }}>
            {page === 'dashboard' ? 'Dashboard' : page === 'jobs' ? 'Job Management' : page === 'my_apps' ? 'My Applications' : 'My Profile'}
          </h2>
          
          <div style={{display:'flex', alignItems:'center', gap: '15px'}}>
             {page === "jobs" && <button className="btn-primary" onClick={() => { setJobForm({ title: "", dept: "", desc: "", requirements: "", responsibilities: "", status: "Open", closingDate: "" }); setEditJobId(-1); }}>+ Post a Job</button>}
             <div style={{width: '1px', height: '30px', background: '#e5e7eb', margin: '0 10px'}}></div>
             <button className="btn-outline btn-logout" onClick={handleLogout} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', color: '#ef4444', borderColor: '#fca5a5'}}>
                <IconLogout /> Logout
             </button>
          </div>
        </div>

        <div className="content" style={{padding: '40px', maxWidth: '1600px', margin: '0 auto'}}>
          
          {/* 1️⃣ DASHBOARD */}
          {page === "dashboard" && (
            <div style={{display:'flex', flexDirection:'column', gap: '30px'}}>
              <div className="stats-grid">
                <div className="stat-box" style={{borderLeft: '5px solid #3b82f6'}}><div className="stat-label">Total Open Jobs</div><div className="stat-num">{jobs.filter(j=>j.status==='Open').length}</div></div>
                <div className="stat-box" style={{borderLeft: '5px solid #8b5cf6'}}><div className="stat-label">My Applications</div><div className="stat-num">{myApps.length}</div></div>
                <div className="stat-box" style={{borderLeft: '5px solid #10b981'}}><div className="stat-label">Jobs I Posted</div><div className="stat-num" style={{color:'#10b981'}}>{myPostedJobs.length}</div></div>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
                <div className="card" style={{padding: '25px'}}>
                  <h3 style={{marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#111827'}}>Recently Posted Jobs</h3>
                  {jobs.slice(0, 5).map(j => (
                    <div key={j.id} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid #f3f4f6'}}>
                      <div><strong style={{color:'#111827'}}>{j.title}</strong> <div style={{fontSize:14, color:'#6b7280', marginTop: 4}}>{j.dept} • {j.date}</div></div>
                      <span className={`badge badge-${j.status}`}>{j.status}</span>
                    </div>
                  ))}
                </div>
                <div className="card" style={{padding: '25px'}}>
                  <h3 style={{marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#111827'}}>Jobs Closing Soon</h3>
                  {jobs.filter(j=>j.status==='Open').slice(0, 5).map(j => (
                    <div key={j.id} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid #f3f4f6'}}>
                      <div><strong style={{color: '#111827'}}>{j.title}</strong><div style={{fontSize:14, color:'#6b7280', marginTop: 4}}>{j.creator}</div></div>
                      <div style={{color:'#ef4444', fontWeight:600}}>{j.closingDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2️⃣ JOB LIST */}
          {page === "jobs" && (
            <>
              {/* Search & Filter Section */}
              <div className="search-section" style={{padding: '20px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                 <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                    <div style={{color:'#9ca3af', marginLeft: '10px'}}><IconSearch /></div>
                    <input className="input" style={{border:'none', boxShadow:'none', fontSize: '16px', flex: 1}} placeholder="Search by title or department..." value={searchInput} onChange={e => setSearchInput(e.target.value)}/>
                 </div>
                 
                 <select className="input" style={{width: '200px'}} value={filterDept} onChange={e=>setFilterDept(e.target.value)}>
                    <option value="">All Departments</option>
                    {Array.from(new Set(jobs.map(j=>j.dept))).map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
                 
                 <select className="input" style={{width: '180px'}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Draft">Draft</option>
                 </select>

                 <button className="btn-primary" onClick={() => setFilterKeyword(searchInput)} style={{padding: '10px 20px'}}>Search</button>
                 
                 {(filterKeyword || filterDept || filterStatus) && (
                    <button className="btn-outline" onClick={() => { setSearchInput(""); setFilterKeyword(""); setFilterDept(""); setFilterStatus(""); }} style={{padding: '10px 20px'}}>
                        Clear
                    </button>
                 )}
              </div>
              
              <div className="card">
                <table className="formal-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Date Posted</th>
                      <th>Closing Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentJobs.map(j => (
                      <tr key={j.id} className="clickable-row" onClick={() => setViewJobId(j.id)} title="Click to view details">
                        <td style={{fontWeight: 700, color: '#1f2937', fontSize: '16px'}}>
                            {j.title} 
                            {j.creator === currentUser && <span style={{fontSize:12, background:'#f3f4f6', color:'#374151', padding:'2px 8px', borderRadius:4, marginLeft:8, border: '1px solid #e5e7eb'}}>My Post</span>}
                        </td>
                        <td style={{fontSize: '15px'}}>{j.dept}</td>
                        <td><span className={`badge badge-${j.status}`}>{j.status}</span></td>
                        <td style={{fontSize: '15px'}}>{j.date}</td>
                        <td style={{fontSize: '15px', color: '#ef4444'}}>{j.closingDate}</td>
                        <td><button className="btn-outline" onClick={(e) => { e.stopPropagation(); setViewJobId(j.id); }}>Details</button></td>
                      </tr>
                    ))}
                    {currentJobs.length === 0 && <tr><td colSpan={6} style={{textAlign:'center', padding:40, color:'#6b7280', fontSize:'16px'}}>No jobs found.</td></tr>}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', gap: '8px' }}>
                  <button className="btn-page" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt; Prev</button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} className={`btn-page ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  ))}
                  <button className="btn-page" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next &gt;</button>
                </div>
              )}
            </>
          )}

          {/* 6️⃣ MY APPLICATIONS */}
          {page === "my_apps" && (
            <div className="card">
              <table className="formal-table">
                <thead><tr><th>Job Title</th><th>Company / Creator</th><th>Date Applied</th><th>Status</th></tr></thead>
                <tbody>
                  {myApps.map(a => (
                    <tr key={a.id}>
                      <td style={{fontWeight: 700, color: '#1f2937', fontSize: '16px'}}>{a.jobTitle}</td>
                      <td style={{fontSize: '15px'}}>{a.creatorOfJob}</td>
                      <td style={{fontSize: '15px'}}>{a.date}</td>
                      <td>
                        {a.status === 'Pending' ? <span style={{color:'#6b7280', fontSize:14, fontStyle:'italic'}}>Wait for Action</span> : 
                        <span className={`badge badge-${a.status}`}>{a.status}</span>}
                      </td>
                    </tr>
                  ))}
                  {myApps.length === 0 && <tr><td colSpan={4} style={{textAlign:'center', padding:40, color:'#6b7280', fontSize:'16px'}}>You haven't applied to any jobs yet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* 7️⃣ PROFILE */}
          {page === "profile" && (
            <div className="card" style={{padding: '40px', maxWidth: '600px', margin: '0 auto'}}>
              <h3 style={{marginBottom: 20, color: '#111827'}}>My Profile</h3>
              <div style={{display:'grid', gap:20}}>
                <div><label className="label">Full Name</label><input className="input" value={profile.name} disabled style={{background:'#f3f4f6', cursor:'not-allowed'}}/></div>
                <div><label className="label">Phone Number</label><input className="input" value={profile.phone} onChange={e=>setProfile({...profile, phone: e.target.value})}/></div>
                <div><label className="label">Resume Link (GDrive / LinkedIn)</label><input className="input" value={profile.resume} onChange={e=>setProfile({...profile, resume: e.target.value})}/></div>
                <div><label className="label">Change Password</label><input className="input" type="password" value={profile.password} onChange={e=>setProfile({...profile, password: e.target.value})}/></div>
                <button className="btn-primary" onClick={()=>showToast("Profile Saved!")}>Save Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 3️⃣ JOB DETAILS MODAL */}
      {viewJobId && viewJob && (
        <div className="modal-overlay" onClick={()=>setViewJobId(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()} style={{padding: '40px', maxWidth: '800px'}}>
            <div className="close-icon" onClick={()=>setViewJobId(null)}><IconClose /></div>
            <h3 style={{fontSize:24, borderBottom:'1px solid #eee', paddingBottom:15, marginBottom:20, fontWeight: 700, color: '#111827'}}>Job Details</h3>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 25}}>
              <div>
                <h2 style={{fontSize:28, color:'#1f2937', margin:'0 0 8px 0', fontWeight: 700}}>{viewJob.title}</h2>
                <div style={{color:'#6b7280', fontSize:16, fontWeight: 500}}>
                  Dept: {viewJob.dept} • Posted on {viewJob.date} • Closing Date: <strong style={{color:'#ef4444'}}>{viewJob.closingDate}</strong>
                </div>
              </div>
              <span className={`badge badge-${viewJob.status}`} style={{fontSize:14, padding:'8px 16px'}}>{viewJob.status}</span>
            </div>

            <div style={{background:'#f9fafb', padding:25, borderRadius:8, marginBottom:30, border: '1px solid #e5e7eb'}}>
               <div style={{marginBottom: 15}}><strong style={{color:'#374151', fontSize: 16}}>Job Description:</strong><p style={{margin:'5px 0 0 0', color:'#4b5563', lineHeight:1.6}}>{viewJob.desc}</p></div>
               <div style={{marginBottom: 15}}><strong style={{color:'#374151', fontSize: 16}}>Responsibilities:</strong><p style={{margin:'5px 0 0 0', color:'#4b5563', lineHeight:1.6}}>{viewJob.responsibilities || '-'}</p></div>
               <div><strong style={{color:'#374151', fontSize: 16}}>Requirements:</strong><p style={{margin:'5px 0 0 0', color:'#4b5563', lineHeight:1.6}}>{viewJob.requirements || '-'}</p></div>
            </div>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop: '1px solid #e5e7eb', paddingTop: 20}}>
                <div style={{fontSize: 16, color: '#374151', fontWeight: 600}}>
                  Applicants: {applicantsForViewJob.length} People
                </div>

                <div className="modal-actions" style={{margin:0, display: 'flex', gap: 10}}>
                  {viewJob.creator === currentUser ? (
                    // สำหรับคนสร้างงาน (Edit / Close)
                    <>
                      <button className="btn-outline" onClick={() => { setViewJobId(null); setEditJobId(viewJob.id); setJobForm(viewJob); }}>Edit Job</button>
                      <button className={viewJob.status === "Open" ? "btn-danger-outline" : "btn-primary"} onClick={() => handleToggleJobStatus(viewJob)}>
                        {viewJob.status === "Open" ? "Close Job (ปิดรับสมัคร)" : "Re-open Job"}
                      </button>
                    </>
                  ) : (
                    // สำหรับคนสมัครงาน (Apply)
                    viewJob.status === "Open" && (
                      <button className="btn-primary" onClick={() => { setViewJobId(null); setApplyJobId(viewJob.id); setApplyForm({...applyForm, resumeLink: profile.resume}); }}>
                        Apply for this Job
                      </button>
                    )
                  )}
                </div>
            </div>

            {/* ส่วนแสดงผู้สมัคร (เห็นเฉพาะคนสร้างงาน) */}
            {viewJob.creator === currentUser && applicantsForViewJob.length > 0 && (
               <div style={{marginTop: 30}}>
                  <h4 style={{marginBottom: 10, color: '#111827', fontSize: 18}}>Applicant List</h4>
                  <table className="formal-table">
                    <thead><tr><th>Name</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {applicantsForViewJob.map(a => (
                        <tr key={a.id}>
                          <td>{a.applicant}</td>
                          <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                          <td><button className="btn-outline" onClick={() => setManageAppId(a.id)}>Review</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            )}
          </div>
        </div>
      )}

      {/* 4️⃣ CREATE / EDIT JOB MODAL */}
      {editJobId !== null && (
        <div className="modal-overlay" onClick={()=>setEditJobId(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()} style={{padding: '40px', maxWidth: '700px'}}>
            <div className="close-icon" onClick={()=>setEditJobId(null)}><IconClose /></div>
            <h3 style={{fontSize: 24, fontWeight: 700, marginBottom: 25, color: '#111827'}}>{editJobId===-1?"Create New Job":"Edit Job Posting"}</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginTop:10}}>
              <div style={{gridColumn: '1 / -1'}}><label className="label">Job Title</label><input className="input-large" value={jobForm.title} onChange={e=>setJobForm({...jobForm, title:e.target.value})}/></div>
              <div><label className="label">Department</label><input className="input-large" value={jobForm.dept} onChange={e=>setJobForm({...jobForm, dept:e.target.value})}/></div>
              <div><label className="label">Closing Date</label><input className="input-large" type="date" value={jobForm.closingDate} onChange={e=>setJobForm({...jobForm, closingDate:e.target.value})}/></div>
              
              <div style={{gridColumn: '1 / -1'}}><label className="label">Description</label><textarea className="textarea-large" rows={3} value={jobForm.desc} onChange={e=>setJobForm({...jobForm, desc:e.target.value})}/></div>
              <div style={{gridColumn: '1 / -1'}}><label className="label">Responsibilities</label><textarea className="textarea-large" rows={3} value={jobForm.responsibilities} onChange={e=>setJobForm({...jobForm, responsibilities:e.target.value})}/></div>
              <div style={{gridColumn: '1 / -1'}}><label className="label">Requirements</label><textarea className="textarea-large" rows={3} value={jobForm.requirements} onChange={e=>setJobForm({...jobForm, requirements:e.target.value})}/></div>
              
              <div style={{gridColumn: '1 / -1'}}>
                <label className="label">Job Status</label>
                <select className="input-large" value={jobForm.status} onChange={e=>setJobForm({...jobForm, status:e.target.value})}>
                    <option value="Draft">Draft (ร่าง)</option>
                    <option value="Open">Open (เปิดรับสมัคร)</option>
                    <option value="Closed">Closed (ปิดรับสมัคร)</option>
                </select>
              </div>
            </div>
            <div style={{marginTop: 30, textAlign:'right'}}>
               <button className="btn-primary-large" onClick={handleSaveJob}>Save Job</button>
            </div>
          </div>
        </div>
      )}

      {/* 5️⃣ APPLY JOB MODAL */}
      {applyJobId && (
        <div className="modal-overlay" onClick={()=>setApplyJobId(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()} style={{padding: '40px', maxWidth: '500px'}}>
            <div className="close-icon" onClick={()=>setApplyJobId(null)}><IconClose /></div>
            <h3 style={{fontSize: 24, fontWeight: 700, marginBottom: 25, color: '#111827'}}>Apply for Job</h3>
            <div style={{background:'#f3f4f6', padding:15, borderRadius:8, marginBottom:20, color:'#374151', border: '1px solid #e5e7eb'}}>
               Applying as: <strong>{profile.name}</strong><br/>
               Phone: {profile.phone}
            </div>
            <div style={{display:'grid', gap:20}}>
              <div><label className="label">Resume Link</label><input className="input-large" value={applyForm.resumeLink} onChange={e=>setApplyForm({...applyForm, resumeLink:e.target.value})} placeholder="URL to your resume"/></div>
              <div><label className="label">Why should we hire you?</label><textarea className="textarea-large" rows={4} value={applyForm.reason} onChange={e=>setApplyForm({...applyForm, reason:e.target.value})}/></div>
              <button className="btn-primary-large" onClick={handleApply}>Submit Application</button>
            </div>
          </div>
        </div>
      )}

      {/* 👑 MANAGE APPLICATION MODAL (For Creator) */}
      {manageAppId && (
        <div className="modal-overlay" onClick={()=>setManageAppId(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()} style={{padding: '40px', maxWidth: '600px'}}>
            <div className="close-icon" onClick={()=>setManageAppId(null)}><IconClose /></div>
            <h3 style={{fontSize:24, borderBottom:'1px solid #eee', paddingBottom:15, marginBottom:20, fontWeight: 700, color: '#111827'}}>Review Application</h3>
            {apps.filter(a=>a.id === manageAppId).map(a => (
              <div key={a.id} style={{display:'grid', gap:20}}>
                 <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 30}}>
                    <div><label className="label" style={{color:'#6b7280', textTransform:'uppercase'}}>Applicant</label><div style={{fontWeight:700, fontSize:'18px'}}>{a.applicant}</div></div>
                    <div><label className="label" style={{color:'#6b7280', textTransform:'uppercase'}}>Phone</label><div style={{fontSize:'16px'}}>{a.phone}</div></div>
                 </div>
                 
                 <div>
                    <label className="label" style={{color:'#6b7280', textTransform:'uppercase'}}>Resume</label>
                    <a href={a.resume} target="_blank" style={{color:'#3b82f6', fontWeight: 600}}>View Resume Link</a>
                 </div>
                 
                 <div>
                    <label className="label" style={{color:'#6b7280', textTransform:'uppercase'}}>Reason</label>
                    <div style={{background:'#f9fafb', padding:15, borderRadius:8, border: '1px solid #e5e7eb'}}>{a.reason}</div>
                 </div>
                 
                 <div style={{borderTop:'1px solid #e5e7eb', paddingTop:20, marginTop: 10}}>
                    <label className="label" style={{marginBottom: 15}}>Update Application Status</label>
                    <div style={{display:'flex', gap:15}}>
                       <button className="btn-outline" style={{flex:1}} onClick={()=>handleUpdateAppStatus(a.id, 'Interview')}>Call Interview</button>
                       <button className="btn-outline" style={{flex:1, color:'#059669', borderColor:'#10b981'}} onClick={()=>handleUpdateAppStatus(a.id, 'Accepted')}>Accept</button>
                       <button className="btn-outline" style={{flex:1, color:'#dc2626', borderColor:'#ef4444'}} onClick={()=>handleUpdateAppStatus(a.id, 'Rejected')}>Reject</button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Styles (Original 100%) */}
      <style jsx global>{`
        @keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        body { background: #f3f4f6; color: #1f2937; margin: 0; padding: 0; }
        .app { display: flex; min-height: 100vh; }
        .sidebar { flex-shrink: 0; }
        .main { flex-grow: 1; display: flex; flexDirection: column; width: calc(100% - 280px); }
        .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden; }
        
        .label { display: block; margin-bottom: 8px; font-weight: 600; color: #374151; }
        .input, .textarea, select { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px 16px; font-size: 15px; width: 100%; transition: all 0.2s; background: white; box-sizing: border-box;}
        .input-large, .textarea-large { border: 1px solid #d1d5db; border-radius: 8px; padding: 14px 18px; font-size: 16px; width: 100%; transition: all 0.2s; background: white; box-sizing: border-box;}
        .input:focus, .textarea:focus, .input-large:focus, select:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .input-login:focus { border-color: #111827 !important; box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1) !important; }
        
        .btn-primary { background: #111827; color: white; border: none; border-radius: 8px; padding: 12px 24px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 14px; }
        .btn-primary-large { background: #111827; color: white; border: none; border-radius: 8px; padding: 14px 28px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 16px; width: 100%; }
        .btn-primary:hover, .btn-primary-large:hover { background: #374151; transform: translateY(-1px); }
        
        .btn-outline { background: white; border: 1px solid #d1d5db; color: #374151; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-outline:hover { background: #f9fafb; border-color: #9ca3af; color: #111827; }
        .btn-logout:hover { background: #fef2f2 !important; border-color: #ef4444 !important; }

        .btn-danger-outline { background: white; border: 1px solid #fca5a5; color: #dc2626; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-danger-outline:hover { background: #fef2f2; border-color: #f87171; }

        .btn-text-danger { background: none; border: none; color: #ef4444; cursor: pointer; text-decoration: underline; transition: 0.2s; }
        .btn-text-danger:hover { color: #dc2626; }

        .btn-page { background: white; border: 1px solid #e5e7eb; color: #374151; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.2s; }
        .btn-page:hover:not(:disabled) { background: #f3f4f6; }
        .btn-page.active { background: #111827; color: white; border-color: #111827; }
        .btn-page:disabled { opacity: 0.5; cursor: not-allowed; }

        .menu-item-dark { padding: 16px 20px; cursor: pointer; display: flex; align-items: center; gap: 16px; color: #d1d5db; border-radius: 8px; transition: 0.2s; margin-bottom: 6px; font-size: 15px; }
        .menu-item-dark:hover { background: #374151; color: white; }
        .menu-item-dark.active { background: #374151; color: white; font-weight: 700; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }

        .formal-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 15px; }
        .formal-table th { text-align: left; padding: 18px 24px; background: #f9fafb; color: #4b5563; font-weight: 700; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
        .formal-table td { padding: 20px 24px; border-bottom: 1px solid #f3f4f6; color: #4b5563; vertical-align: middle; }
        .formal-table tr:last-child td { border-bottom: none; }
        
        .clickable-row { cursor: pointer; transition: background 0.2s; }
        .clickable-row:hover td { background: #f9fafb; }
        
        .badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 12px; border-radius: 99px; font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
        .badge-Open, .badge-Passed, .badge-Accepted { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .badge-Closed, .badge-Failed, .badge-Rejected { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .badge-Archived, .badge-Draft { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }
        .badge-Pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
        .badge-Interview { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

        .stats-grid { display: flex; gap: 30px; margin-bottom: 30px; }
        .stat-box { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; flex: 1; transition: transform 0.2s; }
        .stat-box:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
        .stat-label { font-size: 14px; color: #6b7280; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-num { font-size: 36px; font-weight: 800; color: #111827; line-height: 1; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .modal-content { background: white; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); position: relative; width: 100%; max-height: 90vh; overflow-y: auto; }
        .close-icon { position: absolute; top: 20px; right: 20px; cursor: pointer; transition: 0.2s; }
        .close-icon:hover { transform: scale(1.1); }
      `}</style>
    </div>
  );
}
