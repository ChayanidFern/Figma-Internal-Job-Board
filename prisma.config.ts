import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

// โหลดไฟล์ .env ทันที
config();

export default defineConfig({
  datasource: {
    // ตอนนี้ process.env.DATABASE_URL จะมีค่าแล้ว
    url: process.env.DATABASE_URL ?? "", 
  },
});