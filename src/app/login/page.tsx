// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authService.login({ username, password });

      // Lecture correcte du rôle dans l'objet 'user' renvoyé par ton Django
      const userRole = data.user?.role?.toLowerCase();

      if (userRole === "exportateur") {
        router.push("/exportateur/dashboard");
      } else if (userRole === "cooperative") {
        router.push("/cooperative/dashboard");
      } else if (userRole === "transformateur") {
        router.push("/transformateur/dashboard");
      } else {
        setError("Rôle utilisateur non reconnu.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f6f1e7] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white border border-[#e7d7c1]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-1 text-[#5c3a21]">
            ChainCacao
          </h1>
          <p className="text-xs font-medium uppercase tracking-widest text-[#2f6b3f]">
            Connexion au réseau
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
              Nom d'utilisateur
            </label>
            <input
              className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl focus:ring-2 focus:ring-[#5c3a21] outline-none text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: bernard_export"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl focus:ring-2 focus:ring-[#5c3a21] outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs text-red-600 text-center font-medium">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98]"
            style={{ background: loading ? "#8b6b5c" : "#5c3a21" }}
          >
            {loading ? "Vérification..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center text-sm">
          Pas de compte ?{" "}
          <button
            onClick={() => router.push("/register")}
            className="font-bold text-[#2f6b3f]"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}
