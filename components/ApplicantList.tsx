"use client";
import React from 'react';
import { IconTrash, IconFileText } from "./icons";
import { Application } from "../types";

interface ApplicantListProps {
  apps: Application[];
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

export default function ApplicantList({ apps, onUpdateStatus, onDelete }: ApplicantListProps) {
  const handleViewResume = (base64String: string | null) => {
    if (!base64String) return alert("ผู้สมัครไม่ได้แนบ Resume");
    const win = window.open();
    if (win) win.document.write(`<iframe src="${base64String}" frameborder="0" style="border:0; width:100%; height:100vh;"></iframe>`);
  };

  return (
    <div className="card" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginTop: '20px' }}>
      <table className="formal-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #C9BEFF' }}>
          <tr>
            <th style={{ padding: '16px' }}>ตำแหน่งที่สมัคร</th>
            <th style={{ padding: '16px' }}>ข้อมูลผู้สมัคร</th>
            <th style={{ padding: '16px' }}>วันที่สมัคร</th>
            <th style={{ padding: '16px' }}>สถานะ</th>
            <th style={{ padding: '16px', textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '16px', fontWeight: 600, color: '#1f2937' }}>{app.jobTitle}</td>
              <td style={{ padding: '16px' }}>
                <div style={{ fontWeight: 600 }}>{app.applicantName}</div>
                <div style={{ fontSize: '13px', color: '#8494FF' }}>📧 {app.applicantEmail}</div>
                <div style={{ fontSize: '13px', color: '#8494FF' }}>📞 {app.applicantPhone}</div>
              </td>
              <td style={{ padding: '16px', color: '#8494FF' }}>{app.date}</td>
              <td style={{ padding: '16px' }}>
                <select 
                  value={app.status} 
                  onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #C9BEFF', background: app.status === 'Accepted' ? '#dcfce7' : '#FFDBFD', color: app.status === 'Accepted' ? '#166534' : '#6367FF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                >
                  <option value="Pending">🕒 รอพิจารณา</option>
                  <option value="Interview">🗣️ สัมภาษณ์</option>
                  <option value="Accepted">✅ รับเข้าทำงาน</option>
                  <option value="Rejected">❌ ปฏิเสธ</option>
                </select>
              </td>
              <td style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => handleViewResume(app.resume)} style={{ background: '#FFDBFD', color: '#6367FF', border: '1px solid #C9BEFF', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><IconFileText /></button>
                  <button onClick={() => onDelete(app.id)} style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><IconTrash /></button>
                </div>
              </td>
            </tr>
          ))}
          {apps.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#8494FF' }}>ยังไม่มีผู้สมัคร</td></tr>}
        </tbody>
      </table>
    </div>
  );
}