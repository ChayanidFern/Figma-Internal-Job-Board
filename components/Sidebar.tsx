"use client";
import React from 'react';
import { IconDashboard, IconBriefcase, IconUsers, IconUser } from "./icons";

export default function Sidebar({ page, setPage, profileName, userProfile }: any) {
  // ข้อมูลจะ Sync กับฐานข้อมูลทันทีเมื่อกดบันทึกที่หน้า Profile
  const displayName = userProfile?.name || profileName;
  const displayPosition = userProfile?.position || "Software Engineer";
  const displayImage = userProfile?.image || "/Chaweewan.png";

  return (
    <div className="sidebar" style={{ width: 280, background: '#1e293b', color: 'white', padding: 30, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 40 }}>
        <img src={displayImage} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #334155' }} alt="Avatar" />
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{displayName}</h4>
          <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>{displayPosition}</p>
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { id: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
          { id: "jobs", label: "Job Management", icon: <IconBriefcase /> },
          { id: "applicant", label: "Applicant", icon: <IconUsers /> },
          { id: "profile", label: "Profile", icon: <IconUser /> },
        ].map((item) => (
          <button key={item.id} onClick={() => setPage(item.id as any)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: page === item.id ? '#2563eb' : 'transparent', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left' }}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}