"use client";
import React from 'react';
import { IconTrash, IconFileText } from "./icons"; // เพิ่ม IconFileText
import { Application } from "../types";

interface ApplicantListProps {
  apps: Application[];
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

export default function ApplicantList({ apps, onUpdateStatus, onDelete }: ApplicantListProps) {
  
  // ฟังก์ชันสำหรับเปิดไฟล์ Resume (Base64) ใน Tab ใหม่
  const handleViewResume = (base64String: string | null) => {
    if (!base64String || base64String === "") {
      alert("ผู้สมัครคนนี้ไม่ได้แนบไฟล์ Resume");
      return;
    }

    try {
      // สร้างหน้าต่างใหม่และเขียน iframe เพื่อแสดง PDF/Image
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${base64String}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    } catch (error) {
      alert("ไม่สามารถเปิดไฟล์ได้ กรุณาลองอัปโหลดไฟล์ใหม่อีกครั้ง");
    }
  };

  return (
    <div className="card" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginTop: '20px' }}>
      <table className="formal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <tr>
            <th style={{ padding: '16px', textAlign: 'left' }}>JOB TITLE</th>
            <th style={{ padding: '16px', textAlign: 'left' }}>APPLICANT</th>
            <th style={{ padding: '16px', textAlign: 'left' }}>DATE APPLIED</th>
            <th style={{ padding: '16px', textAlign: 'left' }}>STATUS (CHANGEABLE)</th>
            <th style={{ padding: '16px', textAlign: 'center' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '16px', fontWeight: 600 }}>{app.jobTitle}</td>
              <td style={{ padding: '16px' }}>{app.applicant}</td>
              <td style={{ padding: '16px', color: '#6b7280' }}>{app.date}</td>
              <td style={{ padding: '16px' }}>
                <select 
                  value={app.status} 
                  onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid #e5e7eb',
                    background: '#fff7ed',
                    color: '#c2410c',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    width: '120px'
                  }}
                >
                  <option value="Pending">🕒 Pending</option>
                  <option value="Interview">🗣️ Interview</option>
                  <option value="Accepted">✅ Accepted</option>
                  <option value="Rejected">❌ Rejected</option>
                </select>
              </td>
              <td style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  
                  {/* [NEW] ปุ่มเปิดดู Resume */}
                  <button 
                    onClick={() => handleViewResume(app.resume)}
                    title="View Resume"
                    style={{ 
                      background: '#eff6ff', 
                      color: '#2563eb', 
                      border: '1px solid #dbeafe', 
                      padding: '8px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <IconFileText />
                  </button>

                  <button 
                    onClick={() => onDelete(app.id)}
                    style={{ 
                      background: '#fff1f2', 
                      color: '#e11d48', 
                      border: '1px solid #ffe4e6', 
                      padding: '8px', 
                      borderRadius: '8px', 
                      cursor: 'pointer' 
                    }}
                  >
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}