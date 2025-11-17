"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { signUpAction, type AuthFormState } from "@/actions/auth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";

const initialState: AuthFormState = {
  error: "",
  success: "",
};

export const SignupForm = () => {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">สร้างบัญชีใหม่</CardTitle>
        <p className="text-sm text-muted-foreground">
          กรอกข้อมูลเพื่อสร้างบัญชีและโปรไฟล์ใน Supabase
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction} ref={formRef}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">ชื่อ-นามสกุล</Label>
              <Input id="full_name" name="full_name" placeholder="กรอกชื่อเต็ม" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">ชื่อเล่น</Label>
              <Input id="nickname" name="nickname" placeholder="ชื่อเล่น" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
            <Input id="phone" name="phone" placeholder="เบอร์โทร" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              required
            />
          </div>

          <FormSubmitButton idleText="สมัครสมาชิก" pendingText="กำลังสมัครสมาชิก..." />
        </form>
        <div className="mt-6 space-y-3">
          {state.error && (
            <Alert variant="destructive">
              <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
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
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p>
          มีบัญชีอยู่แล้วใช่ไหม?{" "}
          <Link href="/login" className="text-primary underline">
            ไปที่หน้า Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
