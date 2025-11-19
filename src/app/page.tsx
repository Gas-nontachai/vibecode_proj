"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function HomePage() {
  useAuthRedirect();
  return null;
}
