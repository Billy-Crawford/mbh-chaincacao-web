// src/app/cooperative/rapports/page.tsx
"use client";

export default function RapportsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-bold">Rapports & Statistiques</h1>
        <p className="text-xs text-gray-400">Analyse de la production et de la traçabilité</p>
      </div>
      
      <div className="grid grid-cols-3 gap-8">
        <ReportCard title="Total Collecté" value="1,240 kg" sub="Cacao & Café" trend="+12%" />
        <ReportCard title="Taux de Conformité" value="98%" sub="Critères EUDR" trend="+2%" />
        <ReportCard title="Producteurs Actifs" value="24" sub="Secteur Kloto" trend="Stable" />
      </div>

      <div className="bg-gray-50 rounded-2xl p-24 text-center border border-gray-100">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-lg">📈</div>
        <h3 className="font-bold text-gray-800">Graphiques de production</h3>
        <p className="text-[11px] text-gray-400 mt-1">Le module d'analyse visuelle sera disponible prochainement.</p>
      </div>
    </div>
  );
}

function ReportCard({ title, value, sub, trend }: any) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <div className="flex justify-between items-end">
        <p className="text-2xl font-black text-[#1D4ED8]">{value}</p>
        <span className="text-[9px] font-bold text-teal-500 bg-teal-50 px-1.5 py-0.5 rounded">{trend}</span>
      </div>
      <p className="text-[10px] text-gray-400 italic">{sub}</p>
    </div>
  );
}