// src/app/transformateur/lots/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";
import Link from "next/link";

export default function TransformateurLotsPage() {
  const { data, isLoading, error } = useLots();
  const lots = Array.isArray(data) ? data : [];

  if (isLoading)
    return <div className="p-10 text-center font-serif italic text-gray-400">Chargement...</div>;

  if (error)
    return <div className="p-10 text-center text-red-500">Erreur de chargement.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Lots reçus</h1>
        <p className="text-xs text-gray-400 mt-1">{lots.length} lot(s) assigné(s)</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-[13px]">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="p-4 text-left font-normal">ID LOT</th>
              <th className="p-4 text-left font-normal">AGRICULTEUR</th>
              <th className="p-4 text-left font-normal">ESPÈCE</th>
              <th className="p-4 text-left font-normal">POIDS</th>
              <th className="p-4 text-left font-normal">STATUT</th>
              <th className="p-4 text-right font-normal"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lots.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400 font-serif italic">
                  Aucun lot reçu
                </td>
              </tr>
            )}
            {lots.map((lot: any) => (
              <tr key={lot.id} className="hover:bg-gray-50/60 transition group">
                <td className="p-4 font-serif text-gray-500">
                  #LOT-{String(lot.id).slice(0, 6)}
                </td>
                <td className="p-4">{lot.agriculteur_detail?.username || "—"}</td>
                <td className="p-4 italic text-gray-500">{lot.espece || "Cacao"}</td>
                <td className="p-4 font-bold">{lot.poids_kg} kg</td>
                <td className="p-4">
                  <span className={`text-[10px] font-medium px-3 py-1 rounded-full ${
                    lot.statut === "receptionne"
                      ? "bg-blue-50 text-blue-700"
                      : lot.statut === "certifie"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {lot.statut}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/transformateur/lots/${lot.id}`}
                    className="text-[11px] font-bold bg-white border border-gray-200 px-3 py-1 rounded shadow-sm hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Détails →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

