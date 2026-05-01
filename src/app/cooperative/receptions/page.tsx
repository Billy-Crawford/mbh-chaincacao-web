// src/app/cooperative/receptions/page.tsx

"use client";

import { useLots } from "@/hooks/useLots";
import Link from "next/link";

export default function ReceptionsPage() {
  const { data, isLoading, error } = useLots();

  const lots = Array.isArray(data) ? data : [];

  if (isLoading)
    return (
      <div className="p-10 text-center text-sm">Chargement des lots...</div>
    );

  if (error)
    return (
      <div className="p-10 text-red-500">
        Erreur lors de la récupération des lots.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">AGRICULTEUR</th>
              <th className="p-4 text-left">CULTURE</th>
              <th className="p-4 text-left">POIDS</th>
              <th className="p-4 text-left">DATE</th>
              <th className="p-4 text-left">STATUT</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {lots.map((lot: any) => (
              <tr
                key={lot.id}
                className="hover:bg-blue-50/30 transition-colors group"
              >
                {/* ID */}
                <td className="p-4 font-bold text-gray-500">#{lot.id}</td>

                {/* AGRICULTEUR (CORRIGÉ) */}
                <td className="p-4 font-semibold uppercase tracking-tight">
                  {lot.agriculteur_detail?.username || "—"}
                </td>

                {/* CULTURE (CORRIGÉ) */}
                <td className="p-4 text-gray-400 italic">
                  {lot.espece || "—"}
                </td>

                {/* POIDS (CORRIGÉ) */}
                <td className="p-4 font-bold">{lot.poids_kg} kg</td>

                {/* DATE (backend dispo aussi possible) */}
                <td className="p-4 text-gray-400">
                  {lot.date_recolte
                    ? new Date(lot.date_recolte).toLocaleDateString("fr-FR")
                    : "—"}
                </td>

                {/* STATUT */}
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

                {/* ACTION */}
                <td className="p-4 text-right">
                  <Link
                    href={`/cooperative/receptions/${lot.id}`}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Détails
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
