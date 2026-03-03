import { Application } from "../types";
import { IconTrash } from "./icons";

interface ApplicantListProps {
  apps: Application[];
  onUpdateStatus: (id: number, status: string) => void; // รับฟังก์ชันเปลี่ยนสถานะ
  onDelete: (id: number) => void;
}

export default function ApplicantList({ apps, onUpdateStatus, onDelete }: ApplicantListProps) {
  
  const getBadgeColor = (status: string) => {
    switch(status) {
      case 'Accepted': return 'badge-Accepted';
      case 'Rejected': return 'badge-Rejected';
      default: return 'badge-Pending';
    }
  };

  return (
    <div className="card">
      <table className="formal-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Applicant</th>
            <th>Date Applied</th>
            <th>Status (Changeable)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(a => (
            <tr key={a.id}>
              <td style={{ fontWeight: 700, color: '#1f2937', fontSize: '16px' }}>{a.jobTitle}</td>
              <td style={{ fontSize: '15px' }}>{a.applicant}</td>
              <td style={{ fontSize: '15px' }}>{a.date}</td>
              <td>
                {/* Dropdown เปลี่ยนสถานะ */}
                <select 
                  value={a.status} 
                  onChange={(e) => onUpdateStatus(a.id, e.target.value)}
                  className={`badge ${getBadgeColor(a.status)}`}
                  style={{ 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: '6px 10px', 
                    fontSize: '13px',
                    outline: 'none',
                    textAlign: 'center',
                    appearance: 'none' // ซ่อนลูกศร default ของ browser (optional)
                  }}
                >
                  <option value="Pending">🕒 Pending</option>
                  <option value="Interview">🗣️ Interview</option>
                  <option value="Accepted">✅ Accepted</option>
                  <option value="Rejected">❌ Rejected</option>
                </select>
              </td>
              <td>
                <button 
                  className="btn-outline" 
                  onClick={() => onDelete(a.id)}
                  style={{ color: '#ef4444', borderColor: '#fca5a5', display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px' }}
                >
                  <IconTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
          {apps.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                No application data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}