"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, type AuthFormState } from "@/actions/auth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormSubmitButton } from "@/components/forms/FormSubmitButton";

const initialState: AuthFormState = {
  error: "",
};

export const LoginForm = () => {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">เข้าสู่ระบบ</CardTitle>
        <p className="text-sm text-muted-foreground">
          ใส่อีเมลและรหัสผ่านที่สมัครไว้เพื่อเข้าสู่ Dashboard
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
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
          <FormSubmitButton idleText="ล็อกอิน" pendingText="กำลังเข้าสู่ระบบ..." />
        </form>
        {state.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p>
          ยังไม่มีบัญชี?{" "}
          <Link href="/signup" className="text-primary underline">
            สมัครสมาชิก
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
