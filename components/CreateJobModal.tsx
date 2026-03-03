"use client";
import React, { useState } from 'react';

interface CreateJobModalProps {
  onClose: () => void;
  onSubmit: (jobData: any) => Promise<void>;
}

export default function CreateJobModal({ onClose, onSubmit }: CreateJobModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    dept: "IT",
    desc: "",
    requirements: "",
    responsibilities: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.desc) return alert("Please fill in required fields");
    
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 500, color: '#374151' };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>Create New Job</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Job Title *</label>
            <input style={inputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior UX Designer" required />
          </div>

          <div>
            <label style={labelStyle}>Department</label>
            <select style={inputStyle} value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})}>
              <option value="IT">IT & Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">Human Resources</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Description *</label>
            <textarea style={inputStyle} rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} required />
          </div>

          <div>
            <label style={labelStyle}>Requirements</label>
            <textarea style={inputStyle} rows={3} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {isLoading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}