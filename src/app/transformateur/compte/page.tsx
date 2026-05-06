// src/app/transformateur/compte/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function TransformateurComptePage() {
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
    return <div className="p-10 text-center font-serif italic text-gray-400">Chargement...</div>;

  if (!user)
    return <div className="p-10 text-center text-red-500">Impossible de charger le profil.</div>;

  const initiales = user.username?.slice(0, 2).toUpperCase() || "TR";

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-bold">Mon compte</h1>
        <p className="text-xs text-gray-400">Informations du transformateur</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-50">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
            {initiales}
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-lg">{user.username}</h2>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
              Transformateur certifié
            </p>
            <p className="text-xs text-gray-400">Rôle : {user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-6">
          <ProfileField label="Nom d'utilisateur" value={user.username} />
          <ProfileField label="Email" value={user.email || "—"} />
          <ProfileField label="Téléphone" value={user.telephone || "—"} />
          <ProfileField label="Village" value={user.village || "—"} />
          <ProfileField label="Région" value={user.region || "—"} />
        </div>

        <div className="mt-10">
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

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-[13px] font-semibold text-gray-800">{value}</p>
    </div>
  );
}

