"use client";
import { useState, useEffect } from "react";
import { Job, Application } from "../types";
import { IconLogout } from "../components/icons";
import LoginScreen from "../components/LoginScreen";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import ApplicantList from "../components/ApplicantList";
import JobManagement from "../components/JobManagement";
import ProfilePage from "../components/ProfilePage"; 
import { getData, getUserProfile, updateAppStatusAction, deleteApplicationAction, deleteJobAction } from "./actions";

export default function Page() {
  const [logged, setLogged] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [page, setPage] = useState<"dashboard"|"jobs"|"applicant"|"profile">("dashboard");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [viewJobId, setViewJobId] = useState<number | null>(null);

  useEffect(() => {
    if (logged) {
      getData().then(data => { setJobs(data.jobs as any); setApps(data.apps as any); });
      getUserProfile(currentUser).then(data => setUserProfile(data));
    }
  }, [logged, currentUser, page]);

  if (!logged) return <LoginScreen onLogin={(u) => {setCurrentUser(u); setLogged(true);}} />;

  return (
    <div className="app" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar page={page} setPage={setPage} profileName={currentUser} userProfile={userProfile} />
      <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="topbar" style={{ background: 'white', borderBottom: '1px solid #ddd', height: 80, padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>{page.charAt(0).toUpperCase() + page.slice(1)}</h2>
          <button className="btn-outline" onClick={() => setLogged(false)}><IconLogout/> Logout</button>
        </div>
        <div className="content" style={{ padding: '40px', flex: 1, overflowY: 'auto' }}>
          {page === "dashboard" && <Dashboard jobs={jobs} myApps={apps.filter(a => a.applicant === currentUser)} myPostedJobs={jobs.filter(j => j.creator === currentUser)} />}
          {page === "applicant" && (
            <ApplicantList 
              apps={apps} 
              onUpdateStatus={async (id, s) => { await updateAppStatusAction(id, s); const d = await getData(); setApps(d.apps as any); }} 
              onDelete={async (id) => { if (confirm("Delete this application?")) { await deleteApplicationAction(id); const d = await getData(); setApps(d.apps as any); } }} 
            />
          )}
          {page === "jobs" && <JobManagement jobs={jobs} currentUser={currentUser} onViewJob={setViewJobId} onDeleteJob={async (id) => { await deleteJobAction(id); const d = await getData(); setJobs(d.jobs as any); }} />}
          {page === "profile" && <ProfilePage currentUser={currentUser} />}
        </div>
      </div>
    </div>
  );
}