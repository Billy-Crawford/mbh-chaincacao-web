// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();

  const [telephone, setTelephone] = useState("+228 "); // Espace ajouté pour le confort
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation : Si PIN commence par 1 -> Coop, si commence par 2 -> Exportateur
    setTimeout(() => {
      let simulatedRole = "cooperative";
      if (pin.startsWith("2")) simulatedRole = "exportateur";

      // On crée les cookies manuellement
      Cookies.set("access_token", "fake_token_123");
      Cookies.set("role", simulatedRole);

      if (simulatedRole === "exportateur") {
        router.push("/exportateur/dashboard");
      } else {
        router.push("/cooperative/dashboard");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f6f1e7]">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white border border-[#e7d7c1]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-1 text-[#5c3a21]">
            ChainCacao
          </h1>
          <p className="text-xs font-medium uppercase tracking-widest text-[#2f6b3f]">
            Traçabilité & Export Cacao
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
              Numéro de téléphone
            </label>
            <input
              className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl focus:ring-2 focus:ring-[#5c3a21] outline-none transition-all text-sm"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+228 XX XX XX XX"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
              Code PIN (4 chiffres)
            </label>
            <input
              className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl focus:ring-2 focus:ring-[#5c3a21] outline-none transition-all text-center text-xl tracking-[1em] font-bold"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} // Autorise uniquement les chiffres
              placeholder="••••"
              type="password"
              maxLength={4}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs text-red-600 text-center font-medium">
                ⚠️ {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl font-bold text-white shadow-lg shadow-[#5c3a21]/20 transition-all active:scale-[0.98]"
            style={{
              background: loading ? "#8b6b5c" : "#5c3a21",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Vérification..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <button
              onClick={() => router.push("/register")}
              className="font-bold text-[#2f6b3f] hover:underline"
            >
              Créer un profil
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
