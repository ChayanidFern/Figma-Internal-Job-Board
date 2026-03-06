export interface Job {
  id: number;
  title: string;
  dept: string; 
  date: string;
  status: 'Open' | 'Closed';
  creator: string; 
  maxApplicants: number; 
  acceptedCount: number; 
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  date: string;
  status: 'Pending' | 'Interview' | 'Accepted' | 'Rejected';
  resume: string | null; 
}

export interface UserProfile {
  username: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  image: string;
}