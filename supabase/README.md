# Supabase Resources

ใช้ไฟล์ในโฟลเดอร์นี้เพื่อเตรียม Supabase project ให้ตรงกับ Mini Auth System

## 1. Database schema
1. เปิด Supabase Dashboard > SQL Editor  
2. คัดลอกคำสั่งจาก `supabase/schema.sql` แล้วรัน  
   - สร้างตาราง `profiles` พร้อม RLS policies และ trigger อัปเดต `updated_at`

## 2. Storage bucket
1. เปิด Storage > Create bucket  
2. กำหนดชื่อ `avatar_imgs` และตั้งค่า `Public bucket` = เปิด  
3. (ถ้าใช้ Supabase CLI) สามารถสร้างด้วยคำสั่ง  
   ```bash
   supabase storage create-bucket avatar_imgs --public
   ```
4. ไม่ต้องเพิ่ม Policy พิเศษ เพราะ bucket เป็น public สำหรับโหลดรูป avatar

เมื่อทำสองส่วนนี้เสร็จ โปรเจ็กต์สามารถใช้งานร่วมกับโค้ด Next.js ได้ทันที
