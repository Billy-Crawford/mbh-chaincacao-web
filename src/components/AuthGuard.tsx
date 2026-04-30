"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // On récupère les cookies
  const token = Cookies.get("access_token");
  const role = Cookies.get("role");

  useEffect(() => {
    setMounted(true);

    // 1. Si pas de token -> Login
    if (!token) {
      router.replace("/login");
      return;
    }

    // 2. Si le rôle n'est pas autorisé -> Login
    if (allowedRoles && role) {
      const isAuthorized = allowedRoles.map(r => r.toLowerCase()).includes(role.toLowerCase());
      if (!isAuthorized) {
        router.replace("/login");
      }
    }
  }, [token, role, router, allowedRoles]);

  // Pendant que le composant se "monte" ou si pas de token, on affiche rien
  if (!mounted || !token) {
    return null; 
  }

  return <>{children}</>;
}

