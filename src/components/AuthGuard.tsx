// src/components/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // On récupère les infos
  const token = Cookies.get("access_token");
  const role = Cookies.get("role")?.toLowerCase();
  const rolesString = allowedRoles?.join(",");

  useEffect(() => {
    // 1. Signaler que le composant est monté (client-side)
    setIsMounted(true);

    // 2. Logique de redirection
    if (!token) {
      router.push("/login");
      return;
    }

    if (rolesString) {
      const allowedList = rolesString.split(",").map(r => r.toLowerCase());
      if (!allowedList.includes(role || "")) {
        router.push("/login");
      }
    }
  }, [token, role, rolesString, router]);

  // SOLUTION AU HYDRATION ERROR : 
  // Si on est encore sur le serveur (isMounted est false), on ne rend RIEN.
  // Cela garantit que le HTML serveur est vide et que le client prend le relais proprement.
  if (!isMounted || !token) {
    return null; 
  }

  return <>{children}</>;
}
