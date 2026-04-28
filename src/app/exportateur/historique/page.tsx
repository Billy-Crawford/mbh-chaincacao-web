// src/app/exportateur/historique/page.tsx

"use client";

export default function HistoriquePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Historique des exports</h1>
      
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Saison 2026</span>
          <button className="text-[11px] text-gray-500 underline">Exporter CSV</button>
        </div>
        <div className="p-12 text-center">
           <p className="text-gray-400 text-sm">Aucun export finalisé pour le moment.</p>
        </div>
      </div>
    </div>
  );
}