// src/app/exportateur/lots/page.tsx

"use client";

import { useLots } from "@/hooks/useLots";

export default function ExportLotsPage() {
  const { data } = useLots();
  const lots = data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold">Lots disponibles</h1>
        <button className="bg-[#D97706] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#B45309]">
          Importer un lot externe
        </button>
      </div>

      <div className="bg-[#E5E7EB]/30 rounded-2xl p-6">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-gray-400 border-b border-gray-200">
              <th className="text-left font-medium pb-2">ID LOT</th>
              <th className="text-left font-medium pb-2">CULTURE</th>
              <th className="text-left font-medium pb-2">POIDS</th>
              <th className="text-left font-medium pb-2">PROVENANCE</th>
              <th className="text-center font-medium pb-2">STATUT EUDR</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lots.map((lot: any) => (
              <tr key={lot.id} className="group">
                <td className="py-4 font-bold text-gray-400">#{lot.id}</td>
                <td className="py-4 italic">Cacao</td>
                <td className="py-4 font-bold">{lot.poids} kg</td>
                <td className="py-4 text-gray-500">Coop. Kloto</td>
                <td className="py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    lot.statut === 'cooperative' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {lot.statut === 'cooperative' ? 'Conforme' : 'En attente'}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-[11px] font-bold bg-white border border-gray-200 px-3 py-1 rounded shadow-sm hover:bg-gray-50">
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

