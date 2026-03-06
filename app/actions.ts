"use server";
import { neon } from '@neondatabase/serverless';
import { Job, Application } from "../types";

const sql = neon(process.env.DATABASE_URL!);

export async function getData() {
  const jobsData = await sql`
    SELECT id, title, dept, TO_CHAR(date, 'YYYY-MM-DD') as date, status, creator, max_applicants AS "maxApplicants", accepted_count AS "acceptedCount"
    FROM jobs ORDER BY id DESC
  `;

  const appsData = await sql`
    SELECT id, job_id AS "jobId", job_title AS "jobTitle", applicant_name AS "applicantName", applicant_email AS "applicantEmail", applicant_phone AS "applicantPhone", TO_CHAR(date, 'YYYY-MM-DD') as date, status, resume
    FROM applications ORDER BY id DESC
  `;

  return { jobs: jobsData as Job[], apps: appsData as Application[] };
}

export async function createJobAction(job: { title: string, dept: string, creator: string, maxApplicants: number }) {
  const date = new Date().toISOString().split('T')[0];
  await sql`
    INSERT INTO jobs (title, dept, date, status, creator, max_applicants, accepted_count)
    VALUES (${job.title}, ${job.dept}, ${date}, 'Open', ${job.creator}, ${job.maxApplicants}, 0)
  `;
}

export async function deleteJobAction(id: number) {
  await sql`DELETE FROM jobs WHERE id = ${id}`;
}

export async function submitPublicApplication(jobId: number, formData: { name: string, email: string, phone: string, resume: string }) {
  const jobResult = await sql`SELECT title, status FROM jobs WHERE id = ${jobId}`;
  if (jobResult.length === 0 || jobResult[0].status === 'Closed') {
    throw new Error("ขออภัย งานนี้ปิดรับสมัครแล้ว");
  }

  const jobTitle = jobResult[0].title;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO applications (job_id, job_title, applicant_name, applicant_email, applicant_phone, date, status, resume)
    VALUES (${jobId}, ${jobTitle}, ${formData.name}, ${formData.email}, ${formData.phone}, ${date}, 'Pending', ${formData.resume})
  `;
}

export async function updateAppStatusAction(appId: number, status: 'Pending' | 'Interview' | 'Accepted' | 'Rejected') {
  const updatedApp = await sql`UPDATE applications SET status = ${status} WHERE id = ${appId} RETURNING job_id`;
  if (updatedApp.length === 0) return;
  const jobId = updatedApp[0].job_id;

  const acceptCountResult = await sql`SELECT COUNT(*) as count FROM applications WHERE job_id = ${jobId} AND status = 'Accepted'`;
  const acceptedCount = Number(acceptCountResult[0].count);

  const jobInfo = await sql`SELECT max_applicants FROM jobs WHERE id = ${jobId}`;
  const maxApplicants = jobInfo[0].max_applicants;

  const newStatus = acceptedCount >= maxApplicants ? 'Closed' : 'Open';
  await sql`UPDATE jobs SET accepted_count = ${acceptedCount}, status = ${newStatus} WHERE id = ${jobId}`;
}

export async function deleteApplicationAction(id: number) {
  const deletedApp = await sql`DELETE FROM applications WHERE id = ${id} RETURNING job_id, status`;
  if (deletedApp.length > 0 && deletedApp[0].status === 'Accepted') {
    const jobId = deletedApp[0].job_id;
    const acceptCountResult = await sql`SELECT COUNT(*) as count FROM applications WHERE job_id = ${jobId} AND status = 'Accepted'`;
    const acceptedCount = Number(acceptCountResult[0].count);
    const jobInfo = await sql`SELECT max_applicants FROM jobs WHERE id = ${jobId}`;
    const maxApplicants = jobInfo[0].max_applicants;
    const newStatus = acceptedCount >= maxApplicants ? 'Closed' : 'Open';
    await sql`UPDATE jobs SET accepted_count = ${acceptedCount}, status = ${newStatus} WHERE id = ${jobId}`;
  }
}

export async function getUserProfile(username: string) {
  return { username, name: username, email: "", phone: "", position: "", image: "" };
}