// src/app/cooperative/receptions/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";
import Link from "next/link";

export default function ReceptionsPage() {
  const { data, isLoading, error } = useLots();
  const lots = Array.isArray(data) ? data : [];

  const stats = {
    total: lots.length,
    enTransit: lots.filter((l: any) => l.statut === "en_transit").length,
    receptionnes: lots.filter((l: any) => l.statut === "receptionne").length,
    exportes: lots.filter((l: any) => l.statut === "exporte").length,
  };

  if (isLoading)
    return (
      <div className="p-10 text-center font-serif italic text-gray-400">
        Chargement des lots...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Erreur lors de la récupération des lots.
      </div>
    );

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold">Réceptions</h1>
          <p className="text-xs text-gray-400 mt-1">
            {stats.total} lot(s) au total
          </p>
        </div>
        <Link
          href="/cooperative/dashboard"
          className="bg-[#1e60a3] text-white px-5 py-2 text-sm font-medium rounded-sm hover:bg-[#164d85] transition-colors"
        >
          Dashboard
        </Link>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} color="text-gray-800" />
        <StatCard label="En transit" value={stats.enTransit} color="text-orange-600" />
        <StatCard label="Réceptionnés" value={stats.receptionnes} color="text-blue-600" />
        <StatCard label="Exportés" value={stats.exportes} color="text-green-600" />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-sm font-serif">Liste des lots</h2>
          <span className="text-[10px] text-gray-400">
            {lots.length} résultat(s)
          </span>
        </div>

        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="p-4 text-left font-normal">ID</th>
              <th className="p-4 text-left font-normal">AGRICULTEUR</th>
              <th className="p-4 text-left font-normal">CULTURE</th>
              <th className="p-4 text-left font-normal">POIDS</th>
              <th className="p-4 text-left font-normal">DATE</th>
              <th className="p-4 text-left font-normal">STATUT</th>
              <th className="p-4 text-right font-normal"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {lots.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-gray-400 font-serif italic"
                >
                  Aucun lot disponible
                </td>
              </tr>
            )}
            {lots.map((lot: any) => (
              <tr
                key={lot.id}
                className="hover:bg-blue-50/30 transition-colors group"
              >
                <td className="p-4 font-serif text-gray-500">
                  #LOT-{String(lot.id).slice(0, 6)}
                </td>

                <td className="p-4 font-semibold uppercase tracking-tight">
                  {lot.agriculteur_detail?.username || "—"}
                </td>

                <td className="p-4 text-gray-400 italic">
                  {lot.espece || "—"}
                </td>

                <td className="p-4 font-bold">{lot.poids_kg} kg</td>

                <td className="p-4 text-gray-400">
                  {lot.date_recolte
                    ? new Date(lot.date_recolte).toLocaleDateString("fr-FR")
                    : "—"}
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      lot.statut === "cree"
                        ? "bg-orange-50 text-orange-500 border-orange-100"
                        : lot.statut === "en_transit"
                        ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                        : lot.statut === "receptionne"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : lot.statut === "certifie"
                        ? "bg-green-50 text-green-600 border-green-100"
                        : lot.statut === "exporte"
                        ? "bg-gray-100 text-gray-700 border-gray-200"
                        : "bg-gray-50 text-gray-500 border-gray-100"
                    }`}
                  >
                    {lot.statut === "cree"
                      ? "Créé"
                      : lot.statut === "en_transit"
                      ? "En transit"
                      : lot.statut === "receptionne"
                      ? "Reçu coopérative"
                      : lot.statut === "certifie"
                      ? "Certifié"
                      : lot.statut === "exporte"
                      ? "Exporté"
                      : "Inconnu"}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <Link
                    href={`/cooperative/receptions/${lot.id}`}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
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

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-1">{label}</p>
    </div>
  );
}
