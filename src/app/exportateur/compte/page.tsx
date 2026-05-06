// src/app/exportateur/compte/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function ExportComptePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/profile/");
        setUser(res.data);
      } catch (err) {
        console.error("Erreur chargement profil", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDeconnexion = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    router.push("/login");
  };

  if (isLoading)
    return (
      <div className="p-10 text-center font-serif italic text-gray-400">
        Chargement...
      </div>
    );

  if (!user)
    return (
      <div className="p-10 text-center text-red-500">
        Impossible de charger le profil.
      </div>
    );

  const initiales = user.username?.slice(0, 2).toUpperCase() || "EX";

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-bold">Paramètres du compte</h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 bg-[#FEF3C7] text-[#D97706] rounded-2xl flex items-center justify-center font-bold text-xl">
            {initiales}
          </div>
          <div>
            <h2 className="font-bold">{user.username}</h2>
            <p className="text-[11px] text-gray-400 italic">
              Rôle : {user.role}
            </p>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-50 pt-6">
          <Row label="Nom d'utilisateur" value={user.username} />
          <Row label="Email" value={user.email || "—"} />
          <Row label="Téléphone" value={user.telephone || "—"} />
          <Row label="Village" value={user.village || "—"} />
          <Row label="Région" value={user.region || "—"} />
          <Row label="Rôle" value={user.role} />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50">
          <button
            onClick={handleDeconnexion}
            className="px-6 py-3 border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
