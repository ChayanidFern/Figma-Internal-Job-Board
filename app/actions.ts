"use server"

import { prisma } from "../lib/prisma"
import { revalidatePath } from "next/cache"

// 1. ดึงข้อมูลงานและใบสมัครทั้งหมด
export async function getData() {
  const jobsRaw = await prisma.job.findMany({ orderBy: { id: 'desc' } });
  const appsRaw = await prisma.application.findMany({ orderBy: { id: 'desc' } });
  
  // แปลง Date object เป็น String เพื่อป้องกัน error "Date cannot be passed to client"
  return {
    jobs: jobsRaw.map(j => ({ 
      ...j, 
      date: j.date.toISOString().split('T')[0] 
    })),
    apps: appsRaw.map(a => ({ 
      ...a, 
      date: a.date.toISOString().split('T')[0] 
    }))
  };
}

// 2. จัดการ Profile และ Sidebar Sync ทันที
export async function getUserProfile(username: string) {
  // ✅ DANGER ZONE FIX: ดักจับค่าว่าง ถ้าไม่มี username ส่งมา ให้จบการทำงานทันที
  if (!username || username === "undefined") return null;

  try {
    let user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      // ถ้าหาไม่เจอ ให้สร้างใหม่ (Auto Register)
      user = await prisma.user.create({
        data: { 
          username, 
          name: username, 
          email: `${username}@org.com`, // สร้างอีเมลจำลอง
          password: "123", 
          position: "Software Engineer" 
        }
      });
    }
    return user;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}

export async function updateUserProfile(username: string, data: any) {
  if (!username) return;
  
  await prisma.user.update({
    where: { username },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      position: data.position,
      department: data.department,
      education: data.education,
      experience: data.experience,
      skills: data.skills,
      image: data.image,
      resume: data.resume,
      resumeName: data.resumeName
    } // ✅ แก้ไข Syntax ปีกกาให้ถูกต้อง
  });
  revalidatePath('/'); // อัปเดตข้อมูลหน้าเว็บทันที
}

// 3. ส่งใบสมัครจากหน้าโปรไฟล์ไปหน้า Applicant
// app/actions.ts
// app/actions.ts

export async function createApplicationFromProfile(username: string, jobTitle: string, profileData: any) {
  // 1. ค้นหางานจากชื่อ
  const job = await prisma.job.findFirst({ where: { title: jobTitle } });

  // ✅ ปรับแก้: ถ้าไม่เจองาน ให้ส่ง object กลับไปบอกหน้าบ้าน (ไม่ throw error แล้ว)
  if (!job) {
    return { 
      success: false, 
      message: `ไม่พบตำแหน่งงานชื่อ "${jobTitle}" ในระบบ หรือตำแหน่งนี้อาจถูกลบไปแล้ว` 
    };
  }

  try {
    // 2. สร้างใบสมัคร
    await prisma.application.create({
      data: {
        jobId: job.id,
        jobTitle: job.title,
        applicant: profileData.name || username,
        email: profileData.email || "",
        phone: profileData.phone || "",
        resume: profileData.resume || "",
        reason: "Applied via Profile Page",
        creatorOfJob: job.creator,
        status: "Pending"
      }
    });

    revalidatePath('/');
    return { success: true }; // ✅ ส่งกลับว่าสำเร็จ
  } catch (error) {
    console.error(error);
    return { success: false, message: "เกิดข้อผิดพลาดในการบันทึกใบสมัคร" };
  }
}
// 4. ฟังก์ชันจัดการอื่นๆ (App Status / Delete / Create Job)

export async function updateAppStatusAction(id: number, status: string) {
  await prisma.application.update({ where: { id: Number(id) }, data: { status } });
  revalidatePath('/');
}

export async function deleteApplicationAction(id: number) {
  await prisma.application.delete({ where: { id: Number(id) } });
  revalidatePath('/');
}

// รวม deleteJobAction และ deleteJob ไว้ที่นี่ (ใช้ชื่อ deleteJobAction ตามที่ Page เรียกใช้)
export async function deleteJobAction(id: number) {
  try {
    await prisma.job.delete({ where: { id: Number(id) } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Delete job error:", error);
    return { success: false, error: "Failed to delete job" };
  }
}

// ฟังก์ชันสร้างงานใหม่
export async function createJob(data: any, currentUser: string) {
  try {
    const newJob = await prisma.job.create({
      data: {
        title: data.title,
        dept: data.dept,
        desc: data.desc,
        requirements: data.requirements || "",
        responsibilities: data.responsibilities || "",
        status: "Open",
        creator: currentUser,
        // date: จะถูกสร้างโดยอัตโนมัติจาก @default(now()) ใน schema
      }
    });
    revalidatePath('/'); // เพิ่ม revalidate เพื่อให้หน้าจอแสดงงานใหม่ทันที
    return { success: true, job: newJob };
  } catch (error) {
    console.error("Create job error:", error);
    return { success: false, error: "Failed to create job" };
  }
}
