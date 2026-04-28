// src/app/cooperative/receptions/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";
import Link from "next/link";

export default function ReceptionsPage() {
  const { data, isLoading } = useLots();
  const lots = data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Réceptions de lots</h1>
          <p className="text-xs text-gray-400">Gérez les arrivages des agriculteurs locaux</p>
        </div>
        <button className="bg-[#1D4ED8] text-white px-4 py-2 rounded text-[11px] font-bold shadow-sm hover:bg-blue-700 transition-all">
          + Nouvelle réception
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase tracking-tighter">
            <tr>
              <th className="text-left p-4 font-bold text-[10px]">ID Lot</th>
              <th className="text-left p-4 font-bold text-[10px]">Agriculteur</th>
              <th className="text-left p-4 font-bold text-[10px]">Culture</th>
              <th className="text-left p-4 font-bold text-[10px]">Poids</th>
              <th className="text-left p-4 font-bold text-[10px]">Date Arrivée</th>
              <th className="text-left p-4 font-bold text-[10px]">Statut</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lots.map((lot: any) => (
              <tr key={lot.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-4 font-bold text-gray-500">#{lot.id}</td>
                <td className="p-4 font-semibold uppercase tracking-tight">N. Billy</td>
                <td className="p-4 text-gray-400 italic">{lot.culture || "Cacao"}</td>
                <td className="p-4 font-bold">{lot.poids} kg</td>
                <td className="p-4 text-gray-400">12 avr. 2026</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    lot.statut === 'cree' 
                    ? 'bg-orange-50 text-orange-500 border-orange-100' 
                    : 'bg-teal-50 text-teal-600 border-teal-100'
                  }`}>
                    {lot.statut === 'cree' ? 'En attente' : 'Validé'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/cooperative/lots/${lot.id}`}
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