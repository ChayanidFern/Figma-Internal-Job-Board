"use client";
import { useState, useEffect } from "react";
import { IconLogout, IconLock } from "../components/icons";
import LoginScreen from "../components/LoginScreen";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import ApplicantList from "../components/ApplicantList";
import JobManagement from "../components/JobManagement";
import PublicJobBoard from "../components/PublicJobBoard"; 

import { getData, getUserProfile, updateAppStatusAction, deleteApplicationAction, deleteJobAction, createJobAction, submitPublicApplication } from "./actions";
import { Job, Application } from "../types";

export default function Page() {
  const [viewState, setViewState] = useState<'public' | 'login' | 'admin'>('public');
  const [currentUser, setCurrentUser] = useState("");
  const [page, setPage] = useState<"dashboard"|"jobs"|"applicant">("dashboard");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  const refreshData = async () => {
    const d = await getData();
    setJobs(d.jobs as any);
    setApps(d.apps as any);
  };

  useEffect(() => { refreshData(); }, []);

  useEffect(() => {
    if (viewState === 'admin') {
      getUserProfile(currentUser).then(data => setUserProfile(data));
    }
  }, [viewState, currentUser]);

  if (viewState === 'login') {
    return <LoginScreen 
      onLogin={(u, p) => { setCurrentUser(u); setViewState('admin'); setPage('dashboard'); }} 
      onCancel={() => setViewState('public')} 
    />;
  }

  if (viewState === 'public') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', borderBottom: '1px solid #C9BEFF', height: '80px', padding: '0 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#6367FF', margin: 0, letterSpacing: '-0.5px' }}>
            Job<span style={{ color: '#8494FF' }}>Board</span>
          </h2>
          
          <button 
            onClick={() => setViewState('login')}
            style={{ padding: '10px 20px', background: '#6367FF', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#8494FF'}
            onMouseOut={(e) => e.currentTarget.style.background = '#6367FF'}
          >
            <IconLock /> สำหรับบริษัท
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <PublicJobBoard jobs={jobs} onApply={async (jobId, formData) => { await submitPublicApplication(jobId, formData); await refreshData(); }} />
        </div>
      </div>
    );
  }

  const myPostedJobs = jobs.filter(j => j.creator === currentUser);
  const myPostedJobIds = myPostedJobs.map(j => j.id);
  const applicantsForMyJobs = apps.filter(a => myPostedJobIds.includes(a.jobId));

  return (
    <div className="app" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar page={page} setPage={setPage} profileName={currentUser} userProfile={userProfile} />
      <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="topbar" style={{ background: 'white', borderBottom: '1px solid #C9BEFF', height: 80, padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#6367FF' }}>
            {page === 'dashboard' ? 'ภาพรวมบริษัท' : page === 'jobs' ? 'จัดการประกาศงาน' : 'ผู้สมัครงาน'}
          </h2>
          <button className="btn-outline" onClick={() => { setCurrentUser(""); setViewState('public'); }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #C9BEFF', color: '#6367FF', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconLogout/> ออกจากระบบ
          </button>
        </div>
        <div className="content" style={{ padding: '40px', flex: 1, overflowY: 'auto' }}>
          {page === "dashboard" && <Dashboard jobs={jobs} myApps={[]} myPostedJobs={myPostedJobs} />}
          {page === "jobs" && <JobManagement jobs={jobs} currentUser={currentUser} onCreateJob={async (title, dept, max) => { await createJobAction({ title, dept, creator: currentUser, maxApplicants: max }); refreshData(); }} onDeleteJob={async (id) => { await deleteJobAction(id); refreshData(); }} />}
          {page === "applicant" && <ApplicantList apps={applicantsForMyJobs} onUpdateStatus={async (id, s) => { await updateAppStatusAction(id, s as any); refreshData(); }} onDelete={async (id) => { if (confirm("ลบใบสมัครนี้?")) { await deleteApplicationAction(id); refreshData(); } }} />}
        </div>
      </div>
    </div>
  );
}