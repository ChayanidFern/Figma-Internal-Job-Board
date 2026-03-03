"use client"; // ต้องมีบรรทัดนี้เสมอ
import React, { useState } from 'react';
// ... imports อื่นๆ// แก้ปัญหา useState is not defined
import { IconSearch, IconTrash, IconBack } from "./icons";
import { Job } from "../types";

interface JobManagementProps {
  jobs: Job[];
  currentUser: string;
  onViewJob: (id: number) => void;
  onDeleteJob: (id: number) => void;
}

export default function JobManagement({ jobs, currentUser, onViewJob, onDeleteJob }: JobManagementProps) {
  const [searchTerm, setSearchTerm] = useState(""); //
  const [isSearching, setIsSearching] = useState(false);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    if (searchTerm.trim()) setIsSearching(true);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Search Bar ตามรูป Search Job.png */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}><IconSearch /></span>
          <input 
            style={{ width: '95%', padding: '10px 10px 10px 40px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Search job title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={handleSearch} style={{ background: '#0056b3', padding: '0 30px' }}>Search</button>
      </div>

      {/* ปุ่มกลับหน้าหลัก */}
      {isSearching && (
        <button onClick={resetSearch} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0056b3', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '15px' }}>
          <IconBack /> Back to All Jobs
        </button>
      )}{/*  */}

      {/* Table Section */}
      <div className="card">
        <table className="formal-table">
          <thead style={{ background: '#e9ecef' }}>
            <tr>
              <th>Job Title</th>
              <th>Department</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Action</th>
              <th style={{ textAlign: 'right' }}>Posted Date</th>
            </tr>
          </thead>
          <tbody>
            {(isSearching ? filteredJobs : jobs).map(job => (
              <tr key={job.id}>
                <td style={{ fontWeight: 600 }}>{job.title}</td>
                <td>{job.dept}</td>
                <td style={{ textAlign: 'center' }}><span className={`badge badge-${job.status}`}>{job.status}</span></td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <button className="btn-outline" onClick={() => onViewJob(job.id)} style={{ background: '#3b82f6', color: 'white', border: 'none' }}>view</button>
                    {job.creator === currentUser && (
                      <button className="btn-outline" onClick={() => {
                        if(confirm("ยืนยันว่าลบจริงๆใช่ไหม? ลบแล้วไม่สามารถกู้คืนได้นะ")) {
                          onDeleteJob(job.id);
                        }
                      }} style={{ background: '#ef4444', color: 'white', border: 'none' }}><IconTrash /></button>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'right', color: '#6c757d' }}>{job.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}