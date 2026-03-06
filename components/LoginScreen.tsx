import { useState } from "react";

interface LoginProps {
  onLogin: (user: string, pass: string) => void;
  onCancel: () => void;
}

export default function LoginScreen({ onLogin, onCancel }: LoginProps) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (user.trim() !== "" && pass.trim() !== "") onLogin(user, pass);
    else alert("Please enter Username and Password");
  };

  return (
    <div className="login-screen" style={{ background: 'linear-gradient(135deg, #FFDBFD 0%, #C9BEFF 100%)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-card" style={{ background: 'white', width: '500px', padding: '60px 50px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px -10px rgba(99,103,255,0.2)' }}>
        <h2 style={{ marginBottom: '10px', fontSize: '32px', color: '#6367FF', fontWeight: 800 }}>สำหรับบริษัท / ผู้ประกาศงาน</h2>
        <p style={{ color: '#8494FF', marginBottom: '40px' }}>เข้าสู่ระบบเพื่อจัดการประกาศรับสมัครงาน</p>
        
        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label className="label" style={{ fontWeight: 600, color: '#6367FF', display: 'block', marginBottom: '8px' }}>Username</label>
          <input className="input-login" placeholder="ชื่อผู้ใช้" value={user} onChange={e => setUser(e.target.value)} style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '12px', border: '2px solid #C9BEFF', outlineColor: '#6367FF' }} />
        </div>
        <div style={{ marginBottom: '40px', textAlign: 'left' }}>
          <label className="label" style={{ fontWeight: 600, color: '#6367FF', display: 'block', marginBottom: '8px' }}>Password</label>
          <input className="input-login" placeholder="รหัสผ่าน" type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '12px', border: '2px solid #C9BEFF', outlineColor: '#6367FF' }} />
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '16px', fontSize: '16px', fontWeight: 600, background: '#FFDBFD', color: '#6367FF', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>กลับสู่หน้าหลัก</button>
          <button onClick={handleLogin} style={{ flex: 2, padding: '16px', fontSize: '16px', fontWeight: 700, background: '#6367FF', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 103, 255, 0.3)' }}>เข้าสู่ระบบ</button>
        </div>
      </div>
    </div>
  );
}