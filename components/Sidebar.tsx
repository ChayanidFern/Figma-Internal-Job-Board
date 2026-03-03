"use client";
import React from 'react';
import { IconDashboard, IconBriefcase, IconUsers, IconUser } from "./icons";

export default function Sidebar({ page, setPage, profileName, userProfile }: any) {
  // ดึงข้อมูลจาก userProfile
  const displayName = userProfile?.name || profileName;
  const displayPosition = userProfile?.position || "Software Engineer";
  const displayImage = userProfile?.image || "/Chaweewan.png";
  const displayPhone = userProfile?.phone || "";
  const displayEmail = userProfile?.email || ""; // เพิ่มตัวแปรอีเมล

  return (
    <div className="sidebar" style={{ width: 280, background: '#1e293b', color: 'white', padding: 30, display: 'flex', flexDirection: 'column' }}>
      
      {/* ส่วนหัว Sidebar แสดงข้อมูลผู้ใช้ */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 15, marginBottom: 40 }}>
        <img 
          src={displayImage} 
          style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #334155', flexShrink: 0 }} 
          alt="Avatar" 
        />
        
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayName}
          </h4>
          <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
            {displayPosition}
          </p>
          
          {/* แสดงเบอร์โทรศัพท์ */}
          {displayPhone && (
            <p style={{ margin: 0, fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📞 {displayPhone}
            </p>
          )}

          {/* แสดงอีเมล */}
          {displayEmail && (
            <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={displayEmail}>
              ✉️ {displayEmail}
            </p>
          )}
        </div>
      </div>

      {/* เมนูนำทาง */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { id: "profile", label: "Profile", icon: <IconUser /> },
          
          { id: "jobs", label: "Job Management", icon: <IconBriefcase /> },
          { id: "applicant", label: "Applicant", icon: <IconUsers /> },
          { id: "dashboard", label: "Dashboard", icon: <IconDashboard /> }
          
        ].map((item) => (
          <button 
            key={item.id} 
            onClick={() => setPage(item.id as any)} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: 12, padding: 12, 
              background: page === item.id ? '#2563eb' : 'transparent', 
              color: 'white', border: 'none', borderRadius: 8, 
              cursor: 'pointer', textAlign: 'left', fontSize: 14 
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}