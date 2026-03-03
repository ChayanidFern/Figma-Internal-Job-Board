import { useState } from "react";

interface LoginProps {
  onLogin: (user: string) => void;
}

export default function LoginScreen({ onLogin }: LoginProps) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (user.trim() !== "") onLogin(user);
    else alert("Please enter your Username");
  };

  return (
    <div className="login-screen" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-card" style={{ background: 'white', width: '550px', padding: '80px 60px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}>
        <h2 style={{ marginBottom: '10px', fontSize: '36px', color: '#111827', fontWeight: 800 }}>HR Login</h2>
        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label className="label">Username</label>
          <input className="input-login" placeholder="Enter your username" value={user} onChange={e => setUser(e.target.value)} style={{ width: '100%', padding: '18px 20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e5e7eb' }} />
        </div>
        <div style={{ marginBottom: '50px', textAlign: 'left' }}>
          <label className="label">Password</label>
          <input className="input-login" placeholder="Enter password" type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: '100%', padding: '18px 20px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e5e7eb' }} />
        </div>
        <button onClick={handleLogin} style={{ width: '100%', padding: '20px', fontSize: '20px', fontWeight: 700, background: '#111827', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Sign In</button>
      </div>
    </div>
  );
}