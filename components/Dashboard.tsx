"use client";
import React from 'react';
import { Job } from "../types";

interface DashboardProps {
  jobs: Job[];
  // apps: Application[]; // ❌ ลบออก เพราะเปลี่ยนไปนับจาก jobs แทนตามสั่ง
  currentUser: string;
}

export default function Dashboard({ jobs, currentUser }: DashboardProps) {
  
  // 1. คำนวณงานที่เปิดรับ (Status = Open)
  const openJobsCount = jobs.filter(j => j.status === 'Open').length;
  
  // 2. คำนวณงานที่ปิดรับสมัคร (Status = Closed) ✅ แก้ไขตามสั่ง
  // ดึงข้อมูลมาจาก Job Management (jobs array) โดยตรง
  const closedJobsCount = jobs.filter(j => j.status === 'Closed').length;
  
  // 3. คำนวณงานที่ฉันโพสต์ (Creator = currentUser)
  const myPostedJobsCount = jobs.filter(j => j.creator === currentUser).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* ส่วนแสดงสถิติ (Stats Grid) */}
      <div className="stats-grid">
        
        {/* กล่องที่ 1: Total Open Jobs */}
        <div className="stat-box" style={{ borderLeft: '5px solid #3b82f6' }}>
          <div className="stat-label">Total Open Jobs</div>
          <div className="stat-num">{openJobsCount}</div>
        </div>

        {/* กล่องที่ 2: Total Closed Jobs ✅ เปลี่ยนใหม่ */}
        {/* เปลี่ยนสีเป็นสีแดง/ส้ม เพื่อสื่อถึงสถานะ Closed */}
        <div className="stat-box" style={{ borderLeft: '5px solid #ef4444' }}>
          <div className="stat-label">Total Closed Jobs</div>
          <div className="stat-num" style={{ color: '#ef4444' }}>{closedJobsCount}</div>
        </div>

        {/* กล่องที่ 3: Jobs I Posted */}
        <div className="stat-box" style={{ borderLeft: '5px solid #10b981' }}>
          <div className="stat-label">Total Jobs</div>
          <div className="stat-num" style={{ color: '#10b981' }}>{myPostedJobsCount}</div>
        </div>

      </div>

      {/* ส่วนแสดงงานล่าสุด */}
      <div className="card" style={{ padding: '25px' }}>
        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#111827' }}>
          Recently Posted Jobs
        </h3>
        {jobs.length > 0 ? (
          jobs.slice(0, 5).map(j => (
            <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <strong style={{ color: '#111827' }}>{j.title}</strong> 
                <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                  {j.dept} • {j.date}
                </div>
              </div>
              <span className={`badge badge-${j.status}`}>{j.status}</span>
            </div>
          ))
        ) : (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}