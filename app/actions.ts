"use server"

import { prisma } from "../lib/prisma"
import { revalidatePath } from "next/cache"

// 1. ดึงข้อมูลงานและใบสมัครทั้งหมด
export async function getData() {
  const jobsRaw = await prisma.job.findMany({ orderBy: { id: 'desc' } });
  const appsRaw = await prisma.application.findMany({ orderBy: { id: 'desc' } });
  return {
    jobs: jobsRaw.map(j => ({ ...j, date: j.date.toISOString().split('T')[0] })),
    apps: appsRaw.map(a => ({ ...a, date: a.date.toISOString().split('T')[0] }))
  };
}

// 2. จัดการ Profile และ Sidebar Sync ทันที
export async function getUserProfile(username: string) {
  let user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    user = await prisma.user.create({
      data: { username, name: username, email: `${username}@org.com`, password: "123", position: "Software Engineer" }
    });
  }
  return user;
}

export async function updateUserProfile(username: string, data: any) {
  await prisma.user.update({
    where: { username },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department,
      position: data.position, // สำหรับแสดงผลที่ Sidebar
      image: data.image,
      education: data.education,
      experience: data.experience,
      skills: data.skills,
      resume: data.resume 
    }
  });
  revalidatePath('/'); // อัปเดต Sidebar และหน้าจอทุกจุดทันที
}

// 3. ส่งใบสมัครจากหน้าโปรไฟล์ไปหน้า Applicant
export async function createApplicationFromProfile(username: string, jobTitle: string, profileData: any) {
  const job = await prisma.job.findFirst({ where: { title: jobTitle } });
  await prisma.application.create({
    data: {
      jobId: job?.id || 0,
      jobTitle: jobTitle,
      applicant: profileData.name || username,
      email: profileData.email || "",
      phone: profileData.phone || "",
      resume: profileData.resume || "",
      reason: "Applied via Profile Page",
      creatorOfJob: job?.creator || "Admin",
      status: "Pending"
    }
  });
  revalidatePath('/');
}

// 4. ฟังก์ชันจัดการอื่นๆ
export async function updateAppStatusAction(id: number, status: string) {
  await prisma.application.update({ where: { id: Number(id) }, data: { status } });
  revalidatePath('/');
}

export async function deleteApplicationAction(id: number) {
  await prisma.application.delete({ where: { id: Number(id) } });
  revalidatePath('/');
}

export async function deleteJobAction(id: number) {
  await prisma.job.delete({ where: { id: Number(id) } });
  revalidatePath('/');
}