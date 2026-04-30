// src/app/cooperative/dashboard/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";
import { useState } from "react";
import Link from "next/link";

export default function CoopDashboard() {
  const { data, isLoading, error } = useLots();
  const [selectedLotId, setSelectedLotId] = useState<string | number | null>(null);

  // Sécurisation : On s'assure que lots est toujours un tableau
  const lots = Array.isArray(data) ? data : [];

  // CALCUL DES STATS (KPI) DYNAMIQUE
  const stats = {
    enAttente: lots.filter((l: any) => l.statut === "cree").length,
    valides: lots.filter((l: any) => l.statut === "reception" || l.statut === "cooperative").length,
    alertes: 0, // Logique à implémenter si un champ ecart existe
    totalPoids: lots.reduce((acc: number, l: any) => acc + (Number(l.poids_kg) || 0), 0)
  };

  // Sélection du lot pour le panneau de droite
  const selectedLot = selectedLotId 
    ? lots.find((l: any) => l.id === selectedLotId) 
    : lots.find((l: any) => l.statut === "cree") || lots[0];

  if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-500">Chargement des données temps réel...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">Erreur de connexion au serveur Django.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tableau de bord Coopérative</h1>
          <p className="text-xs text-gray-400 font-medium">
            Sync: {new Date().toLocaleTimeString('fr-FR')}
          </p>
        </div>
        <Link href="/cooperative/receptions" className="bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg text-[11px] font-bold shadow-sm hover:bg-blue-700 transition-all">
          + Réceptionner un lot
        </Link>
      </div>

      {/* KPI STATS */}
      <div className="grid grid-cols-4 gap-6">
        <StatItem label="En attente de réception" value={stats.enAttente} color="text-orange-500" />
        <StatItem label="Lots validés (Total)" value={stats.valides} color="text-teal-600" />
        <StatItem label="Poids total collecté" value={`${stats.totalPoids} kg`} color="text-blue-600" />
        <StatItem label="Alertes de poids" value={stats.alertes} color="text-red-500" />
      </div>

      <div className="grid grid-cols-12 gap-10">
        
        {/* TABLEAU DES FLUX (GAUCHE) */}
        <div className="col-span-7 space-y-6">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-500">Lots en transit</h2>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-[11px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-400 text-left">
                  <th className="p-4 font-semibold uppercase">ID Lot</th>
                  <th className="p-4 font-semibold uppercase">Agriculteur</th>
                  <th className="p-4 font-semibold uppercase">Poids</th>
                  <th className="p-4 font-semibold uppercase">Statut</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lots.length > 0 ? lots.map((lot: any) => (
                  <tr 
                    key={lot.id} 
                    onClick={() => setSelectedLotId(lot.id)}
                    className={`group cursor-pointer transition-all ${selectedLotId === lot.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="p-4 font-mono text-gray-400 text-[10px]">#{lot.id.toString().slice(0, 8)}...</td>
                    <td className="p-4 font-bold text-gray-700">
                        {lot.agriculteur_detail?.username || `ID: ${lot.agriculteur}`}
                    </td>
                    <td className="p-4 font-black text-gray-900">{lot.poids_kg} kg</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${
                        lot.statut === 'cree' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-teal-50 text-teal-600 border-teal-100'
                      }`}>
                        {lot.statut === 'cree' ? 'À VALIDER' : 'RÉCEPTIONNÉ'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/cooperative/receptions/${lot.id}`} className="text-[#1D4ED8] font-bold hover:underline">
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                )) : (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic">Aucun lot trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PANNEAU D'INSPECTION (DROITE) */}
        <div className="col-span-5 space-y-8 border-l border-gray-100 pl-10">
          {selectedLot ? (
            <section className="space-y-4">
              <h2 className="text-[13px] font-bold text-gray-800">Inspection détaillée</h2>
              
              <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 uppercase font-bold text-[9px] mb-1">Producteur</p>
                        <p className="font-bold text-base text-gray-900">{selectedLot.agriculteur_detail?.username || "Inconnu"}</p>
                        <p className="text-gray-400 text-[10px] italic">Origine: {selectedLot.notes || "Togo Zone-Plateaux"}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 uppercase font-bold text-[9px] mb-1">Poids Déclaré</p>
                        <p className="text-xl font-black text-[#1D4ED8]">{selectedLot.poids_kg} kg</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-gray-400 font-bold text-[9px] uppercase mb-1">Coordonnées GPS</p>
                      <p className="font-mono text-[10px] text-gray-600">
                        {selectedLot.gps_latitude?.toFixed(4)}, {selectedLot.gps_longitude?.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold text-[9px] uppercase mb-1">Culture</p>
                      <p className="font-bold text-gray-700 text-[11px]">{selectedLot.espece || "Cacao"}</p>
                    </div>
                 </div>

                 <div className="pt-4">
                    {selectedLot.statut === 'cree' ? (
                      <Link 
                        href={`/cooperative/receptions/${selectedLot.id}`}
                        className="block text-center w-full bg-[#1D4ED8] text-white py-3 rounded-xl text-[11px] font-bold hover:bg-blue-800 shadow-md transition-all"
                      >
                        Scanner & Valider sur Polygon
                      </Link>
                    ) : (
                      <div className="bg-teal-50 text-teal-700 p-4 rounded-xl text-center font-bold text-[10px] border border-teal-100 flex items-center justify-center gap-2">
                        <span>✓</span> LOT DÉJÀ VALIDÉ EN BLOCKCHAIN
                      </div>
                    )}
                 </div>
              </div>

              {/* TIMELINE DYNAMIQUE */}
              <section className="space-y-4 pt-6">
                 <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Traçabilité Blockchain</h2>
                 <div className="space-y-6 relative ml-2">
                   <TimelineItem 
                    active 
                    title="Récolte & Enregistrement (Mobile)" 
                    date={selectedLot.date_recolte ? new Date(selectedLot.date_recolte).toLocaleDateString('fr-FR') : "Date inconnue"} 
                   />
                   <TimelineItem 
                      current={selectedLot.statut === 'cree'} 
                      active={selectedLot.statut !== 'cree'} 
                      title="Validation Coopérative (Station Lomé)" 
                      date={selectedLot.statut === 'cree' ? 'Attente réception...' : 'Transaction confirmée'} 
                   />
                   <TimelineItem title="Exportation Europe (EUDR)" isLast />
                 </div>
              </section>
            </section>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-50 rounded-2xl">
              <span className="text-2xl mb-2">📦</span>
              <p className="text-xs italic">Sélectionnez un lot pour l'inspecter</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ================= COMPOSANTS ATOMIQUES ================= */

function StatItem({ label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
      <span className={`text-2xl font-black block mb-1 ${color}`}>{value}</span>
      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function TimelineItem({ title, date, active, current, isLast }: any) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && <div className="absolute left-[4px] top-4 w-[1px] h-full bg-gray-100" />}
      <div className={`w-[9px] h-[9px] rounded-full mt-1.5 z-10 ${
        active ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]' : current ? 'bg-orange-400 animate-pulse' : 'bg-gray-200'
      }`} />
      <div className="-mt-0.5">
        <p className={`text-[11px] ${active || current ? 'font-bold text-gray-800' : 'text-gray-400'}`}>{title}</p>
        {date && <p className="text-[9px] text-gray-400 font-medium">{date}</p>}
      </div>
    </div>
  );
}

