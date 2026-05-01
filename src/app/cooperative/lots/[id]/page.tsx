// src/app/cooperative/lots/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useLot } from "@/hooks/useLot";
import { useState } from "react";
import api from "@/lib/api";

export default function LotDetail() {
  const { id } = useParams();
  const router = useRouter();

  const { data: lot, isLoading } = useLot(id as string);

  const [poidsVerifie, setPoidsVerifie] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  if (isLoading) return <p>Chargement...</p>;

  const variation =
    lot?.poids && poidsVerifie
      ? Math.abs(Number(poidsVerifie) - lot.poids) / lot.poids
      : 0;

  const handleValider = async () => {
    setLoading(true);

    try {
      const res = await api.post("/api/transferts/", {
        lot: lot.id,
        poids_verifie: Number(poidsVerifie),
        observations: "Validation coopérative",
      });

      setTxHash(res.data.tx_hash);

      setTimeout(() => {
        router.push("/cooperative/dashboard");
      }, 2000);
    } catch (err) {
      alert("Erreur transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f6f1e7", minHeight: "100vh" }}
         className="p-6">

      <h1 className="text-xl font-bold mb-4"
          style={{ color: "#5c3a21" }}>
        Détail Lot
      </h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p><b>Nom:</b> {lot.nom}</p>
        <p><b>Poids déclaré:</b> {lot.poids} kg</p>
        <p><b>Agriculteur:</b> {lot.agriculteur?.nom}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Validation réception</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Poids vérifié (kg)"
          value={poidsVerifie}
          onChange={(e) => setPoidsVerifie(e.target.value)}
        />

        {variation > 0.05 && (
          <p className="text-red-600 text-sm mb-2">
            ⚠ Écart supérieur à 5%
          </p>
        )}

        <button
          onClick={handleValider}
          disabled={loading}
          className="bg-[#5c3a21] text-white px-4 py-2 rounded"
        >
          {loading ? "Transaction..." : "Valider réception"}
        </button>

        {txHash && (
          <p className="mt-3 text-green-700">
            TX: {txHash}
          </p>
        )}
      </div>
    </div>
  );
}

