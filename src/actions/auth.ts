"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export type AuthFormState = {
  error?: string;
  success?: string;
};

const validateRequiredFields = (fields: Record<string, string | undefined>) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || !value.trim()) {
      return `กรุณากรอก${key}ให้ครบถ้วน`;
    }
  }
  return null;
};

export const signInAction = async (
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const supabase = await createServerSupabaseClient();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const errorMessage = validateRequiredFields({ "อีเมล": email, "รหัสผ่าน": password });
  if (errorMessage) {
    return { error: errorMessage };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email!.trim(),
    password: password!,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
};

export const signUpAction = async (
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const supabase = await createServerSupabaseClient();
  const fullName = formData.get("full_name")?.toString();
  const nickname = formData.get("nickname")?.toString();
  const phone = formData.get("phone")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const errorMessage = validateRequiredFields({
    "ชื่อ-นามสกุล": fullName,
    "อีเมล": email,
    "รหัสผ่าน": password,
  });
  if (errorMessage) {
    return { error: errorMessage };
  }

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email!.trim(),
    password: password!,
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (!data.user) {
    return { error: "ไม่สามารถสร้างบัญชีได้ โปรดลองอีกครั้ง" };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    full_name: fullName,
    nickname: nickname || null,
    phone: phone || null,
    email: email!.trim(),
  });

  if (profileError) {
    return { error: profileError.message };
  }

  return {
    success: "สมัครสมาชิกสำเร็จ! กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ",
  };
};

export const signOutAction = async () => {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
};

export const requestPasswordResetAction = async (
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const supabase = await createServerSupabaseClient();
  const email = formData.get("email")?.toString();

  const errorMessage = validateRequiredFields({ "อีเมล": email });
  if (errorMessage) {
    return { error: errorMessage };
  }

  const redirectTo = process.env.NEXT_PUBLIC_PASSWORD_RESET_REDIRECT

  const { error } = await supabase.auth.resetPasswordForEmail(email!.trim(), {
    redirectTo,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลเรียบร้อยแล้ว",
  };
};
