"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { v4 as uuid } from "uuid";

type UploadAvatarProps = {
  profileId: string;
  avatarUrl?: string | null;
  onAvatarUpdated?: (url: string) => void;
};

export const UploadAvatar = ({
  profileId,
  avatarUrl,
  onAvatarUpdated,
}: UploadAvatarProps) => {
  const supabase = useMemo(() => createClient(), []);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(avatarUrl ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(avatarUrl ?? "");
  }, [avatarUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop();
    const fileName = `${uuid()}.${ext ?? "png"}`;

    try {
      setError(null);
      setUploading(true);

      const { error: uploadError } = await supabase.storage
        .from("avatar_imgs")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatar_imgs").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profileId);

      if (updateError) {
        throw updateError;
      }

      setPreview(publicUrl);
      onAvatarUpdated?.(publicUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดขณะอัปโหลดรูปภาพ",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={handleFileChange}
      />
      {preview && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="avatar preview"
            className="h-16 w-16 rounded-full border border-border object-cover"
          />
          <p className="text-sm text-muted-foreground">
            ไฟล์ล่าสุด: {preview.split("/").pop()}
          </p>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {uploading && <p className="text-sm text-muted-foreground">กำลังอัปโหลด...</p>}
    </div>
  );
};
