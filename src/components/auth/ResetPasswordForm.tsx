"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type ResetPasswordFormProps = {
  code?: string;
};

type SessionState =
  | { status: "verifying" }
  | { status: "ready" }
  | { status: "error"; message: string }
  | { status: "success" };

const clearAuthParamsFromUrl = (removeCodeParam?: boolean) => {
  if (typeof window === "undefined") {
    return;
  }
  const url = new URL(window.location.href);
  url.hash = "";
  if (removeCodeParam) {
    url.searchParams.delete("code");
  }
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
};

export const ResetPasswordForm = ({ code }: ResetPasswordFormProps) => {
  const supabase = useMemo(() => createClient(), []);
  const [sessionState, setSessionState] = useState<SessionState>({ status: "verifying" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [resolvedCode, setResolvedCode] = useState(code);
  const [hasCheckedCodeParam, setHasCheckedCodeParam] = useState(Boolean(code));

  useEffect(() => {
    if (code) {
      setResolvedCode(code);
      setHasCheckedCodeParam(true);
      return;
    }

    if (typeof window === "undefined") {
      setHasCheckedCodeParam(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");
    if (codeParam) {
      setResolvedCode(codeParam);
    }
    setHasCheckedCodeParam(true);
  }, [code]);

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      const hashParams =
        typeof window !== "undefined" && window.location.hash
          ? new URLSearchParams(window.location.hash.slice(1))
          : null;
      const accessToken = hashParams?.get("access_token");
      const refreshToken = hashParams?.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (cancelled) {
          return;
        }

        if (sessionError) {
          setSessionState({ status: "error", message: sessionError.message });
        } else {
          setSessionState({ status: "ready" });
          clearAuthParamsFromUrl();
        }
        return;
      }

      if (!resolvedCode) {
        if (!hasCheckedCodeParam) {
          return;
        }
        if (!cancelled) {
          setSessionState({
            status: "error",
            message: "ไม่พบโค้ดหรือโทเค็นสำหรับรีเซ็ตรหัสผ่าน",
          });
        }
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(resolvedCode);

      if (cancelled) {
        return;
      }

      if (exchangeError) {
        setSessionState({ status: "error", message: exchangeError.message });
      } else {
        setSessionState({ status: "ready" });
        clearAuthParamsFromUrl(true);
      }
    };

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [hasCheckedCodeParam, resolvedCode, supabase]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      setFormError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setUpdating(true);
    setFormError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setFormError(updateError.message);
        return;
      }

      setSessionState({ status: "success" });
      setPassword("");
      setConfirmPassword("");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">ตั้งรหัสผ่านใหม่</CardTitle>
        <p className="text-sm text-muted-foreground">
          ใส่รหัสผ่านใหม่ของคุณหลังจากยืนยันลิงก์จากอีเมลแล้ว
        </p>
      </CardHeader>
      <CardContent>
        {sessionState.status === "verifying" ? (
          <p className="text-sm text-muted-foreground">กำลังตรวจสอบลิงก์รีเซ็ตรหัสผ่าน...</p>
        ) : sessionState.status === "success" ? (
          <Alert variant="success">
            <AlertTitle>ตั้งรหัสผ่านสำเร็จ</AlertTitle>
            <AlertDescription>
              คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว
            </AlertDescription>
          </Alert>
        ) : sessionState.status === "error" ? (
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
              <AlertDescription>
                {sessionState.message ?? "ไม่สามารถตรวจสอบลิงก์รีเซ็ตรหัสผ่านได้"}
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              กรุณาขอรีเซ็ตรหัสผ่านใหม่อีกครั้ง แล้วกดลิงก์ล่าสุดจากอีเมล
            </p>
            <Button asChild variant="outline">
              <Link href="/forgot-password">ขอลิงก์ใหม่</Link>
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่านใหม่</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (formError) {
                    setFormError(null);
                  }
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">ยืนยันรหัสผ่านใหม่</Label>
              <Input
                id="confirm_password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (formError) {
                    setFormError(null);
                  }
                }}
                required
              />
            </div>
            {formError && (
              <Alert variant="destructive">
                <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? "กำลังบันทึกรหัสผ่าน..." : "บันทึกรหัสผ่านใหม่"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
        {sessionState.status === "success" ? (
          <Button asChild className="w-full">
            <Link href="/login">กลับไปหน้าเข้าสู่ระบบ</Link>
          </Button>
        ) : (
          <Link href="/login" className="text-primary underline">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};
