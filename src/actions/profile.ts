"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { UpdateProfileActionState } from "./profile-state";

export const updateProfileAction = async (
  _prevState: UpdateProfileActionState,
  formData: FormData,
): Promise<UpdateProfileActionState> => {
  const supabase = await createServerSupabaseClient();
  const fullName = formData.get("full_name")?.toString().trim() ?? "";
  const nickname = formData.get("nickname")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";

  if (!fullName) {
    return { error: "กรุณากรอกชื่อ-นามสกุล" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { error: userError.message };
  }

  if (!user) {
    return { error: "กรุณาเข้าสู่ระบบก่อนอัปเดตข้อมูล" };
  }

  const { data, error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      nickname: nickname || null,
      phone: phone || null,
    })
    .eq("id", user.id)
    .select("*")
    .single();

  if (updateError || !data) {
    return {
      error: updateError?.message ?? "ไม่สามารถอัปเดตข้อมูลโปรไฟล์ได้",
    };
  }

  return {
    success: "อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว",
    profile: data,
  };
};
