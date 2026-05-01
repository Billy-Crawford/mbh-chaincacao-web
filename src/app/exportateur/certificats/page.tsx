// src/app/exportateur/certificats/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";
import { useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function CertificatsPage() {
  const { data, isLoading, error } = useLots();
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatedUrls, setGeneratedUrls] = useState<Record<string, string>>({});

  const lots = (Array.isArray(data) ? data : []).filter(
    (l: any) => l.statut === "exporte"
  );

  const handleGenererCertificat = async (lotId: string) => {
    setGenerating(lotId);
    try {
      const res = await api.get(`/api/lots/${lotId}/certificat/`);
      const url = res.data?.certificat_url;

      if (url) {
        setGeneratedUrls((prev) => ({ ...prev, [lotId]: url }));
        alert("Certificat EUDR généré ✅");
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur lors de la génération");
    } finally {
      setGenerating(null);
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-center font-serif italic text-gray-400">
        Chargement...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Erreur de chargement.
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-2xl font-serif font-medium mb-1">
            Certificats EUDR
          </h1>
          <p className="text-sm text-gray-500 font-serif italic">
            {lots.length} lot(s) exporté(s) — génération disponible
          </p>
        </div>

        {lots.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center">
            <p className="text-gray-400 font-serif italic text-sm">
              Aucun lot exporté pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {lots.map((lot: any) => {
              const lotId = lot.id;
              const shortId = String(lotId).slice(0, 6);
              const certificatUrl = generatedUrls[lotId] || lot.certificat_url;
              const isGenerating = generating === lotId;

              return (
                <div
                  key={lotId}
                  className="bg-white border border-gray-100 rounded-xl p-6 flex items-center justify-between shadow-sm"
                >
                  {/* INFOS LOT */}
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
                      📜
                    </div>
                    <div>
                      <p className="font-serif text-sm font-medium">
                        LOT-{shortId}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {lot.agriculteur_detail?.username || "—"} •{" "}
                        {lot.espece || "Cacao"} •{" "}
                        {lot.poids_kg} kg
                      </p>
                      {lot.tx_hash && (
                        <p className="text-[10px] font-mono text-gray-300 mt-1 truncate max-w-[240px]">
                          {lot.tx_hash}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-4">
                    {certificatUrl ? (
                      <>
                        <Link
                          href={certificatUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1e60a3] text-xs font-medium underline"
                        >
                          Télécharger →
                        </Link>
                        <button
                          onClick={() => handleGenererCertificat(lotId)}
                          disabled={isGenerating}
                          className="text-gray-400 text-xs hover:text-gray-600 transition"
                        >
                          {isGenerating ? "..." : "Régénérer"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleGenererCertificat(lotId)}
                        disabled={isGenerating}
                        className="bg-[#D97706] text-white px-4 py-2 text-xs font-medium rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? "Génération..." : "Générer certificat"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}