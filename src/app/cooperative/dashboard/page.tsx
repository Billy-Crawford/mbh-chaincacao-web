// src/app/cooperative/dashboard/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";

export default function CoopDashboard() {
  const { data, isLoading } = useLots();
  const lots = data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold">Tableau de bord</h1>
          <p className="text-xs text-gray-400">Mise à jour — 15 avr. 2026, 09:42</p>
        </div>
        <button className="bg-[#1D4ED8] text-white px-4 py-2 rounded text-[11px] font-bold">
          + Réceptionner un lot
        </button>
      </div>

      {/* KPI STATS */}
      <div className="flex gap-16">
        <StatItem label="En attente de réception" value={3} color="text-orange-500" />
        <StatItem label="Lots validés ce mois" value={12} color="text-teal-600" />
        <StatItem label="Lots transférés" value={8} color="text-blue-600" />
        <StatItem label="Alerte poids" value={1} color="text-red-500" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-10">
        
        {/* LEFT: TABLE & ALERTS */}
        <div className="col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-[13px] font-bold uppercase tracking-wider">Lots en attente</h2>
            <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-100">3 lots</span>
          </div>

          {/* ALERT BOX */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
             <span className="text-orange-500 text-sm">⚠️</span>
             <p className="text-[11px] text-orange-800">
               <span className="font-bold">LOT-003 —</span> Écart de poids détecté (+5 kg). Vérification requise.
             </p>
          </div>

          {/* TABLE */}
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-tighter">
                <th className="text-left py-2 font-semibold">ID LOT</th>
                <th className="text-left py-2 font-semibold">AGRICULTEUR</th>
                <th className="text-left py-2 font-semibold">CULTURE</th>
                <th className="text-left py-2 font-semibold">POIDS</th>
                <th className="text-left py-2 font-semibold">REÇU LE</th>
                <th className="text-left py-2 font-semibold">STATUT</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lots.slice(0, 4).map((lot: any) => (
                <tr key={lot.id} className="group">
                  <td className="py-4 font-bold text-gray-500">#{lot.id}</td>
                  <td className="py-4 font-medium uppercase tracking-tight text-gray-800">N. Billy</td>
                  <td className="py-4 text-gray-400">Cacao</td>
                  <td className="py-4 font-bold">{lot.poids} kg</td>
                  <td className="py-4 text-gray-400">10 avr.</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      lot.id === 'LOT-003' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-orange-50 text-orange-500 border-orange-100'
                    }`}>
                      {lot.id === 'LOT-003' ? 'Alerte' : 'En attente'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-[10px] font-bold text-gray-800 hover:underline">
                       {lot.id === 'LOT-003' ? 'Voir' : 'Valider'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: VALIDATION PANEL */}
        <div className="col-span-5 space-y-8 border-l border-gray-50 pl-10">
          <section className="space-y-4">
            <h2 className="text-[13px] font-bold">Validation LOT-001</h2>
            
            <div className="space-y-4 text-[11px]">
               <div>
                  <p className="text-gray-400 uppercase font-bold text-[9px]">Agriculteur source</p>
                  <p className="font-bold">NGARTOBAYE Oumarou Billy</p>
                  <p className="text-gray-400">GPS : 6.8920°N, 0.8481°E</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 font-bold text-[9px] uppercase">Type</p>
                    <p className="font-medium">Cacao</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-bold text-[9px] uppercase">Poids déclaré</p>
                    <p className="font-medium">125 kg</p>
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-gray-400 font-bold text-[9px] uppercase italic">Poids vérifié (kg)</label>
                  <div className="border border-gray-200 p-2 rounded bg-gray-50 font-bold text-sm">124</div>
               </div>

               <div className="space-y-1">
                  <p className="text-gray-400 font-bold text-[9px] uppercase">Observations</p>
                  <p className="italic text-gray-500">Qualité bonne, fermentation correcte</p>
               </div>

               <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-[#1D4ED8] text-white py-2 rounded text-[11px] font-bold">Valider la réception</button>
                  <button className="text-red-500 text-[10px] font-bold px-2 underline">Signaler</button>
               </div>
            </div>
          </section>

          {/* BLOCKCHAIN HISTORY */}
          <section className="space-y-4">
             <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Historique blockchain</h2>
             <div className="space-y-6 relative ml-2">
               <TimelineItem active title="Enregistrement agriculteur" date="10/04/2026 — 09:12" />
               <TimelineItem current title="Réception coopérative" date="En attente..." />
               <TimelineItem title="Transformateur" />
               <TimelineItem title="Exportateur" isLast />
             </div>
          </section>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPOSANTS ATOMIQUES ================= */

function StatItem({ label, value, color }: any) {
  return (
    <div className="flex flex-col">
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-tight">{label}</span>
    </div>
  );
}

function TimelineItem({ title, date, active, current, isLast }: any) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && <div className="absolute left-[4px] top-4 w-[1px] h-full bg-gray-100" />}
      <div className={`w-[9px] h-[9px] rounded-full mt-1 z-10 ${
        active ? 'bg-teal-500' : current ? 'bg-orange-400' : 'bg-gray-200'
      }`} />
      <div className="-mt-0.5">
        <p className={`text-[11px] ${active || current ? 'font-bold' : 'text-gray-300'}`}>{title}</p>
        {date && <p className="text-[9px] text-gray-400">{date}</p>}
      </div>
    </div>
  );
}