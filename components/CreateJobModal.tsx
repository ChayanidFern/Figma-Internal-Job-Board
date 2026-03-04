"use client";
import React, { useState } from 'react';

interface CreateJobModalProps {
  onClose: () => void;
  onSubmit: (jobData: any) => Promise<void>;
}

export default function CreateJobModal({ onClose, onSubmit }: CreateJobModalProps) {
  const [formData, setFormData] = useState({
    title: "", dept: "IT", desc: "", requirements: "", responsibilities: "", 
    status: "Open" // ✅ เพิ่ม Default Status
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.desc) return alert("Please fill required fields");
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '15px' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginTop: 0 }}>Create New Job</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 5 }}>Job Title *</label>
          <input style={inputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 5 }}>Department</label>
              <select style={inputStyle} value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})}>
                <option value="IT">IT & Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
              </select>
            </div>
            {/* ✅ เพิ่มช่องเลือกสถานะ */}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 5 }}>Status</label>
              <select style={inputStyle} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <label style={{ display: 'block', marginBottom: 5 }}>Description *</label>
          <textarea style={inputStyle} rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} required />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '6px' }}>Cancel</button>
            <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}>
              {isLoading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}