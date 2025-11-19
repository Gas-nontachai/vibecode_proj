"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export const useAuthRedirect = () => {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let subscribed = true;
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!subscribed) {
        return;
      }
      const session = data.session;
      if (session?.user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };

    checkSession();

    return () => {
      subscribed = false;
    };
  }, [router, supabase]);
};
