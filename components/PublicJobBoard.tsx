"use client";
import React, { useState } from 'react';
import { IconSearch, IconFileText } from "./icons";
import { Job } from "../types";

interface PublicJobBoardProps {
  jobs: Job[];
  onApply: (jobId: number, formData: { name: string, email: string, phone: string, resume: string }) => Promise<void>;
}

export default function PublicJobBoard({ jobs, onApply }: PublicJobBoardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [hoveredJob, setHoveredJob] = useState<number | null>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeBase64, setResumeBase64] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const filteredJobs = safeJobs.filter(job =>
    job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job?.dept?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setResumeBase64(reader.result as string);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !phone || !resumeBase64) return alert("กรุณากรอกข้อมูลและแนบไฟล์ Resume ให้ครบถ้วน");
    setIsSubmitting(true);
    try {
      await onApply(selectedJob!.id, { name, email, phone, resume: resumeBase64 });
      alert("🎉 ส่งใบสมัครเรียบร้อยแล้ว ขอให้คุณโชคดี!");
      setSelectedJob(null);
      setName(""); setEmail(""); setPhone(""); setResumeBase64(""); setResumeName("");
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100%', paddingBottom: '60px' }}>
      <div style={{ background: 'linear-gradient(135deg, #6367FF 0%, #8494FF 100%)', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 15px 0', letterSpacing: '-0.5px' }}>ค้นหางานที่ใช่ สำหรับคุณ</h1>
        <p style={{ fontSize: '18px', color: '#FFDBFD', margin: 0, fontWeight: 400 }}>ร่วมเป็นส่วนหนึ่งกับเรา สมัครงานง่ายๆ พร้อมแนบ Resume ได้ทันที</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-35px auto 0', padding: '0 20px' }}>
        <div style={{ position: 'relative', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', marginBottom: '40px', padding: '8px' }}>
          <span style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#8494FF' }}><IconSearch /></span>
          <input 
            style={{ width: '100%', padding: '18px 20px 18px 60px', border: 'none', borderRadius: '12px', fontSize: '16px', outline: 'none', background: 'transparent' }}
            placeholder="ค้นหาชื่อตำแหน่งงาน หรือแผนกที่ต้องการ..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredJobs.length > 0 ? filteredJobs.map(job => {
            const isClosed = job.status === 'Closed';
            const isHovered = hoveredJob === job.id;

            return (
              <div 
                key={job.id} onMouseEnter={() => setHoveredJob(job.id)} onMouseLeave={() => setHoveredJob(null)}
                style={{ 
                  background: 'white', borderRadius: '20px', padding: '24px', 
                  boxShadow: isHovered ? '0 20px 25px -5px rgba(99,103,255,0.15)' : '0 4px 6px -1px rgba(0,0,0,0.05)', 
                  border: '1px solid #f1f5f9', transition: 'all 0.3s ease',
                  transform: isHovered && !isClosed ? 'translateY(-5px)' : 'none',
                  opacity: isClosed ? 0.65 : 1, display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: isClosed ? '#fee2e2' : '#dcfce7', color: isClosed ? '#991b1b' : '#166534', display: 'inline-block' }}>
                    {isClosed ? '🔴 ปิดรับสมัคร (เต็ม)' : '🟢 กำลังเปิดรับสมัคร'}
                  </span>
                  <div style={{ background: '#FFDBFD', padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#6367FF' }}>
                    รับแล้ว <span style={{ color: job.acceptedCount >= job.maxApplicants ? '#dc2626' : '#6367FF' }}>{job.acceptedCount}</span>/{job.maxApplicants}
                  </div>
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#0f172a', fontWeight: 700 }}>{job.title}</h3>
                <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>🏢 {job.dept}</p>

                <button 
                  onClick={() => setSelectedJob(job)} disabled={isClosed}
                  style={{ 
                    marginTop: 'auto', width: '100%', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 600, fontSize: '15px',
                    background: isClosed ? '#e2e8f0' : '#6367FF', color: isClosed ? '#94a3b8' : 'white', cursor: isClosed ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                  }}
                >
                  {isClosed ? 'ไม่สามารถสมัครได้' : 'สมัครงานตำแหน่งนี้'}
                </button>
              </div>
            );
          }) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '20px', border: '1px dashed #C9BEFF' }}>
              <span style={{ color: '#8494FF' }}><IconSearch /></span>
              <h3 style={{ color: '#6367FF', marginTop: '16px' }}>ไม่พบประกาศงานในขณะนี้</h3>
              <p style={{ color: '#8494FF' }}>ลองค้นหาด้วยคำคีย์เวิร์ดอื่นดูนะ</p>
            </div>
          )}
        </div>
      </div>

      {selectedJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(99, 103, 255, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px -12px rgba(99,103,255,0.3)', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: '0 0 8px 0', color: '#6367FF', fontSize: '24px', fontWeight: 800 }}>ส่งใบสมัครงาน</h2>
              <p style={{ color: '#6367FF', fontWeight: 600, margin: 0, fontSize: '15px', background: '#FFDBFD', border: '1px solid #C9BEFF', display: 'inline-block', padding: '6px 16px', borderRadius: '20px' }}>
                {selectedJob.title} • {selectedJob.dept}
              </p>
            </div>
            
            <div style={{ display: 'grid', gap: '16px', marginBottom: '30px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#6367FF', marginLeft: '4px' }}>ชื่อ-นามสกุล <span style={{color:'#ef4444'}}>*</span></label>
                <input style={{ width: '94%', padding: '14px 16px', marginTop: '8px', borderRadius: '12px', border: '1px solid #C9BEFF', background: '#f8fafc', outlineColor: '#6367FF' }} value={name} onChange={e => setName(e.target.value)} placeholder="ระบุชื่อจริง-นามสกุล" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#6367FF', marginLeft: '4px' }}>อีเมล <span style={{color:'#ef4444'}}>*</span></label>
                  <input type="email" style={{ width: '87%', padding: '14px 16px', marginTop: '8px', borderRadius: '12px', border: '1px solid #C9BEFF', background: '#f8fafc', outlineColor: '#6367FF' }} value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#6367FF', marginLeft: '4px' }}>เบอร์โทรศัพท์ <span style={{color:'#ef4444'}}>*</span></label>
                  <input style={{ width: '88%', padding: '14px 16px', marginTop: '8px', borderRadius: '12px', border: '1px solid #C9BEFF', background: '#f8fafc', outlineColor: '#6367FF' }} value={phone} onChange={e => setPhone(e.target.value)} placeholder="08x-xxx-xxxx" />
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#6367FF', marginLeft: '4px' }}>อัปโหลด Resume (PDF) <span style={{color:'#ef4444'}}>*</span></label>
                <div style={{ marginTop: '8px', position: 'relative' }}>
                  <input type="file" id="resumeUpload" hidden accept=".pdf" onChange={handleFileChange} />
                  <label htmlFor="resumeUpload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '92%', padding: '20px', borderRadius: '12px', border: '2px dashed #8494FF', background: '#FFDBFD', color: '#6367FF', cursor: 'pointer', fontWeight: 600 }}>
                    <IconFileText /> {resumeName || "คลิกเพื่ออัปโหลดไฟล์ PDF"}
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSelectedJob(null)} style={{ flex: 1, padding: '16px', border: 'none', background: '#f1f5f9', color: '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>ยกเลิก</button>
              <button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 2, padding: '16px', border: 'none', background: '#6367FF', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', boxShadow: '0 4px 12px rgba(99, 103, 255, 0.3)' }}>
                {isSubmitting ? "กำลังส่งข้อมูล..." : "ยืนยันการสมัครงาน"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}