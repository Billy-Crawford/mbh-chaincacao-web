// src/app/cooperative/receptions/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useLot } from "@/hooks/useLots";
import { useState } from "react";
import api from "@/lib/api";

export default function LotDetail() {
  const { id } = useParams();
  const router = useRouter();

  // Utilisation du hook pour récupérer les données fraîches du lot
  const { data: lot, isLoading } = useLot(id as string);

  const [poidsVerifie, setPoidsVerifie] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  if (isLoading) return <p className="p-6 text-center animate-pulse">Chargement des données du lot...</p>;
  if (!lot) return <p className="p-6 text-center text-red-500 font-bold">Lot introuvable.</p>;

  // Calcul de la variation basé sur 'poids_kg' (nom du champ dans ton Serializer Django)
  const variation =
    lot?.poids_kg && poidsVerifie
      ? Math.abs(Number(poidsVerifie) - lot.poids_kg) / lot.poids_kg
      : 0;

  const handleValider = async () => {
    if (!poidsVerifie) return alert("Veuillez saisir le poids vérifié par la coopérative.");
    setLoading(true);

    try {
      // Envoi vers /api/transferts/ avec les champs attendus par le modèle Django
      const res = await api.post("/api/transferts/", {
        lot: lot.id,
        poids_verifie: Number(poidsVerifie),
        etape: "ferme_cooperative", // Doit correspondre aux CHOICES du modèle
        notes: "Réception et pesée en coopérative",
        destinataire: lot.agriculteur, // L'ID de l'agriculteur (champ 'agriculteur' du serializer)
      });

      // Si le backend renvoie un tx_hash (succès blockchain)
      if (res.data.transfert?.tx_hash || res.data.tx_hash) {
        setTxHash(res.data.transfert?.tx_hash || res.data.tx_hash);
      }

      alert("✅ Réception validée et enregistrée sur la Blockchain !");

      setTimeout(() => {
        router.push("/cooperative/dashboard");
      }, 2500);
    } catch (err: any) {
      console.error("Erreur API:", err.response?.data);
      const message = err.response?.data?.error || "Erreur lors de la validation.";
      alert(`Échec : ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#f6f1e7] text-gray-800">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6 hover:text-gray-600 transition-colors"
        >
          ← Retour au Dashboard
        </button>

        <h1 className="text-2xl font-black mb-6 text-[#5c3a21] uppercase tracking-tighter">
          Inspection Lot #{lot.id?.toString().slice(0, 8)}
        </h1>

        {/* CARTE DES DONNÉES DÉCLARÉES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">Données d'origine (Agriculteur)</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Producteur</p>
              <p className="font-bold text-gray-900">{lot.agriculteur_detail?.username || "Inconnu"}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Espèce</p>
              <p className="font-bold text-gray-900">{lot.espece || "Cacao"}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Poids déclaré</p>
              <p className="font-bold text-[#1D4ED8] text-lg">{lot.poids_kg} kg</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Localisation</p>
              <p className="text-[11px] font-medium text-gray-600">
                Lat: {lot.gps_latitude?.toFixed(4)} / Long: {lot.gps_longitude?.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* FORMULAIRE DE PESÉE COOPÉRATIVE */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#2f6b3f]/10">
          <h2 className="text-[10px] font-black uppercase text-[#2f6b3f] mb-4 tracking-[0.2em]">Pesée de contrôle & Blockchain</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nouveau poids vérifié (kg)</label>
              <input
                type="number"
                className="text-xl font-bold border-2 border-gray-100 p-4 w-full rounded-xl outline-none focus:ring-2 focus:ring-[#5c3a21] focus:border-transparent transition-all"
                placeholder="Entrez le poids exact..."
                value={poidsVerifie}
                onChange={(e) => setPoidsVerifie(e.target.value)}
              />
            </div>

            {/* ALERTE ÉCART */}
            {variation > 0.05 && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-red-700 text-xs font-bold">Écart important détecté ({(variation * 100).toFixed(1)}%)</p>
                  <p className="text-red-500 text-[10px]">Une note explicative sera ajoutée à la transaction blockchain.</p>
                </div>
              </div>
            )}

            <button
              onClick={handleValider}
              disabled={loading}
              className="w-full bg-[#5c3a21] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-[#3e2716] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signature Blockchain...
                </span>
              ) : (
                "Certifier la réception"
              )}
            </button>

            {txHash && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl">
                <p className="text-[9px] text-green-600 font-bold uppercase mb-1">Transaction Polygon Confirmée</p>
                <p className="text-[10px] text-green-700 break-all font-mono">
                  {txHash}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
