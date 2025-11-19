"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordResetAction, type AuthFormState } from "@/actions/auth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";

const initialState: AuthFormState = {
  error: "",
  success: "",
};

export const ForgotPasswordForm = () => {
  const [state, formAction] = useActionState(requestPasswordResetAction, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">ลืมรหัสผ่าน</CardTitle>
        <p className="text-sm text-muted-foreground">
          ใส่อีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่านจากระบบ Supabase
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
          </div>
          <FormSubmitButton
            idleText="ส่งลิงก์รีเซ็ตรหัสผ่าน"
            pendingText="กำลังส่งอีเมล..."
          />
        </form>
        <div className="mt-4 space-y-3">
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
      <CardFooter className="flex w-full flex-col gap-2 text-sm text-muted-foreground">
        <Link href="/login" className="text-primary underline">
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </CardFooter>
    </Card>
  );
};
