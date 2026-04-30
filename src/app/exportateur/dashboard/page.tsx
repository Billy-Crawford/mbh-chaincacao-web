// src/app/exportateur/dashboard/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";

export default function ExportDashboard() {
  const { data, isLoading, error } = useLots();

  if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-400">Chargement des données...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Erreur de chargement.</div>;

  const lots = Array.isArray(data) ? data : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Dashboard exportateur</h1>
          <p className="text-sm text-gray-400">Station Lomé-Port — Togo</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#D97706] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#B45309] transition-colors">
            Générer certificat EUDR
          </button>
        </div>
      </div>

      {/* KPI STATS */}
      <div className="flex gap-12 border-b border-gray-100 pb-6">
        <StatItem label="Lots disponibles à l'export" value={lots.length} color="text-[#D97706]" />
        <StatItem label="Certifiés EUDR" value={Math.floor(lots.length * 0.6)} color="text-green-600" />
        <StatItem label="En attente" value={Math.ceil(lots.length * 0.4)} color="text-blue-600" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-sm mb-4">Lots prêts pour embarquement</h2>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50 text-left">
                  <th className="pb-2 font-medium">ID LOT</th>
                  <th className="pb-2 font-medium">POIDS</th>
                  <th className="pb-2 font-medium">STATUT</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lots.length > 0 ? lots.map((lot: any) => (
                  <tr key={lot.id} className="group hover:bg-gray-50/50">
                    <td className="py-3 font-semibold text-gray-500">#{lot.id}</td>
                    <td className="py-3 font-medium">{lot.poids} kg</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lot.statut === 'cooperative' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {lot.statut === 'cooperative' ? 'Conforme' : 'Réceptionné'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-[#D97706] text-xs font-bold hover:underline">Vérifier</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="py-10 text-center text-gray-400">Aucun lot disponible</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDEBAR PREVIEW */}
        <div className="col-span-4 space-y-4">
          <div className="bg-[#1f2937] text-white p-6 rounded-2xl shadow-lg">
             <h3 className="text-xs font-bold uppercase opacity-60 mb-4 tracking-widest">Aperçu Blockchain</h3>
             <div className="space-y-4">
                <div className="border-l-2 border-[#D97706] pl-4">
                  <p className="text-[10px] opacity-60">Dernier Hash</p>
                  <p className="text-[11px] font-mono truncate">0x7f2a...d4b1892c</p>
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <p className="text-[10px] opacity-60">Réseau</p>
                  <p className="text-[11px] font-bold">Polygon Mainnet</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: any) {
  return (
    <div className="flex flex-col">
      <span className={`text-4xl font-black ${color}`}>{value}</span>
      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight leading-tight">{label}</span>
    </div>
  );
}

