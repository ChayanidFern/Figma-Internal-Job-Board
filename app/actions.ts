"use server";

import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- Jobs Actions ---
export type Job = {
  id: number;
  title: string;
  dept: string;
  desc: string;
  status: string;
  date: string;
};

export async function getJobs() {
  const jobs = await sql`SELECT * FROM jobs ORDER BY id DESC`;
  return jobs.map((j) => ({ ...j, desc: j.description })) as Job[];
}

export async function createJob(title: string, dept: string, desc: string, date: string) {
  await sql`INSERT INTO jobs (title, dept, description, status, date) VALUES (${title}, ${dept}, ${desc}, 'Open', ${date})`;
  revalidatePath("/");
}

export async function updateJob(id: number, title: string, dept: string, desc: string, status: string) {
  await sql`UPDATE jobs SET title = ${title}, dept = ${dept}, description = ${desc}, status = ${status} WHERE id = ${id}`;
  revalidatePath("/");
}

export async function archiveJob(id: number) {
  await sql`UPDATE jobs SET status = 'Archived' WHERE id = ${id}`;
  revalidatePath("/");
}

export async function deleteJob(id: number) {
  await sql`DELETE FROM jobs WHERE id = ${id}`;
  revalidatePath("/");
}

// --- Applications Actions ---
export type Application = {
  id: number;
  name: string;
  email: string;
  job_title: string;
  status: string; // Pending, Passed, Failed
  date: string;
};

export async function getApplications() {
  const apps = await sql`SELECT * FROM applications ORDER BY id DESC`;
  return apps as Application[];
}

// ✅ เพิ่มฟังก์ชันสร้างผู้สมัครใหม่ (สำหรับการคีย์ข้อมูลเอง)
export async function createApplication(name: string, email: string, job_title: string, date: string) {
  await sql`INSERT INTO applications (name, email, job_title, status, date) VALUES (${name}, ${email}, ${job_title}, 'Pending', ${date})`;
  revalidatePath("/");
}

export async function updateAppStatus(id: number, status: string) {
  await sql`UPDATE applications SET status = ${status} WHERE id = ${id}`;
  revalidatePath("/");
}

export async function deleteApplication(id: number) {
  await sql`DELETE FROM applications WHERE id = ${id}`;
  revalidatePath("/");
}