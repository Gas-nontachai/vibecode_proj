"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { Tables } from "@/lib/database.types";

type UseProfileResult = {
  profile: Tables["profiles"] | null;
  setProfile: React.Dispatch<React.SetStateAction<Tables["profiles"] | null>>;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  supabase: ReturnType<typeof createClient>;
};

type UseProfileOptions = {
  redirectToLoginOnError?: boolean;
};

export const useProfile = (
  { redirectToLoginOnError = false }: UseProfileOptions = {},
): UseProfileResult => {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Tables["profiles"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return { error: userError.message, profile: null };
    }

    if (!user) {
      router.replace("/login");
      return { error: null, profile: null };
    }

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return { error: profileError.message, profile: null };
    }

    return { error: null, profile: data };
  }, [router, supabase]);

  const applyResult = useCallback(
    (result: Awaited<ReturnType<typeof fetchProfile>>) => {
      if (result.error) {
        setError(result.error);
      } else {
        setProfile(result.profile);
      }
    },
    [],
  );

  const refreshProfile = useCallback(async () => {
    setError(null);
    setLoading(true);
    const result = await fetchProfile();
    applyResult(result);
    setLoading(false);
  }, [applyResult, fetchProfile]);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      setError(null);
      setLoading(true);
      const result = await fetchProfile();
      if (!active) {
        return;
      }
      applyResult(result);
      setLoading(false);
    };
    loadProfile();
    return () => {
      active = false;
    };
  }, [applyResult, fetchProfile]);

  useEffect(() => {
    if (!redirectToLoginOnError || !error) {
      return;
    }
    router.replace("/login");
  }, [error, redirectToLoginOnError, router]);

  return {
    profile,
    setProfile,
    loading,
    error,
    refreshProfile,
    supabase,
  };
};
