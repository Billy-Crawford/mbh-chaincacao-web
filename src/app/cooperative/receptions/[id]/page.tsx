// src/app/cooperative/receptions/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useLot } from "@/hooks/useLots";
import { useState } from "react";
import api from "@/lib/api";

export default function LotDetail() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const { data: lot, isLoading } = useLot(id);

  const [poidsVerifie, setPoidsVerifie] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>("");

  // =========================
  // LOADING / ERROR STATES
  // =========================
  if (isLoading) {
    return (
      <p className="p-6 text-center animate-pulse">
        Chargement des données du lot...
      </p>
    );
  }

  if (!lot) {
    return (
      <p className="p-6 text-center text-red-500 font-bold">
        Lot introuvable.
      </p>
    );
  }

  // =========================
  // SAFE VALUES
  // =========================
  const poidsDeclare = Number(lot.poids_kg || 0);
  const poidsVerifieNum = Number(poidsVerifie || 0);

  const variation =
    poidsDeclare > 0 && poidsVerifieNum > 0
      ? Math.abs(poidsVerifieNum - poidsDeclare) / poidsDeclare
      : 0;

  // =========================
  // ETAPE LOGIQUE
  // =========================
  const getEtape = (): string => {
    const statut = lot.statut;

    if (statut === "cree") return "ferme_cooperative";
    if (statut === "en_transit") return "cooperative_transformateur";

    return "ferme_cooperative";
  };

  // =========================
  // VALIDATION API
  // =========================
  const handleValider = async () => {
    if (!poidsVerifie) {
      alert("Veuillez saisir le poids vérifié.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        lot: String(lot.id), // 🔥 UUID string obligatoire
        poids_verifie: poidsVerifieNum,
        etape: getEtape(),
        notes: "Réception coopérative - pesée contrôlée",
      };

      console.log("PAYLOAD TRANSFERT:", payload);

      const res = await api.post("/api/transferts/", payload);

      const tx =
        res.data?.transfert?.tx_hash ||
        res.data?.tx_hash ||
        null;

      if (tx) setTxHash(tx);

      alert("✅ Réception validée avec succès");

      setTimeout(() => {
        router.push("/cooperative/dashboard");
      }, 1200);
    } catch (err: any) {
      console.error("❌ ERREUR TRANSFERT:", err);

      const data = err.response?.data;

      const message =
        data?.error ||
        JSON.stringify(data?.details) ||
        data?.detail ||
        "Erreur serveur inconnue";

      alert(`❌ Échec : ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="p-6 min-h-screen bg-[#f6f1e7] text-gray-800">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => router.back()}
          className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6 hover:text-gray-600"
        >
          ← Retour
        </button>

        <h1 className="text-2xl font-black mb-6 text-[#5c3a21]">
          Lot #{String(lot.id).slice(0, 8)}
        </h1>

        {/* ================= DATA ================= */}
        <div className="bg-white p-6 rounded-2xl border mb-6">
          <p className="font-bold">Producteur :</p>
          <p>{lot.agriculteur_detail?.username ?? "Inconnu"}</p>

          <p className="font-bold mt-3">Poids déclaré :</p>
          <p className="text-blue-600 font-bold">{poidsDeclare} kg</p>
        </div>

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-2xl border">

          <label className="text-xs font-bold uppercase text-gray-500">
            Poids vérifié
          </label>

          <input
            type="number"
            value={poidsVerifie}
            onChange={(e) => setPoidsVerifie(e.target.value)}
            className="w-full mt-2 p-3 border rounded-lg"
            placeholder="Entrer poids réel"
          />

          {/* ALERT */}
          {variation > 0.05 && (
            <div className="mt-3 p-3 bg-red-50 text-red-600 text-xs rounded">
              ⚠️ Écart important détecté ({(variation * 100).toFixed(1)}%)
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleValider}
            disabled={loading}
            className="w-full mt-5 bg-[#5c3a21] text-white py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? "Validation..." : "Certifier réception"}
          </button>

          {/* TX */}
          {txHash && (
            <p className="mt-4 text-green-600 text-xs break-all">
              TX: {txHash}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

