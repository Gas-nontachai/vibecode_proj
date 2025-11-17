"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UploadAvatar } from "@/components/UploadAvatar";
import type { Tables } from "@/lib/database.types";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Tables["profiles"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchProfile = async () => {
      setError(null);
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError(userError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (profileError) {
          setError(profileError.message);
        } else {
          setProfile(data);
        }
        setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      ignore = true;
    };
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">Dashboard</CardTitle>
            <p className="text-sm text-muted-foreground">
              จัดการโปรไฟล์และ Avatar ของคุณ
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            ออกจากระบบ
          </Button>
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

              <section className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">
                  อัปโหลดรูปโปรไฟล์ใหม่
                </h4>
                <UploadAvatar
                  profileId={profile.id}
                  avatarUrl={profile.avatar_url}
                  onAvatarUpdated={(url) =>
                    setProfile((current) =>
                      current ? { ...current, avatar_url: url } : current,
                    )
                  }
                />
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
