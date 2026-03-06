"use client";
import React from 'react';
import { IconDashboard, IconBriefcase, IconUsers } from "./icons"; 

export default function Sidebar({ page, setPage, profileName, userProfile }: any) {
  const displayName = userProfile?.name || profileName;
  const displayImage = userProfile?.image || "/Chaweewan.png";

  return (
    <div className="sidebar" style={{ width: 280, background: '#6367FF', color: 'white', padding: 30, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 40 }}>
        <img src={displayImage} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #C9BEFF' }} alt="Avatar" />
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{displayName}</h4>
          <p style={{ margin: 0, fontSize: 13, color: '#FFDBFD' }}>ผู้ดูแลระบบ</p>
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { id: "dashboard", label: "ภาพรวมบริษัท", icon: <IconDashboard /> },
          { id: "jobs", label: "จัดการประกาศงาน", icon: <IconBriefcase /> },
          { id: "applicant", label: "ผู้สมัครงาน", icon: <IconUsers /> },
        ].map((item) => (
          <button 
            key={item.id} 
            onClick={() => setPage(item.id as any)} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: 12, padding: 12, 
              background: page === item.id ? '#8494FF' : 'transparent', 
              color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left' 
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}