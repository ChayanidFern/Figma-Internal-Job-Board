"use client";
import React, { useState, useEffect, useRef } from 'react';
import { getUserProfile, updateUserProfile, createApplicationFromProfile, getData } from "../app/actions";
import { IconLock, IconFileText } from "./icons";

export default function ProfilePage({ currentUser }: { currentUser: string }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  // const imgInputRef = useRef<HTMLInputElement>(null); // ❌ ไม่ใช้แล้วเพราะเปลี่ยนเป็น Text Input
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [availableJobs, setAvailableJobs] = useState<{id: number, title: string}[]>([]);

  const [formData, setFormData] = useState({ 
    name: "", email: "", phone: "", department: "IT", 
    position: "", education: "", experience: "", skills: "", 
    image: "", resume: "", resumeName: "" 
  });

  useEffect(() => {
    getUserProfile(currentUser).then((data: any) => {
      if(data) setFormData({
        name: data.name || "", email: data.email || "", phone: data.phone || "", 
        department: data.department || "IT", position: data.position || "", 
        education: data.education || "", experience: data.experience || "", 
        skills: data.skills || "", image: data.image || "",
        resume: data.resume || "", resumeName: data.resume ? "Attached Resume" : ""
      });
    });

    getData().then((data) => {
      const openJobs = data.jobs.filter((j: any) => j.status === 'Open').map((j: any) => ({ id: j.id, title: j.title }));
      setAvailableJobs(openJobs);
    });
  }, [currentUser]);

  // ✅ แก้ไข: เหลือแค่จัดการ Resume (เพราะ Image เป็น Text แล้ว)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // ตรวจสอบขนาดไฟล์ Resume (2MB)
      const limitInMB = 2; 
      const maxFileSize = limitInMB * 1024 * 1024;

      if (file.size > maxFileSize) {
        alert(`ไฟล์มีขนาดใหญ่เกินไป (${(file.size / (1024 * 1024)).toFixed(2)} MB)\nกรุณาอัปโหลดไฟล์ที่มีขนาดไม่เกิน ${limitInMB} MB`);
        e.target.value = ""; 
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // จัดการเฉพาะ Resume
        setFormData({ ...formData, resume: reader.result as string, resumeName: file.name });
      };
    }
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    await updateUserProfile(currentUser, formData);
    setIsLoading(false);
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  };

  const handleApplyJob = async () => {
    if (!formData.position) return alert("กรุณาเลือกตำแหน่งงานที่จะสมัคร");
    if (!formData.resume) return alert("กรุณาแนบไฟล์ Resume (PDF) ก่อนส่งใบสมัคร");

    setIsLoading(true);
    
    // เรียกใช้ Server Action
    const result: any = await createApplicationFromProfile(currentUser, formData.position, formData);
    
    setIsLoading(false);

    if (result && result.success) {
      alert("ส่งใบสมัครเรียบร้อยแล้ว! ข้อมูลจะไปแสดงที่หน้า Applicant");
    } else {
      alert("เกิดข้อผิดพลาด: " + (result?.message || "ไม่สามารถส่งใบสมัครได้"));
    }
  };

  const rowStyle = { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' };
  const inputStyle = { background: '#f8fafc', width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24, fontWeight: 700 }}>Profile</h1>
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '30px' }}>
        <button onClick={() => setActiveTab("personal")} style={{ padding: '12px 24px', background: activeTab === 'personal' ? '#2563eb' : 'none', color: activeTab === 'personal' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: 600 }}>ข้อมูลส่วนตัว</button>
        <button onClick={() => setActiveTab("history")} style={{ padding: '12px 24px', background: activeTab === 'history' ? '#2563eb' : 'none', color: activeTab === 'history' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: 600 }}>ข้อมูลสำหรับสมัครงาน</button>
      </div>

      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        {activeTab === "personal" ? (
          <div style={{ display: 'flex', gap: '50px' }}>
            
            {/* ✅ ส่วนรูปโปรไฟล์ (แก้ไขเป็น Path Input) */}
            <div style={{ textAlign: 'center', width: 180 }}>
              <div style={{ width: 140, height: 140, borderRadius: '50%', background: '#eee', overflow: 'hidden', border: '1px solid #ddd', margin: '0 auto' }}>
                {/* แสดงรูปจาก Path ที่กรอก หรือใช้รูป Default */}
                <img 
                   src={formData.image || "/Chaweewan.png"} 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   alt="Profile"
                   onError={(e) => { e.currentTarget.src = "/Chaweewan.png" }} // กันรูปเสีย
                />
              </div>
              
              <div style={{ marginTop: 15 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 5 }}>Image URL / Path</label>
                <input 
                  style={{ ...inputStyle, padding: '8px', fontSize: '13px' }} 
                  value={formData.image} 
                  placeholder="/Chaweewan.png"
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                />
              </div>
            </div>

            {/* ส่วนฟอร์มข้อมูล */}
            <div style={{ flex: 1 }}>
              <div style={rowStyle}>
                <label style={{ minWidth: 140, fontWeight: 500 }}>ชื่อ-นามสกุล</label>
                <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              
              <div style={rowStyle}>
                <label style={{ minWidth: 140, fontWeight: 500 }}>อีเมล</label>
                <input style={inputStyle} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div style={rowStyle}>
                <label style={{ minWidth: 140, fontWeight: 500 }}>เบอร์โทรศัพท์</label>
                <input style={inputStyle} value={formData.phone} placeholder="0xx-xxx-xxxx" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              
              <div style={rowStyle}>
                <label style={{ minWidth: 140, fontWeight: 500 }}>ตำแหน่งงาน</label>
                <input style={inputStyle} value={formData.position} placeholder="เช่น Software Engineer" onChange={e => setFormData({ ...formData, position: e.target.value })} />
              </div>
              
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSaveAll} disabled={isLoading} style={{ padding: '12px 32px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)' }}>
                  {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลส่วนตัว'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Tab ข้อมูลสมัครงาน */
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={rowStyle}><label style={{ minWidth: 140 }}>ประวัติการศึกษา</label><textarea style={inputStyle} rows={3} value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} /></div>
            <div style={rowStyle}><label style={{ minWidth: 140 }}>ประวัติการทำงาน</label><textarea style={inputStyle} rows={3} value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} /></div>
            <div style={rowStyle}><label style={{ minWidth: 140 }}>ทักษะ</label><input style={inputStyle} value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} /></div>
            
            <div style={rowStyle}>
              <label style={{ minWidth: 140 }}>ตำแหน่งที่ต้องการสมัคร <span style={{color: 'red'}}>*</span></label>
              <select style={inputStyle} value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })}>
                <option value="">-- เลือกตำแหน่งที่เปิดรับ --</option>
                {availableJobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
              </select>
            </div>

            <div style={rowStyle}>
              <label style={{ minWidth: 140 }}>Resume (PDF) <span style={{color: 'red'}}>*</span></label>
              <div style={{ ...inputStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: formData.resume ? '#10b981' : '#64748b' }}>
                  <IconFileText /> {formData.resumeName || "ยังไม่ได้เลือกไฟล์"}
                </span>
                {/* Resume ยังใช้ File Upload เหมือนเดิม */}
                <input type="file" hidden ref={resumeInputRef} accept=".pdf" onChange={handleFileChange} />
                <button onClick={() => resumeInputRef.current?.click()} style={{ color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>แนบไฟล์ใหม่</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button onClick={handleSaveAll} style={{ padding: '12px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#334155' }}>บันทึกร่างข้อมูล</button>
              <button onClick={handleApplyJob} disabled={isLoading} style={{ padding: '12px 32px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>ส่งใบสมัคร</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}