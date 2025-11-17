import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Supabase Auth",
    description: "สมัครสมาชิกพร้อมสร้างโปรไฟล์อัตโนมัติในตาราง profiles",
  },
  {
    title: "Dashboard ครบถ้วน",
    description: "แสดงข้อมูลโปรไฟล์พร้อม Avatar สวยงามด้วย shadcn/ui",
  },
  {
    title: "Upload Avatar",
    description: "อัปโหลดไฟล์ตั้งชื่อด้วย UUID แล้วเก็บใน bucket avatar_imgs",
  },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 px-6 py-16 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 text-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1 text-sm font-medium text-muted-foreground shadow-sm">
            Next.js 15 + Supabase Mini Auth System
          </span>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Starter Kit พร้อมใช้งานสำหรับ Mini Auth
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            รวม flow Signup, Login, Dashboard พร้อมระบบ Upload Avatar ที่ตั้งชื่อไฟล์ด้วย UUID
            เชื่อม Supabase Storage bucket <code>avatar_imgs</code>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="px-8 text-base">
              <Link href="/signup">สมัครสมาชิก</Link>
            </Button>
            <Button asChild variant="outline" className="px-8 text-base">
              <Link href="/login">ล็อกอิน</Link>
            </Button>
          </div>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="text-left">
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
