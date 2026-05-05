// src/app/exportateur/lots/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";
import { useRouter } from "next/navigation";

export default function ExportLotsPage() {
  const { data, isLoading, error } = useLots();
  const router = useRouter();

  const lots = Array.isArray(data) ? data : [];

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
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold">Lots disponibles</h1>
      </div>

      <div className="bg-[#E5E7EB]/30 rounded-2xl p-6">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-gray-400 border-b border-gray-200">
              <th className="text-left font-medium pb-2">ID LOT</th>
              <th className="text-left font-medium pb-2">ESPÈCE</th>
              <th className="text-left font-medium pb-2">POIDS</th>
              <th className="text-left font-medium pb-2">AGRICULTEUR</th>
              <th className="text-center font-medium pb-2">STATUT EUDR</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lots.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400 italic">
                  Aucun lot disponible
                </td>
              </tr>
            )}
            {lots.map((lot: any) => (
              <tr key={lot.id} className="group">
                <td className="py-4 font-bold text-gray-500">
                  #LOT-{String(lot.id).slice(0, 6)}
                </td>
                <td className="py-4 italic">{lot.espece || "Cacao"}</td>
                <td className="py-4 font-bold">{lot.poids_kg} kg</td>
                <td className="py-4 text-gray-500">
                  {lot.agriculteur_detail?.username || "—"}
                </td>
                <td className="py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      lot.statut === "exporte"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {lot.statut === "exporte" ? "Conforme" : "En attente"}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => router.push(`/exportateur/lots/${lot.id}`)}
                    className="text-[11px] font-bold bg-white border border-gray-200 px-3 py-1 rounded shadow-sm hover:bg-gray-50"
                  >
                    Gérer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

