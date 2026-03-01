"use server";

export type Job = {
  id: number;
  title: string;
  dept: string;
  desc: string;
  status: string;
  date: string;
};

export type Application = {
  id: number;
  name: string;
  email: string;
  job_title: string;
  status: string;
  date: string;
};

// ใช้ Global Variables จำลอง Database ชั่วคราว
let jobs: Job[] = [
  { id: 1, title: "Software Engineer", dept: "IT", desc: "Develop internal tools", status: "Open", date: "28/02/2026" },
  { id: 2, title: "Marketing Manager", dept: "Marketing", desc: "Manage campaigns", status: "Closed", date: "25/02/2026" }
];

let applications: Application[] = [
  { id: 1, name: "Somchai Jaidee", email: "somchai@email.com", job_title: "Software Engineer", status: "Pending", date: "28/02/2026" }
];

// --- Job Actions ---
export async function getJobs() {
  return jobs;
}

export async function createJob(title: string, dept: string, desc: string, date: string) {
  const newJob: Job = {
    id: Date.now(), // สร้าง ID อัตโนมัติ
    title,
    dept,
    desc,
    status: "Open",
    date
  };
  jobs.push(newJob);
  return newJob;
}

export async function updateJob(id: number, title: string, dept: string, desc: string, status: string) {
  const index = jobs.findIndex(j => j.id === id);
  if (index > -1) {
    jobs[index] = { ...jobs[index], title, dept, desc, status };
  }
}

export async function deleteJob(id: number) {
  jobs = jobs.filter(j => j.id !== id);
}

// --- Application Actions ---
export async function getApplications() {
  return applications;
}

export async function createApplication(name: string, email: string, job_title: string, date: string) {
  const newApp: Application = {
    id: Date.now(),
    name,
    email,
    job_title,
    status: "Pending",
    date
  };
  applications.push(newApp);
  return newApp;
}

export async function updateAppStatus(id: number, status: string) {
  const index = applications.findIndex(a => a.id === id);
  if (index > -1) {
    applications[index].status = status;
  }
}

export async function deleteApplication(id: number) {
  applications = applications.filter(a => a.id !== id);
}