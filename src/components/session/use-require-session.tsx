"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./session-context";

export function useRequireSession() {
  const router = useRouter();
  const { user, loading } = useSession();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return { user, loading };
}
