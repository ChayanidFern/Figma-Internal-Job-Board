"use client";

import React, { useState } from 'react';
import { IconSearch, IconTrash } from "./icons";
import { Job } from "../types";

interface JobManagementProps {
  jobs: Job[];
  currentUser: string;
  onViewJob: (job: Job) => void; // ✅ แก้: ส่ง object Job ทั้งก้อนไปเลยเพื่อความง่าย
  onDeleteJob: (id: number) => void;
  onAddJob: () => void;
  onUpdateStatus: (id: number, status: string) => void; // ✅ เพิ่ม: รับฟังก์ชันเปลี่ยนสถานะ
}

export default function JobManagement({ jobs, currentUser, onViewJob, onDeleteJob, onAddJob, onUpdateStatus }: JobManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayJobs = searchTerm ? filteredJobs : jobs;

  return (
    <div style={{ padding: '20px' }}>
      
      {/* Header: Search + Create Button */}
      <div style={{ marginBottom: '20px', background: 'white', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}><IconSearch /></span>
          <input 
            style={{ width: '96%', padding: '12px 12px 12px 42px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', background: '#f9fafb' }}
            placeholder="Search job title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={onAddJob} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span> Create Job
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <table className="formal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', color: '#4b5563' }}>Job Title</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#4b5563' }}>Department</th>
              <th style={{ padding: '16px', textAlign: 'center', color: '#4b5563' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'center', color: '#4b5563' }}>Action</th>
              <th style={{ padding: '16px', textAlign: 'right', color: '#4b5563' }}>Date</th>
            </tr>
          </thead>
          <tbody style={{ divideY: '1px solid #e5e7eb' }}>
            {displayJobs.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{job.title}</td>
                <td style={{ padding: '16px', color: '#4b5563' }}>{job.dept}</td>
                
                {/* ✅ ส่วนแก้ไขสถานะ */}
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  {job.creator === currentUser ? (
                    // ถ้าเป็นคนสร้างงาน สามารถเปลี่ยนสถานะได้
                    <select 
                      value={job.status} 
                      onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '20px',
                        border: '1px solid #e5e7eb',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: job.status === 'Open' ? '#ecfdf5' : '#fef2f2',
                        color: job.status === 'Open' ? '#059669' : '#dc2626'
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    // ถ้าไม่ใช่คนสร้าง แสดงเป็นป้ายปกติ
                    <span style={{
                      padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: job.status === 'Open' ? '#ecfdf5' : '#fef2f2',
                      color: job.status === 'Open' ? '#059669' : '#dc2626'
                    }}>
                      {job.status}
                    </span>
                  )}
                </td>

                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {/* ปุ่ม View */}
                    <button onClick={() => onViewJob(job)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                      View Details
                    </button>
                    {/* ปุ่ม Delete */}
                    {job.creator === currentUser && (
                      <button onClick={() => { if(confirm("Delete this job?")) onDeleteJob(job.id); }} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                        <IconTrash />
                      </button>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', color: '#6b7280', fontSize: '13px' }}>{job.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}