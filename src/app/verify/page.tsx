// src/app/verify/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function VerifyPage() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/verify/${id}/`);
      setResult(res.data);
    } catch (err: any) {
      setResult({ error: "Lot introuvable" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1f2937] font-sans">
      {/* HEADER MINIMALISTE */}
      <header className="max-w-5xl mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#10B981] rounded-sm" />
          <span className="font-bold text-sm">ChainCacao</span>
          <span className="text-[10px] text-gray-400 ml-2">Vérification publique</span>
        </div>
        <div className="flex gap-4 text-[10px] font-bold text-gray-500 uppercase">
          <span>FR</span>
          <span className="opacity-30">EN</span>
          <span className="lowercase font-normal border-l pl-4">verify.chaincacao.org</span>
        </div>
      </header>

      {/* SECTION RECHERCHE */}
      <main className="max-w-3xl mx-auto pt-12 pb-20 px-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Vérifiez un lot de cacao ou café togolais</h1>
        <p className="text-xs text-gray-500 mb-8 max-w-md mx-auto">
          Entrez l'identifiant du lot ou scannez le QR code du certificat pour consulter l'historique complet de traçabilité blockchain.
        </p>

        <div className="flex justify-center items-center gap-2 max-w-lg mx-auto mb-12">
          <input
            className="flex-1 border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
            placeholder="LOT-001"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button className="text-[11px] font-bold text-gray-500 px-4 flex items-center gap-2">
            📷 Scanner
          </button>
          <button 
            onClick={verify}
            disabled={loading}
            className="bg-[#1D4ED8] text-white px-8 py-3 rounded text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            {loading ? "..." : "Vérifier"}
          </button>
        </div>

        {/* RÉSULTATS DE VÉRIFICATION */}
        {result && !result.error && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* BANDEAU DE CONFORMITÉ */}
            <div className="bg-[#ECFDF5] border border-[#10B981]/30 p-6 rounded-lg flex items-start gap-4 text-left">
              <div className="bg-[#10B981] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">✓</div>
              <div>
                <div className="flex items-center gap-2">
                   <h2 className="text-[#065F46] font-bold">Lot conforme EUDR 2025</h2>
                   <span className="text-[10px] font-mono text-[#065F46]/60">#{result.id || id}</span>
                </div>
                <p className="text-[11px] text-[#065F46] opacity-80 mt-1">
                  Ce lot a été tracé de bout en bout sur la blockchain Polygon. Sa conformité au règlement européen anti-déforestation est vérifiée.
                </p>
              </div>
            </div>

            {/* GRILLE D'INFORMATIONS */}
            <div className="grid grid-cols-2 gap-12 text-left">
              
              {/* COLONNE GAUCHE : INFOS LOT & MAP */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Informations du lot</h3>
                  <div className="space-y-2 text-[11px]">
                    <DataRow label="Identifiant" value={result.id || id} />
                    <DataRow label="Produit" value={result.culture || "Cacao"} />
                    <DataRow label="Poids certifié" value={`${result.poids} kg`} />
                    <DataRow label="Date de récolte" value="10 avr. 2026" />
                    <DataRow label="Producteur" value="NGARTOBAYE Oumarou Billy" />
                    <DataRow label="Coopérative" value="Coopérative de Kloto" />
                    <DataRow label="Exportateur" value="TOGO EXPORT SARL" />
                    <DataRow label="Hash blockchain" value="0x7f2a...d4b1" isMono />
                  </div>
                </section>

                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Origine géographique</h3>
                  <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4">
                     {/* Placeholder pour la Map */}
                     <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-[10px]">Google Maps View</div>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <DataRow label="Latitude" value="6.8920° N" />
                    <DataRow label="Longitude" value="0.8481° E" />
                    <DataRow label="Non-déforestation" value="Vérifiée ✓" color="text-green-600" />
                  </div>
                </section>
              </div>

              {/* COLONNE DROITE : TRAÇABILITÉ & CERTIFICAT */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Historique de traçabilité</h3>
                  <div className="space-y-6 relative ml-1">
                    <TraceStep title="Enregistrement agriculteur" date="10/04/2026 — 09:12 UTC+0" active />
                    <TraceStep title="Réception coopérative de Kloto" date="12/04/2026 — 14:35 UTC+0" active />
                    <TraceStep title="Transformation — Kloto Agro" date="13/04/2026 — 11:00 UTC+0" active />
                    <TraceStep title="Réception exportateur" date="15/04/2026 — 08:20 UTC+0" isLast active />
                  </div>
                </section>

                <section className="pt-6 text-center border-t border-gray-100">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6">Certificat numérique</h3>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 p-1 border border-gray-200 rounded">
                       <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[8px] text-gray-300">QR CODE</div>
                    </div>
                    <p className="text-[9px] text-green-600 font-bold uppercase">Signature blockchain valide</p>
                    <button className="w-full bg-[#1D4ED8] text-white py-2.5 rounded text-[11px] font-bold shadow-md">
                      Télécharger le certificat PDF
                    </button>
                    <button className="text-[10px] text-gray-400 font-medium hover:underline">Voir sur Polygonscan</button>
                  </div>
                </section>
              </div>

            </div>
          </div>
        )}

        {/* ERREUR */}
        {result?.error && (
          <div className="mt-12 p-6 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-red-600 font-bold text-sm">❌ {result.error}</p>
            <p className="text-xs text-red-400 mt-1">Veuillez vérifier l'identifiant et réessayer.</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= COMPOSANTS DE PRÉSENTATION ================= */

function DataRow({ label, value, isMono, color }: any) {
  return (
    <div className="flex justify-between border-b border-gray-50 pb-1.5">
      <span className="text-gray-400">{label}</span>
      <span className={`font-bold ${isMono ? 'font-mono' : ''} ${color || 'text-gray-800'}`}>{value}</span>
    </div>
  );
}

function TraceStep({ title, date, active, isLast }: any) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && <div className="absolute left-[4px] top-4 w-[1px] h-full bg-gray-100" />}
      <div className={`w-[9px] h-[9px] rounded-full mt-1 z-10 ${active ? 'bg-[#10B981]' : 'bg-gray-200'}`} />
      <div>
        <p className="font-bold text-gray-800 leading-tight">{title}</p>
        <p className="text-[9px] text-gray-400 mt-0.5">{date}</p>
      </div>
    </div>
  );
}