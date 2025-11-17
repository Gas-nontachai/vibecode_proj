## Next.js + Supabase Mini Auth System

โปรเจคตัวอย่างที่ใช้ Next.js 15 (App Router) + Supabase + shadcn/ui + Tailwind CSS 4 สำหรับสร้างระบบสมัครสมาชิก, ล็อกอิน, Dashboard และอัปโหลด Avatar พร้อมตั้งชื่อไฟล์ด้วย UUID เก็บใน Supabase Storage bucket `avatar_imgs`.

### คุณสมบัติหลัก
- ✅ Signup page: สร้าง user ด้วย email/password และ insert ข้อมูลลงตาราง `profiles`
- ✅ Login page: signInWithPassword แล้ว redirect ไป `/dashboard`
- ✅ Dashboard: ดึงข้อมูล `supabase.auth.getUser()` + `profiles` แสดงผลด้วย shadcn/ui components
- ✅ Upload Avatar: input type file + uuid file name + upload storage + getPublicUrl + update `profiles.avatar_url` + preview รูปใหม่ทันที
- ✅ Logout button และ ThemeProvider รองรับ light/dark

### เตรียม Environment
1. สร้าง `.env.local` จากไฟล์ตัวอย่าง
   ```bash
   cp .env.example .env.local
   ```
2. ใส่ค่า
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. ตรวจสอบว่า Supabase project มีตาราง `profiles` และ Storage bucket `avatar_imgs (public)` ตาม schema

### การติดตั้งและรัน
```bash
npm install
npm run dev
```
เปิด http://localhost:3000 เพื่อเริ่มใช้งาน

### โครงสร้างโฟลเดอร์สำคัญ
- `src/app/signup` – หน้า Signup
- `src/app/login` – หน้า Login
- `src/app/dashboard` – Dashboard พร้อม Upload Avatar และ Logout
- `src/components/ui/*` – shadcn/ui components (Card, Button, Input, Label, Avatar, Alert)
- `src/components/UploadAvatar.tsx` – logic สำหรับอัปโหลด avatar UUID -> Supabase Storage
- `src/lib/supabase.ts` – createBrowserClient อ่าน env จาก `NEXT_PUBLIC_SUPABASE_*`
- `.env.example` – ตัวอย่าง environment variables

เพียงเชื่อมต่อ Supabase ก็ได้ Mini Auth System ที่พร้อมนำไปต่อยอด 🎉
