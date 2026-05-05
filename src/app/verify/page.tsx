// src/app/verify/page.tsx
"use client";

import { useState } from "react";
// import api from "@/lib/api";
import Link from "next/link";

export default function VerifyPage() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!id.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lots/${id.trim()}/verify/`,
      );
      if (!res.ok) throw new Error("Lot introuvable");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ error: "Lot introuvable" });
    } finally {
      setLoading(false);
    }
  };

  //   const verify = async () => {
  //     if (!id.trim()) return;
  //     setLoading(true);
  //     setResult(null);
  //     try {
  //       const res = await api.get(`/api/lots/${id.trim()}/verify/`);
  //       setResult(res.data);
  //     } catch (err: any) {
  //       setResult({ error: "Lot introuvable" });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const lot = result?.lot;
  const transferts = result?.transferts || [];
  const blockchain = result?.blockchain || {};
  const eudrConforme = result?.eudr_conforme;

  const etapeLabels: any = {
    ferme_cooperative: "Enregistrement agriculteur",
    reception: "Réception coopérative",
    cooperative_transformateur: "Transfert → Transformateur",
    transformateur_exportateur: "Transfert → Exportateur",
    exportateur_europe: "Export → Europe",
  };

  return (
    <div className="min-h-screen bg-white text-[#1f2937] font-sans">
      {/* HEADER */}
      <header className="max-w-5xl mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#10B981] rounded-sm" />
          <span className="font-bold text-sm">ChainCacao</span>
          <span className="text-[10px] text-gray-400 ml-2">
            Vérification publique
          </span>
        </div>
        <div className="flex gap-4 text-[10px] font-bold text-gray-500 uppercase">
          <span>FR</span>
          <span className="opacity-30">EN</span>
          <span className="lowercase font-normal border-l pl-4">
            verify.chaincacao.org
          </span>
        </div>
      </header>

      {/* SEARCH */}
      <main className="max-w-3xl mx-auto pt-12 pb-20 px-6 text-center">
        <h1 className="text-2xl font-bold mb-2">
          Vérifiez un lot de cacao ou café togolais
        </h1>
        <p className="text-xs text-gray-500 mb-8 max-w-md mx-auto">
          Entrez l'identifiant du lot ou scannez le QR code du certificat pour
          consulter l'historique complet de traçabilité blockchain.
        </p>

        <div className="flex justify-center items-center gap-2 max-w-lg mx-auto mb-12">
          <input
            className="flex-1 border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            placeholder="UUID du lot"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verify()}
          />
          <button
            onClick={verify}
            disabled={loading}
            className="bg-[#1D4ED8] text-white px-8 py-3 rounded text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            {loading ? "..." : "Vérifier"}
          </button>
        </div>

        {/* ERREUR */}
        {result?.error && (
          <div className="mt-4 p-6 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-red-600 font-bold text-sm">❌ {result.error}</p>
            <p className="text-xs text-red-400 mt-1">
              Veuillez vérifier l'identifiant et réessayer.
            </p>
          </div>
        )}

        {/* RÉSULTATS */}
        {result && !result.error && lot && (
          <div className="space-y-8 text-left">
            {/* BANDEAU CONFORMITÉ */}
            {eudrConforme ? (
              <div className="bg-[#ECFDF5] border border-[#10B981]/30 p-6 rounded-lg flex items-start gap-4">
                <div className="bg-[#10B981] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[#065F46] font-bold">
                      Lot conforme EUDR 2025
                    </h2>
                    <span className="text-[10px] font-mono text-[#065F46]/60">
                      #{String(lot.id).slice(0, 8)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#065F46] opacity-80 mt-1">
                    Ce lot a été tracé de bout en bout sur la blockchain
                    Polygon. Sa conformité au règlement européen
                    anti-déforestation est vérifiée.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg flex items-start gap-4">
                <div className="bg-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  ⏳
                </div>
                <div>
                  <h2 className="text-orange-800 font-bold">
                    En attente de vérification blockchain
                  </h2>
                  <p className="text-[11px] text-orange-700 opacity-80 mt-1">
                    Ce lot est en cours de traçabilité. La conformité EUDR sera
                    confirmée une fois l'enregistrement blockchain finalisé.
                  </p>
                </div>
              </div>
            )}

            {/* GRILLE */}
            <div className="grid grid-cols-2 gap-12">
              {/* COLONNE GAUCHE */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Informations du lot
                  </h3>
                  <div className="space-y-2 text-[11px]">
                    <DataRow
                      label="Identifiant"
                      value={String(lot.id).slice(0, 8) + "..."}
                      isMono
                    />
                    <DataRow label="Produit" value={lot.espece || "Cacao"} />
                    <DataRow
                      label="Poids certifié"
                      value={`${lot.poids_kg} kg`}
                    />
                    <DataRow
                      label="Date de récolte"
                      value={
                        lot.date_recolte
                          ? new Date(lot.date_recolte).toLocaleDateString(
                              "fr-FR",
                            )
                          : "—"
                      }
                    />
                    <DataRow
                      label="Producteur"
                      value={lot.agriculteur_detail?.username || "—"}
                    />
                    <DataRow
                      label="Village"
                      value={lot.agriculteur_detail?.village || "—"}
                    />
                    <DataRow
                      label="Région"
                      value={lot.agriculteur_detail?.region || "—"}
                    />
                    <DataRow label="Statut" value={lot.statut} />
                    <DataRow
                      label="Hash blockchain"
                      value={
                        blockchain.tx_hash
                          ? `${blockchain.tx_hash.slice(0, 10)}...`
                          : "—"
                      }
                      isMono
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Origine géographique
                  </h3>
                  <div className="space-y-1 text-[11px]">
                    <DataRow
                      label="Latitude"
                      value={`${lot.gps_latitude}° N`}
                    />
                    <DataRow
                      label="Longitude"
                      value={`${lot.gps_longitude}° E`}
                    />
                    <DataRow
                      label="Non-déforestation"
                      value="Vérifiée ✓"
                      color="text-green-600"
                    />
                  </div>
                </section>
              </div>

              {/* COLONNE DROITE */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Historique de traçabilité
                  </h3>

                  <div className="space-y-6 relative ml-1">
                    {transferts.length === 0 && (
                      <p className="text-xs text-gray-400 italic">
                        Aucun transfert enregistré.
                      </p>
                    )}
                    {transferts.map((t: any, index: number) => (
                      <TraceStep
                        key={index}
                        title={etapeLabels[t.etape] || t.etape}
                        date={
                          t.date_transfert
                            ? new Date(t.date_transfert).toLocaleString("fr-FR")
                            : "—"
                        }
                        txHash={t.tx_hash || ""}
                        active
                        isLast={index === transferts.length - 1}
                      />
                    ))}
                  </div>
                </section>

                <section className="pt-6 text-center border-t border-gray-100">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6">
                    Certificat numérique
                  </h3>

                  <div className="flex flex-col items-center gap-4">
                    {lot.qr_code_url ? (
                      <img
                        src={lot.qr_code_url}
                        alt="QR Code"
                        className="w-20 h-20 border border-gray-200 rounded p-1"
                      />
                    ) : (
                      <div className="w-20 h-20 p-1 border border-gray-200 rounded bg-gray-50 flex items-center justify-center text-[8px] text-gray-300">
                        QR CODE
                      </div>
                    )}

                    {eudrConforme && (
                      <p className="text-[9px] text-green-600 font-bold uppercase">
                        Signature blockchain valide
                      </p>
                    )}

                    {lot.certificat_url ? (
                      <Link
                        href={lot.certificat_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#1D4ED8] text-white py-2.5 rounded text-[11px] font-bold shadow-md text-center block"
                      >
                        Télécharger le certificat PDF
                      </Link>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-400 py-2.5 rounded text-[11px] font-bold text-center">
                        Certificat non généré
                      </div>
                    )}

                    {blockchain.tx_hash &&
                      blockchain.tx_hash !== "Non enregistré" && (
                        <Link
                          href={`https://amoy.polygonscan.com/tx/0x${blockchain.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-gray-400 font-medium hover:underline"
                        >
                          Voir sur Polygonscan →
                        </Link>
                      )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* COMPOSANTS */
function DataRow({ label, value, isMono, color }: any) {
  return (
    <div className="flex justify-between border-b border-gray-50 pb-1.5">
      <span className="text-gray-400">{label}</span>
      <span
        className={`font-bold ${isMono ? "font-mono" : ""} ${color || "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
}

function TraceStep({ title, date, txHash, active, isLast }: any) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div className="absolute left-[4px] top-4 w-[1px] h-full bg-gray-100" />
      )}
      <div
        className={`w-[9px] h-[9px] rounded-full mt-1 z-10 shrink-0 ${
          active ? "bg-[#10B981]" : "bg-gray-200"
        }`}
      />
      <div>
        <p className="font-bold text-gray-800 leading-tight text-[11px]">
          {title}
        </p>
        <p className="text-[9px] text-gray-400 mt-0.5">{date}</p>
        {txHash && txHash !== "—" && (
          <p className="text-[8px] font-mono text-gray-300 mt-0.5 truncate max-w-[180px]">
            {txHash}
          </p>
        )}
      </div>
    </div>
  );
}
