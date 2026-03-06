"use client";
import React, { useState } from 'react';
import { IconSearch, IconTrash } from "./icons";
import { Job } from "../types";

interface JobManagementProps {
  jobs: Job[];
  currentUser: string;
  onCreateJob: (title: string, dept: string, max: number) => void;
  onDeleteJob: (id: number) => void;
}

export default function JobManagement({ jobs, currentUser, onCreateJob, onDeleteJob }: JobManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", dept: "", maxApplicants: 1 });

  const employerJobs = jobs.filter(j => j.creator === currentUser);
  const filteredJobs = employerJobs.filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreate = () => {
    if(!newJob.title || !newJob.dept || newJob.maxApplicants < 1) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    onCreateJob(newJob.title, newJob.dept, newJob.maxApplicants);
    setShowModal(false);
    setNewJob({ title: "", dept: "", maxApplicants: 1 });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8494FF' }}><IconSearch /></span>
          <input 
            style={{ width: '94%', padding: '15px 15px 15px 42px', border: '1px solid #C9BEFF', borderRadius: '8px', outline: 'none' }}
            placeholder="ค้นหางาน..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '0 24px', background: '#6367FF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>+ ประกาศรับสมัครงาน</button>
      </div>

      <div className="card" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        <table className="formal-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr><th style={{ padding: '16px' }}>ตำแหน่งงาน</th><th style={{ padding: '16px' }}>จำนวนที่รับ</th><th style={{ padding: '16px', textAlign: 'center' }}>สถานะ</th><th style={{ padding: '16px', textAlign: 'center' }}>Action</th></tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? filteredJobs.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{job.title} <div style={{ fontSize: 12, color: '#8494FF', fontWeight: 'normal' }}>{job.dept}</div></td>
                <td style={{ padding: '16px' }}><strong>{job.acceptedCount}</strong> / {job.maxApplicants}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', background: job.status === 'Open' ? '#FFDBFD' : '#fef2f2', color: job.status === 'Open' ? '#6367FF' : '#dc2626' }}>{job.status === 'Open' ? 'เปิดรับ' : 'ปิดรับ'}</span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button onClick={() => { if(confirm("ต้องการลบงานนี้ใช่หรือไม่?")) onDeleteJob(job.id); }} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><IconTrash /></button>
                </td>
              </tr>
            )) : <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>คุณยังไม่ได้ประกาศงาน</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(99,103,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '400px' }}>
            <h3 style={{ color: '#6367FF', marginTop: 0 }}>สร้างประกาศรับสมัครงาน</h3>
            <div style={{ marginBottom: '15px' }}><label>ชื่อตำแหน่งงาน</label><input style={{ width: '100%', padding: '10px', marginTop: 5, borderRadius: 8, border: '1px solid #C9BEFF', outlineColor: '#6367FF' }} value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} /></div>
            <div style={{ marginBottom: '15px' }}><label>ชื่อบริษัท / แผนก</label><input style={{ width: '100%', padding: '10px', marginTop: 5, borderRadius: 8, border: '1px solid #C9BEFF', outlineColor: '#6367FF' }} value={newJob.dept} onChange={e => setNewJob({...newJob, dept: e.target.value})} /></div>
            <div style={{ marginBottom: '25px' }}><label>จำนวนรับ (คน)</label><input type="number" min="1" style={{ width: '100%', padding: '10px', marginTop: 5, borderRadius: 8, border: '1px solid #C9BEFF', outlineColor: '#6367FF' }} value={newJob.maxApplicants} onChange={e => setNewJob({...newJob, maxApplicants: Number(e.target.value)})} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 15px', border: 'none', background: '#FFDBFD', color: '#6367FF', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>ยกเลิก</button>
              <button onClick={handleCreate} style={{ padding: '10px 15px', border: 'none', background: '#6367FF', color: 'white', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>ประกาศงาน</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}