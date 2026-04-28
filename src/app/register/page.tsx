// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import direct pour simuler la session

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nom: "",
    telephone: "+228 ",
    pin: "",
    role: "cooperative",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.nom || form.pin.length < 4) {
      setError("Veuillez remplir tous les champs (PIN à 4 chiffres)");
      return;
    }

    setLoading(true);
    setError("");

    // --- SIMULATION BACKEND ---
    setTimeout(() => {
      console.log("Compte simulé créé:", form);
      
      // On redirige vers le login sans appeler l'API
      setLoading(false);
      router.push("/login");
    }, 1000); 
    // --------------------------
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f6f1e7]">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white border border-[#e7d7c1]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-1 text-[#5c3a21]">Bienvenue</h1>
          <p className="text-xs font-medium uppercase tracking-widest text-[#2f6b3f]">
            Mode Simulation (Sans Backend)
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Nom complet</label>
            <input
              className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl outline-none text-sm"
              placeholder="Ex: Oumarou Billy"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Téléphone</label>
            <input
              className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl outline-none text-sm"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">PIN (4 chiffres)</label>
            <input
              className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl text-center text-xl tracking-[1em] font-bold"
              type="password"
              maxLength={4}
              value={form.pin}
              onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Type de profil</label>
            <select
              className="w-full p-3 bg-gray-50 border border-[#e7d7c1] rounded-xl text-sm appearance-none cursor-pointer"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="cooperative">Coopérative</option>
              <option value="exportateur">Exportateur</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl font-bold text-white mt-2"
            style={{ background: loading ? "#8b6b5c" : "#5c3a21" }}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center text-sm">
          Déjà inscrit ? <button onClick={() => router.push("/login")} className="font-bold text-[#2f6b3f]">Se connecter</button>
        </div>
      </div>
    </div>
  );
}