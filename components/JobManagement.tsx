"use client";

import React, { useState } from 'react';
import { IconSearch, IconTrash, IconBack } from "./icons";
import { Job } from "../types";

interface JobManagementProps {
  jobs: Job[];
  currentUser: string;
  onViewJob: (id: number) => void;
  onDeleteJob: (id: number) => void;
}

export default function JobManagement({ jobs, currentUser, onViewJob, onDeleteJob }: JobManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayJobs = searchTerm ? filteredJobs : jobs;

  return (
    <div style={{ padding: '20px' }}>
      
      {/* ส่วน Search Bar */}
      <div style={{ marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
            <IconSearch />
          </span>
          <input 
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 42px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '14px',
              outline: 'none'
            }}
            placeholder="Search job title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ตารางข้อมูลงาน */}
      <div className="card" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <table className="formal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', color: '#4b5563', fontWeight: 600 }}>Job Title</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#4b5563', fontWeight: 600 }}>Department</th>
              <th style={{ padding: '16px', textAlign: 'center', color: '#4b5563', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'center', color: '#4b5563', fontWeight: 600 }}>Action</th>
              <th style={{ padding: '16px', textAlign: 'right', color: '#4b5563', fontWeight: 600 }}>Posted Date</th>
            </tr>
          </thead>
          <tbody style={{ divideY: '1px solid #e5e7eb' }}>
            {displayJobs.length > 0 ? (
              displayJobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#111827' }}>{job.title}</td>
                  <td style={{ padding: '16px', color: '#4b5563' }}>{job.dept}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span className={`badge badge-${job.status}`} style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      background: job.status === 'Open' ? '#ecfdf5' : '#fef2f2',
                      color: job.status === 'Open' ? '#059669' : '#dc2626'
                    }}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                      {/* ปุ่ม View */}
                      <button 
                        onClick={() => onViewJob(job.id)} 
                        className="btn-view"
                        style={{ 
                          background: '#eff6ff', 
                          color: '#2563eb', 
                          border: 'none', 
                          padding: '6px 16px', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        view
                      </button>

                      {/* แสดงปุ่มลบ เฉพาะงานที่ผู้ใช้คนนี้สร้างเอง */}
                      {job.creator === currentUser && (
                        <button 
                          onClick={() => {
                            if(confirm("Are you sure you want to delete this job?")) onDeleteJob(job.id);
                          }} 
                          style={{ 
                            background: '#fef2f2', 
                            color: '#ef4444', 
                            border: 'none', 
                            padding: '6px', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#6b7280', fontSize: '13px' }}>{job.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No job vacancies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}