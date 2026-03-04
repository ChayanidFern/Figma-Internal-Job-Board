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
import CreateJobModal from "../components/CreateJobModal";
import JobDetailModal from "../components/JobDetailModal"; // ✅ Import Modal ดูรายละเอียด
import { 
  getData, getUserProfile, updateAppStatusAction, deleteApplicationAction, 
  deleteJobAction, createJob, updateJobStatus // ✅ Import action อัปเดตสถานะ
} from "./actions";

export default function Page() {
  const [logged, setLogged] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [page, setPage] = useState<"dashboard"|"jobs"|"applicant"|"profile">("dashboard");
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // State สำหรับ Modal สร้างงาน
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  
  // ✅ State สำหรับ Modal ดูรายละเอียดงาน (เก็บเป็น Object Job)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // ฟังก์ชันโหลดข้อมูลกลาง
  const refreshData = async () => {
    const data = await getData();
    setJobs(data.jobs as any);
    setApps(data.apps as any);
  };

  useEffect(() => {
    if (logged) {
      refreshData();
      getUserProfile(currentUser).then(data => setUserProfile(data));
    }
  }, [logged, currentUser, page]);

  // ฟังก์ชันจัดการการสร้างงาน
  const handleCreateJob = async (jobData: any) => {
    const result = await createJob(jobData, currentUser);
    if (result.success) {
      await refreshData();
      setShowCreateJobModal(false);
      alert("Job created successfully!");
    } else {
      alert("Failed to create job");
    }
  };

  if (!logged) return <LoginScreen onLogin={(u) => {setCurrentUser(u); setLogged(true);}} />;

  return (
    <div className="app" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar page={page} setPage={setPage} profileName={currentUser} userProfile={userProfile} />
      
      <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div className="topbar" style={{ background: 'white', borderBottom: '1px solid #e2e8f0', height: 80, padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
            {page === 'jobs' ? 'Job Management' : page.charAt(0).toUpperCase() + page.slice(1)}
          </h2>
          <button 
            onClick={() => setLogged(false)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, 
              padding: '8px 16px', border: '1px solid #e2e8f0', 
              borderRadius: 8, background: 'white', cursor: 'pointer', 
              color: '#64748b', fontWeight: 600 
            }}
          >
            <IconLogout/> Logout
          </button>
        </div>

        {/* Content Area */}
        <div className="content" style={{ padding: '40px', flex: 1, overflowY: 'auto' }}>
          
          {page === "dashboard" && (
            <Dashboard 
              jobs={jobs} 
              myApps={apps.filter(a => a.applicant === currentUser)} 
              myPostedJobs={jobs.filter(j => j.creator === currentUser)} 
            />
          )}

          {page === "applicant" && (
            <ApplicantList 
              apps={apps} 
              onUpdateStatus={async (id, s) => { await updateAppStatusAction(id, s); refreshData(); }} 
              onDelete={async (id) => { if (confirm("Delete this application?")) { await deleteApplicationAction(id); refreshData(); } }} 
            />
          )}

          {page === "jobs" && (
            <>
              <JobManagement 
                jobs={jobs} 
                currentUser={currentUser} 
                // ✅ 1. ส่ง Job Object ไปที่ State เพื่อเปิด Modal
                onViewJob={(job) => setSelectedJob(job)} 
                onDeleteJob={async (id) => { await deleteJobAction(id); refreshData(); }}
                onAddJob={() => setShowCreateJobModal(true)}
                // ✅ 2. เชื่อมต่อฟังก์ชันอัปเดตสถานะ
                onUpdateStatus={async (id, status) => { 
                  await updateJobStatus(id, status); 
                  refreshData(); 
                }}
              />
              
              {/* Modal สร้างงาน */}
              {showCreateJobModal && (
                <CreateJobModal 
                  onClose={() => setShowCreateJobModal(false)}
                  onSubmit={handleCreateJob}
                />
              )}

              {/* ✅ 3. Modal ดูรายละเอียดงาน (แสดงเมื่อมีข้อมูลใน selectedJob) */}
              {selectedJob && (
                <JobDetailModal 
                  job={selectedJob} 
                  onClose={() => setSelectedJob(null)} 
                />
              )}
            </>
          )}

          {page === "profile" && (
            <ProfilePage currentUser={currentUser} />
          )}

        </div>
      </div>
    </div>
  );
}