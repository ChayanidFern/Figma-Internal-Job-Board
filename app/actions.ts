"use server"

import { prisma } from "../lib/prisma"
import { revalidatePath } from "next/cache"

// 1. ดึงข้อมูลและแปลง Date เป็น String
export async function getData() {
  const jobsRaw = await prisma.job.findMany({ orderBy: { id: 'desc' } });
  const appsRaw = await prisma.application.findMany({ orderBy: { id: 'desc' } });

  // แปลงข้อมูล Job
  const jobs = jobsRaw.map(job => ({
    ...job,
    // แปลง Date Object เป็น String (เช่น "2023-12-25")
    date: job.date.toISOString().split('T')[0], 
    // ถ้า openDate/closingDate เป็น String อยู่แล้วก็ไม่ต้องทำอะไร
  }));

  // แปลงข้อมูล Application
  const apps = appsRaw.map(app => ({
    ...app,
    date: app.date.toISOString().split('T')[0],
  }));

  return { jobs, apps };
}

// 2. บันทึกหรือแก้ไขงาน
export async function saveJobAction(id: number | null, data: any, creator: string) {
  // ลบ id ออกจาก data ก่อนส่งไป create/update เพื่อป้องกัน error
  const { id: _, ...jobData } = data;

  if (id === -1 || id === null) {
    // สร้างใหม่
    await prisma.job.create({
      data: {
        title: jobData.title,
        dept: jobData.dept,
        desc: jobData.desc,
        requirements: jobData.requirements,
        status: jobData.status,
        openDate: jobData.openDate,
        closingDate: jobData.closingDate,
        creator: creator
      }
    });
  } else {
    // แก้ไข
    await prisma.job.update({
      where: { id },
      data: {
        title: jobData.title,
        dept: jobData.dept,
        desc: jobData.desc,
        requirements: jobData.requirements,
        status: jobData.status,
        openDate: jobData.openDate,
        closingDate: jobData.closingDate,
      }
    });
  }
  revalidatePath('/');
}

// 3. ลบงาน
export async function deleteJobAction(id: number) {
  await prisma.job.delete({ where: { id } });
  revalidatePath('/');
}

// 4. สมัครงาน (เพิ่มส่วนนี้เพื่อให้ปุ่ม Apply ทำงานได้)
export async function applyJobAction(jobData: any, appData: any, currentUser: string) {
  await prisma.application.create({
    data: {
      jobId: jobData.id,
      jobTitle: jobData.title,
      applicant: currentUser,
      email: `${currentUser}@mail.com`, // หรือรับจาก Form
      phone: appData.phone || "099-999-9999",
      resume: appData.resumeLink,
      reason: appData.reason || "",
      creatorOfJob: jobData.creator
    }
  });
  revalidatePath('/');
}

// 5. อัปเดตสถานะผู้สมัคร
export async function updateAppStatusAction(id: number, status: string) {
  await prisma.application.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/');
}