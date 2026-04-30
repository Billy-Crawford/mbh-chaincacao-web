"use client";

import { useParams, useRouter } from "next/navigation";
import { useLot } from "@/hooks/useLots"; // Import corrigé
import { useState } from "react";
import api from "@/lib/api";

export default function LotDetail() {
  const { id } = useParams();
  const router = useRouter();

  // On utilise le hook corrigé
  const { data: lot, isLoading } = useLot(id as string);

  const [poidsVerifie, setPoidsVerifie] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  if (isLoading) return <p className="p-6 text-center">Chargement...</p>;
  if (!lot) return <p className="p-6 text-center text-red-500">Lot introuvable.</p>;

  const variation =
    lot?.poids && poidsVerifie
      ? Math.abs(Number(poidsVerifie) - lot.poids) / lot.poids
      : 0;

  const handleValider = async () => {
    if (!poidsVerifie) return alert("Veuillez saisir le poids vérifié");
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
      alert("Erreur transaction : vérifiez les données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#f6f1e7]">
      <h1 className="text-xl font-bold mb-4 text-[#5c3a21]">Détail Lot #{lot.id}</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="text-sm"><b>Nom:</b> {lot.nom || "Lot sans nom"}</p>
        <p className="text-sm"><b>Poids déclaré:</b> {lot.poids} kg</p>
        <p className="text-sm"><b>Agriculteur:</b> {lot.agriculteur?.username || "Inconnu"}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2 text-[#2f6b3f]">Validation réception</h2>
        <input
          type="number"
          className="border p-2 w-full mb-2 rounded outline-none focus:ring-1 focus:ring-[#5c3a21]"
          placeholder="Poids vérifié (kg)"
          value={poidsVerifie}
          onChange={(e) => setPoidsVerifie(e.target.value)}
        />

        {variation > 0.05 && (
          <div className="bg-red-50 p-2 mb-2 rounded border border-red-100">
            <p className="text-red-600 text-[11px] font-bold">⚠ Écart de { (variation * 100).toFixed(1) }% détecté</p>
          </div>
        )}

        <button
          onClick={handleValider}
          disabled={loading}
          className="w-full bg-[#5c3a21] text-white px-4 py-2 rounded font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Enregistrement sur la Blockchain..." : "Valider réception"}
        </button>

        {txHash && (
          <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded">
            <p className="text-[10px] text-green-700 break-all font-mono">
              <b>TX HASH:</b> {txHash}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}