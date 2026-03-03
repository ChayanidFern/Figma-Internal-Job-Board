"use client";

import { useState, useEffect } from "react";
import { Job, Application, UserProfile } from "../types";
import { IconLogout, IconCheckCircle, IconClose } from "../components/icons";

import LoginScreen from "../components/LoginScreen";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import ApplicantList from "../components/ApplicantList";
import JobManagement from "../components/JobManagement";

// นำเข้า Actions ที่สร้างไว้
import { getData, saveJobAction, deleteJobAction, updateAppStatusAction } from "./actions";

export default function Page() {
  const [logged, setLogged] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [profile, setProfile] = useState<UserProfile>({ name: "", phone: "081-234-5678", resume: "https://drive.google.com/resume", password: "123" });

  const [page, setPage] = useState<"dashboard" | "jobs" | "applicant">("dashboard");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Modals
  const [viewJobId, setViewJobId] = useState<number | null>(null);
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [applyJobId, setApplyJobId] = useState<number | null>(null);

  const [jobForm, setJobForm] = useState({ 
    title: "", dept: "", desc: "", requirements: "", responsibilities: "", 
    status: "Open", closingDate: "", openDate: "" 
  });
  const [applyForm, setApplyForm] = useState({ reason: "", resumeLink: "" });

  // ดึงข้อมูลจริงจาก DB เมื่อ Login สำเร็จ
  useEffect(() => {
    if (logged) {
      const fetchDB = async () => {
        try {
          const { jobs, apps } = await getData();
          setJobs(jobs as any);
          setApps(apps as any);
          setProfile(prev => ({ ...prev, name: currentUser }));
        } catch (error) {
          showToast("Failed to fetch data", "error");
        }
      };
      fetchDB();
    }
  }, [logged, currentUser]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // อัปเดตสถานะผู้สมัครลง DB
  const handleUpdateAppStatus = async (id: number, status: string) => {
    try {
      await updateAppStatusAction(id, status);
      setApps(apps.map(a => a.id === id ? { ...a, status } : a));
      showToast(`Status updated to ${status}`);
    } catch (error) {
      showToast("Update failed", "error");
    }
  };

  // ลบข้อมูลผู้สมัคร (Mock-up logic สำหรับใบสมัคร)
  const handleDeleteApplication = (id: number) => {
    if (confirm("ยืนยันว่าลบจริงๆใช่ไหม? ลบแล้วไม่สามารถกู้คืนได้นะ")) {
      setApps(apps.filter(a => a.id !== id));
      showToast("ลบข้อมูลเรียบร้อยแล้ว", "error");
    }
  };

  // ลบงานจาก DB
  const handleDeleteJob = async (id: number) => {
    if (confirm("ยืนยันการลบจริงๆใช่ไหม?")) {
      try {
        await deleteJobAction(id);
        setJobs(jobs.filter(j => j.id !== id));
        setApps(apps.filter(a => a.jobId !== id));
        showToast("ลบงานเรียบร้อยแล้ว", "error");
      } catch (error) {
        showToast("Delete failed", "error");
      }
    }
  };

  // บันทึกหรือแก้ไขงานลง DB
  const handleSaveJob = async () => {
    if (!jobForm.title) { showToast("Title required", "error"); return; }
    try {
      await saveJobAction(editJobId, jobForm, currentUser);
      
      // ดึงข้อมูลล่าสุดหลังบันทึก
      const { jobs: updatedJobs } = await getData();
      setJobs(updatedJobs as any);
      
      showToast(editJobId === -1 ? "Job Created" : "Job Updated");
      setEditJobId(null);
    } catch (error) {
      showToast("Save failed", "error");
    }
  };

  const handleApply = () => {
    const job = jobs.find(j => j.id === applyJobId);
    if (job) {
      setApps([{ id: Date.now(), jobId: job.id, jobTitle: job.title, applicant: currentUser, email: `${currentUser}@mail.com`, phone: profile.phone, resume: applyForm.resumeLink, reason: applyForm.reason, status: "Pending", date: "03/03/2026", creatorOfJob: job.creator }, ...apps]);
      showToast("Applied!");
      setApplyJobId(null);
    }
  };

  if (!logged) return <LoginScreen onLogin={(u) => { setCurrentUser(u); setLogged(true); }} />;

  return (
    <div className="app">
      {toast && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, background: toast.type === 'success' ? '#10b981' : '#ef4444', color: 'white', padding: '16px 24px', borderRadius: '10px', display: 'flex', gap: '12px' }}>
          {toast.type === 'success' && <IconCheckCircle />} {toast.message}
        </div>
      )}

      <Sidebar page={page} setPage={setPage} profileName={profile.name} />

      <div className="main">
        <div className="topbar" style={{ background: 'white', borderBottom: '1px solid #e5e7eb', height: '80px', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>{page === 'dashboard' ? 'Dashboard' : page === 'jobs' ? 'Job Management' : 'Applicant'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {page === "jobs" && (
              <button 
                className="btn-primary" 
                onClick={() => { 
                  setEditJobId(-1); 
                  setJobForm({ title: "", dept: "", desc: "", requirements: "", responsibilities: "", status: "Open", closingDate: "", openDate: "" }); 
                }}
              >
                + Post a Job
              </button>
            )}
            <button className="btn-outline btn-logout" onClick={() => setLogged(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconLogout /> Logout
            </button>
          </div>
        </div>

        <div className="content">
          {page === "dashboard" && <Dashboard jobs={jobs} myApps={apps.filter(a => a.applicant === currentUser)} myPostedJobs={jobs.filter(j => j.creator === currentUser)} />}
          {page === "applicant" && <ApplicantList apps={apps} onUpdateStatus={handleUpdateAppStatus} onDelete={handleDeleteApplication} />}
          {page === "jobs" && (
            <JobManagement 
              jobs={jobs}
              currentUser={currentUser}
              onViewJob={setViewJobId}
              onDeleteJob={handleDeleteJob}
            />
          )}
        </div>
      </div>

      {/* View Job Modal */}
      {viewJobId && (
        <div className="modal-overlay" onClick={() => setViewJobId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '40px', maxWidth: '820px' }}>
            <div className="close-icon" onClick={() => setViewJobId(null)}><IconClose /></div>
            {jobs.filter(j => j.id === viewJobId).map(j => (
              <div key={j.id}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>View Job : {j.title}</h2>
                <div style={{ margin: '24px 0', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                  <p><strong>Department:</strong> {j.dept}</p>
                  <p><strong>Open Date:</strong> {j.openDate || j.date}</p>
                  <p><strong>Closed Date:</strong> {j.closingDate}</p>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ marginBottom: '12px' }}>Job Description:</h4>
                  <p style={{ lineHeight: '1.7', color: '#374151' }}>{j.desc}</p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '12px' }}>Qualifications:</h4>
                  <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                    {j.requirements?.split('\n').map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                <div style={{ marginTop: '40px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  {j.creator === currentUser ? (
                    <>
                      <button className="btn-outline" onClick={() => { setViewJobId(null); setEditJobId(j.id); setJobForm({ ...jobForm, ...j }); }}>Edit</button>
                      <button className="btn-outline" style={{ background: '#ef4444', color: 'white', border: 'none' }} onClick={() => { setViewJobId(null); handleDeleteJob(j.id); }}>Archive</button>
                    </>
                  ) : j.status === "Open" && (
                    <button className="btn-primary" onClick={() => { setViewJobId(null); setApplyJobId(j.id); }}>Apply Now</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit / Create Job Modal */}
      {editJobId !== null && (
        <div className="modal-overlay" onClick={() => setEditJobId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '40px', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="close-icon" onClick={() => setEditJobId(null)}><IconClose /></div>
            <h3 style={{ fontSize: 24, marginBottom: 24 }}>{editJobId === -1 ? "Create New Job" : "Edit Job"}</h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Job Title</label><input className="input" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} /></div>
              <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Department</label><input className="input" value={jobForm.dept} onChange={e => setJobForm({ ...jobForm, dept: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Open Date</label><input type="date" className="input" value={jobForm.openDate} onChange={e => setJobForm({ ...jobForm, openDate: e.target.value })} /></div>
                <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Close Date</label><input type="date" className="input" value={jobForm.closingDate} onChange={e => setJobForm({ ...jobForm, closingDate: e.target.value })} /></div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Status</label>
                <select className="input" value={jobForm.status} onChange={e => setJobForm({ ...jobForm, status: e.target.value })}>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Job Description</label><textarea className="input" rows={6} value={jobForm.desc} onChange={e => setJobForm({ ...jobForm, desc: e.target.value })} /></div>
              <button className="btn-primary-large" onClick={handleSaveJob}>{editJobId === -1 ? "Create Job" : "Update Job"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyJobId && (
        <div className="modal-overlay" onClick={() => setApplyJobId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '40px', maxWidth: '500px' }}>
            <div className="close-icon" onClick={() => setApplyJobId(null)}><IconClose /></div>
            <h3>Apply</h3>
            <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
              <input className="input" placeholder="Resume Link" value={applyForm.resumeLink} onChange={e => setApplyForm({ ...applyForm, resumeLink: e.target.value })} />
              <button className="btn-primary-large" onClick={handleApply}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}