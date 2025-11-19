"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { Tables } from "@/lib/database.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadAvatar } from "@/components/UploadAvatar";

export default function UpdateProfilePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Tables["profiles"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get("full_name")?.toString().trim() ?? "";
    const nickname = formData.get("nickname")?.toString().trim() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";

    if (!fullName) {
      setError("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        nickname: nickname || null,
        phone: phone || null,
      })
      .eq("id", profile.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว");
      setProfile((current) =>
        current
          ? {
              ...current,
              full_name: fullName,
              nickname: nickname || null,
              phone: phone || null,
            }
          : current,
      );
    }

    setSaving(false);
  };

  const handleCancel = () => {
    router.push("/dashboard");
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
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">แก้ไขโปรไฟล์</CardTitle>
            <CardDescription>อัปเดตข้อมูลส่วนตัวหลังจากเข้าสู่ระบบ</CardDescription>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")} disabled={saving}>
            กลับ Dashboard
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          ) : error && !profile ? (
            <Alert variant="destructive">
              <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : profile ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <section className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">รูปโปรไฟล์</h4>
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url ?? undefined} alt="avatar" />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      อัปโหลดรูปใหม่เพื่อแทนที่ภาพเดิม
                    </p>
                    <UploadAvatar
                      profileId={profile.id}
                      avatarUrl={profile.avatar_url}
                      onAvatarUpdated={(url) =>
                        setProfile((current) =>
                          current ? { ...current, avatar_url: url } : current,
                        )
                      }
                    />
                  </div>
                </div>
              </section>

              <div className="space-y-2">
                <Label htmlFor="full_name">ชื่อ-นามสกุล</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="ชื่อ-นามสกุล"
                  defaultValue={profile.full_name ?? ""}
                  disabled={saving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">ชื่อเล่น</Label>
                <Input
                  id="nickname"
                  name="nickname"
                  placeholder="ชื่อเล่น"
                  defaultValue={profile.nickname ?? ""}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="08x-xxx-xxxx"
                  defaultValue={profile.phone ?? ""}
                  disabled={saving}
                />
              </div>

              <div className="space-y-3">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>ไม่สามารถบันทึกได้</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert variant="success">
                    <AlertTitle>สำเร็จ</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-muted-foreground">ไม่พบข้อมูลโปรไฟล์</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
