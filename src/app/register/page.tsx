// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "cooperative",
    telephone: "+228 ",
    village: "",
    region: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Nettoyage simple du téléphone avant envoi
      const payload = { ...form, telephone: form.telephone.trim() };
      await authService.register(payload);
      // Redirection vers le login après succès
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        "Erreur lors de l'inscription. Vérifiez que le nom d'utilisateur n'est pas déjà pris."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f1e7] py-12 px-4">
      <div className="w-full max-w-lg p-8 rounded-2xl shadow-xl bg-white border border-[#e7d7c1]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-1 text-[#5c3a21]">ChainCacao</h1>
          <p className="text-xs font-medium uppercase tracking-widest text-[#2f6b3f]">
            Création de compte backend
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* USERNAME */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Nom d'utilisateur</label>
              <input
                name="username"
                className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl outline-none text-sm"
                placeholder="ex: aminata_coop"
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Email</label>
              <input
                name="email"
                type="email"
                className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl outline-none text-sm"
                placeholder="ex: contact@cacao.tg"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TELEPHONE */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Téléphone</label>
              <input
                name="telephone"
                className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl outline-none text-sm"
                value={form.telephone}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Mot de passe</label>
              <input
                name="password"
                type="password"
                className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl outline-none text-sm"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* VILLAGE */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Village / Ville</label>
              <input
                name="village"
                className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl outline-none text-sm"
                placeholder="ex: Kpalimé"
                onChange={handleChange}
                required
              />
            </div>

            {/* REGION */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Région</label>
              <input
                name="region"
                className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl outline-none text-sm"
                placeholder="ex: Plateaux"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Type de profil</label>
            <select
              name="role"
              className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl text-sm appearance-none cursor-pointer outline-none"
              value={form.role}
              onChange={handleChange}
            >
              <option value="cooperative">Coopérative (Collecte)</option>
              <option value="transformateur">Transformateur (Traitement)</option>
              <option value="exportateur">Exportateur (Export)</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98]"
            style={{ background: loading ? "#8b6b5c" : "#5c3a21" }}
          >
            {loading ? "Traitement..." : "Créer le compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <button onClick={() => router.push("/login")} className="font-bold text-[#2f6b3f] hover:underline">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}