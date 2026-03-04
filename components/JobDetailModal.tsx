"use client";
import React from 'react';
import { Job } from '../types';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        
        {/* ปุ่มปิด */}
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#64748b' }}>×</button>

        {/* หัวข้อ */}
        <div style={{ marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 20 }}>
           <span style={{ 
             background: job.status === 'Open' ? '#ecfdf5' : '#fef2f2', 
             color: job.status === 'Open' ? '#059669' : '#dc2626',
             padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, float: 'right'
           }}>
             {job.status}
           </span>
           <h2 style={{ margin: 0, color: '#1e293b', fontSize: 24 }}>{job.title}</h2>
           <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Department: {job.dept} • Posted: {job.date}</p>
        </div>

        {/* เนื้อหา */}
        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#334155' }}>Description</h4>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>{job.desc}</p>
          </div>
          
          {(job.requirements) && (
             <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#334155' }}>Requirements</h4>
                <p style={{ margin: 0, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{job.requirements}</p>
             </div>
          )}
          
          {(job.responsibilities) && (
             <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#334155' }}>Responsibilities</h4>
                <p style={{ margin: 0, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{job.responsibilities}</p>
             </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
           <button onClick={onClose} style={{ padding: '10px 24px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>
             Close
           </button>
        </div>

      </div>
    </div>
  );
}