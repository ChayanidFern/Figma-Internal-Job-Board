"use client";

import { Job } from "../types";
import { IconClose } from "./icons";   // ใช้ icon เดียวกับที่คุณมี

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

  return (
    <div style={{ padding: '40px' }}>
      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input 
          type="text" 
          placeholder="ค้นหาชื่องานหรือแผนก..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '14px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '15px' }}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")} 
            className="btn-outline"
            style={{ padding: '14px 24px' }}
          >
            แสดงงานทั้งหมด
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600 }}>Job Title</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600 }}>Department</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600 }}>Action</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600 }}>Posted Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>ไม่พบงานที่ค้นหา</td></tr>
            ) : (
              filteredJobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 500 }}>{job.title}</td>
                  <td style={{ padding: '18px 24px', color: '#64748b' }}>{job.dept}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      background: job.status === 'Open' ? '#10b981' : '#ef4444',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: 500
                    }}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <button 
                      onClick={() => onViewJob(job.id)}
                      style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      View
                    </button>
                  </td>
                  <td style={{ padding: '18px 24px', color: '#64748b' }}>{job.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}