// src/app/cooperative/receptions/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useLot } from "@/hooks/useLots";
import { useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function LotDetail() {
  const { id } = useParams();
  const router = useRouter();

  const { data: lot, isLoading } = useLot(id as string);

  const [poidsVerifie, setPoidsVerifie] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [valide, setValide] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f1e7] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#5c3a21] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-serif italic">Chargement du lot...</p>
        </div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="min-h-screen bg-[#f6f1e7] flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border p-8 max-w-md text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h2 className="font-bold text-gray-800">Accès non autorisé</h2>
          <p className="text-sm text-gray-500">
            Ce lot ne vous est pas assigné ou n'existe pas.
          </p>
          <Link
            href="/cooperative/receptions"
            className="inline-block mt-2 bg-[#5c3a21] text-white px-6 py-2 rounded text-sm font-bold"
          >
            ← Retour aux réceptions
          </Link>
        </div>
      </div>
    );
  }

  const poidsDeclare = Number(lot.poids_kg);
  const ecart = poidsVerifie
    ? Math.abs(Number(poidsVerifie) - poidsDeclare)
    : 0;

  const dejaReceptionne = lot.statut === "receptionne" ||
    lot.statut === "certifie" ||
    lot.statut === "exporte";

  const handleValider = async () => {
    if (!poidsVerifie) return alert("Poids requis");
    setLoading(true);
    try {
      const res = await api.post(`/api/lots/${lot.id}/confirmer/`, {
        poids_verifie: Number(poidsVerifie),
        notes: "Réception validée coopérative",
      });
      setTxHash(res.data?.transfert?.tx_hash || "");
      setValide(true);
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // SUCCÈS
  if (valide) {
    return (
      <div className="min-h-screen bg-[#f6f1e7] flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border p-8 max-w-md text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h2 className="font-bold text-gray-800 text-lg">Réception confirmée</h2>
          <p className="text-sm text-gray-500">
            Le lot est maintenant <strong>réceptionné</strong> et prêt à être
            envoyé au transformateur depuis le dashboard.
          </p>
          {txHash && (
            <p className="text-[10px] font-mono text-gray-400 break-all bg-gray-50 p-2 rounded">
              TX: {txHash}
            </p>
          )}
          <button
            onClick={() => router.push("/cooperative/dashboard")}
            className="w-full bg-[#5c3a21] text-white py-3 rounded font-bold text-sm"
          >
            Aller au dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1e7] p-6">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/cooperative/receptions"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Retour
          </Link>
        </div>

        <h1 className="text-xl font-black">
          Validation LOT #{String(lot.id).slice(0, 8)}
        </h1>

        {/* STATUT DÉJÀ RÉCEPTIONNÉ */}
        {dejaReceptionne && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-700">
            ℹ️ Ce lot a déjà été réceptionné — statut actuel :{" "}
            <strong>{lot.statut}</strong>
          </div>
        )}

        {/* INFO LOT */}
        <div className="bg-white p-5 rounded-xl border space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Informations du lot
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Agriculteur</p>
              <p className="font-bold">{lot.agriculteur_detail?.username || "—"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Espèce</p>
              <p className="font-bold">{lot.espece || "—"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Poids déclaré</p>
              <p className="text-blue-600 font-bold text-lg">{poidsDeclare} kg</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Date de récolte</p>
              <p className="font-bold">
                {lot.date_recolte
                  ? new Date(lot.date_recolte).toLocaleDateString("fr-FR")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">GPS</p>
              <p className="font-mono text-xs">
                {lot.gps_latitude}°N, {lot.gps_longitude}°E
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Statut</p>
              <p className="font-bold">{lot.statut}</p>
            </div>
          </div>
        </div>

        {/* FORM VALIDATION */}
        {!dejaReceptionne && (
          <div className="bg-white p-5 rounded-xl border space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Validation de la réception
            </h2>

            <div>
              <label className="text-xs font-bold text-gray-600">
                Poids vérifié (kg)
              </label>
              <input
                type="number"
                className="w-full border p-3 rounded mt-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5c3a21]"
                placeholder={`Poids déclaré : ${poidsDeclare} kg`}
                value={poidsVerifie}
                onChange={(e) => setPoidsVerifie(e.target.value)}
              />
            </div>

            {poidsVerifie && (
              <div className={`p-3 rounded text-xs ${
                ecart > 8
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-green-50 text-green-700 border border-green-100"
              }`}>
                {ecart > 8
                  ? `⚠ Écart critique de ${ecart} kg — vérification requise`
                  : `✓ Écart acceptable : ${ecart} kg`}
              </div>
            )}

            <button
              onClick={handleValider}
              disabled={loading || !poidsVerifie}
              className="w-full bg-[#5c3a21] text-white py-3 rounded font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Validation en cours..." : "Valider la réception"}
            </button>
          </div>
        )}

        {/* INFO FLUX */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-700">
          <p className="font-bold mb-1">Flux de validation</p>
          <p>1. Valider la réception ici → statut passe à <strong>Réceptionné</strong></p>
          <p>2. Depuis le dashboard → envoyer au transformateur</p>
        </div>

      </div>
    </div>
  );
}