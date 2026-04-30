"use client";

import { useLots } from "@/hooks/useLots";
import Link from "next/link";

export default function ReceptionsPage() {
  const { data, isLoading, error } = useLots();

  // Sécurité absolue : si data n'est pas un tableau, on force un tableau vide
  const lots = Array.isArray(data) ? data : [];

  if (isLoading) return <div className="p-10 text-center text-sm">Chargement des lots...</div>;
  if (error) return <div className="p-10 text-red-500">Erreur lors de la récupération des lots.</div>;

  return (
    <div className="space-y-6">
      {/* ... (Reste de ton header) */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-[12px]">
          {/* ... (Thead) */}
          <tbody className="divide-y divide-gray-50">
            {lots.map((lot: any) => (
              <tr key={lot.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-4 font-bold text-gray-500">#{lot.id}</td>
                <td className="p-4 font-semibold uppercase tracking-tight">
                    {lot.agriculteur_nom || "N. Billy"} 
                </td>
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
                  {/* Utilise l'ID dynamique pour le lien */}
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

