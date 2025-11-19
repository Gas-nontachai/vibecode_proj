"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { useProfile } from "@/hooks/useProfile";
import { updateProfileAction } from "@/actions/profile";
import { updateProfileInitialState } from "@/actions/profile-state";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { profile, setProfile, loading, error: profileError } = useProfile();
  const [state, formAction] = useActionState(updateProfileAction, updateProfileInitialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.profile) {
      setProfile(state.profile);
    }
  }, [setProfile, state.profile]);

  const handleFormAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
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
          <Button variant="outline" onClick={() => router.push("/dashboard")} disabled={isPending}>
            กลับ Dashboard
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          ) : profileError && !profile ? (
            <Alert variant="destructive">
              <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
              <AlertDescription>{profileError}</AlertDescription>
            </Alert>
          ) : profile ? (
            <form className="space-y-6" action={handleFormAction}>
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
                />
              </div>

              <div className="space-y-3">
                {state.error && (
                  <Alert variant="destructive">
                    <AlertTitle>ไม่สามารถบันทึกได้</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}
                {state.success && (
                  <Alert variant="success">
                    <AlertTitle>สำเร็จ</AlertTitle>
                    <AlertDescription>{state.success}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  ยกเลิก
                </Button>
                <FormSubmitButton
                  idleText="บันทึกการเปลี่ยนแปลง"
                  pendingText="กำลังบันทึก..."
                  className="w-full sm:w-auto"
                />
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
