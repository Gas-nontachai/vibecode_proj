"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

export default function DashboardPage() {
  const router = useRouter();
  const { profile, loading, error, supabase } = useProfile({
    redirectToLoginOnError: true,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleEditProfile = () => {
    router.push("/dashboard/update-profile");
  };

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((name) => name.at(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "ME";
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold">Dashboard</CardTitle>
            <p className="text-sm text-muted-foreground">
              จัดการโปรไฟล์และ Avatar ของคุณ
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleEditProfile}>แก้ไขโปรไฟล์</Button>
            <Button variant="outline" onClick={handleSignOut}>
              ออกจากระบบ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-10">
          {loading ? (
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : profile ? (
            <>
              <section className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url ?? undefined} alt="avatar" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {profile.full_name}
                  </h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <p className="text-muted-foreground">
                    ชื่อเล่น: {profile.nickname ?? "-"}
                  </p>
                  <p className="text-muted-foreground">
                    โทร: {profile.phone ?? "-"}
                  </p>
                </div>
              </section>

            </>
          ) : (
            <p className="text-muted-foreground">ไม่พบข้อมูลโปรไฟล์</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
