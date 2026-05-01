// src/app/cooperative/receptions/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useLot } from "@/hooks/useLots";
import { useState } from "react";
import api from "@/lib/api";

export default function LotDetail() {
  const { id } = useParams();
  const router = useRouter();

  const { data: lot, isLoading } = useLot(id as string);

  const [poidsVerifie, setPoidsVerifie] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  if (isLoading) {
    return <p className="p-6 text-center animate-pulse">Chargement...</p>;
  }

  if (!lot) {
    return <p className="p-6 text-center text-red-500">Lot introuvable</p>;
  }

  const poidsDeclare = Number(lot.poids_kg);

  const ecart =
    poidsVerifie
      ? Math.abs(Number(poidsVerifie) - poidsDeclare)
      : 0;

  const handleValider = async () => {
    if (!poidsVerifie) return alert("Poids requis");

    setLoading(true);

    try {
      const res = await api.post("/api/transferts/", {
        lot: lot.id,
        poids_verifie: Number(poidsVerifie),
        etape: "cooperative_transformateur",
        notes: "Réception validée coopérative",
      });

      setTxHash(res.data?.transfert?.tx_hash);

      alert("Réception validée");

      setTimeout(() => {
        router.push("/cooperative/dashboard");
      }, 1000);

    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e7] p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-xl font-black mb-6">
          Validation LOT #{String(lot.id).slice(0, 8)}
        </h1>

        {/* INFO */}
        <div className="bg-white p-5 rounded-xl border mb-4">
          <p className="font-bold">Agriculteur</p>
          <p>{lot.agriculteur_detail?.username}</p>

          <p className="font-bold mt-3">Poids déclaré</p>
          <p className="text-blue-600 font-bold">{poidsDeclare} kg</p>
        </div>

        {/* FORM */}
        <div className="bg-white p-5 rounded-xl border">

          <label className="text-xs font-bold">Poids vérifié</label>

          <input
            type="number"
            className="w-full border p-3 rounded mt-2"
            value={poidsVerifie}
            onChange={(e) => setPoidsVerifie(e.target.value)}
          />

          {ecart > 8 && (
            <div className="mt-3 bg-red-50 text-red-600 p-2 text-xs rounded">
              ⚠ Écart critique ({ecart} kg)
            </div>
          )}

          <button
            onClick={handleValider}
            disabled={loading}
            className="w-full mt-4 bg-[#5c3a21] text-white py-3 rounded font-bold"
          >
            {loading ? "Validation..." : "Valider réception"}
          </button>

          {txHash && (
            <p className="text-green-600 text-xs mt-3 break-all">
              TX: {txHash}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}