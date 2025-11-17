"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (session?.user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };

    checkSession();
  }, [router, supabase]);

  return null;
}
