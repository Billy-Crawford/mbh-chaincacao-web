// src/app/exportateur/dashboard/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";

export default function ExportDashboard() {
  const { data, isLoading } = useLots();

  if (isLoading) return <div className="p-10 text-center">Chargement...</div>;

  const lots = data || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Dashboard exportateur</h1>
          <p className="text-sm text-gray-400">15 avr. 2026 — Lomé, Togo</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-600 hover:underline">Importer un lot</button>
          <button className="bg-[#D97706] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#B45309]">
            Générer certificat EUDR
          </button>
        </div>
      </div>

      {/* KPI STATS */}
      <div className="flex gap-12 border-b border-gray-100 pb-6">
        <StatItem label="Lots disponibles à l'export" value={5} color="text-[#D97706]" />
        <StatItem label="Certifiés EUDR" value={3} color="text-green-600" />
        <StatItem label="En attente de certification" value={2} color="text-blue-600" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: TABLE & TIMELINE */}
        <div className="col-span-8 space-y-8">
          {/* TABLE */}
          <div className="bg-[#E5E7EB]/30 rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-sm">Lots disponibles pour export</h2>
              <button className="text-xs text-gray-400 flex items-center gap-1">Filtrer ▾</button>
            </div>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-200">
                  <th className="text-left font-medium pb-2">ID LOT</th>
                  <th className="text-left font-medium pb-2">CULTURE</th>
                  <th className="text-left font-medium pb-2">POIDS</th>
                  <th className="text-left font-medium pb-2">COOPÉRATIVE</th>
                  <th className="text-left font-medium pb-2 text-center">EUDR</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lots.slice(0, 5).map((lot: any) => (
                  <tr key={lot.id} className="group">
                    <td className="py-3 font-semibold text-gray-400">#{lot.id}</td>
                    <td className="py-3 italic">Cacao</td>
                    <td className="py-3 font-medium">{lot.poids} kg</td>
                    <td className="py-3 text-gray-500">Kloto</td>
                    <td className="py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        lot.statut === 'cooperative' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {lot.statut === 'cooperative' ? 'Conforme' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-[11px] underline font-medium">
                        {lot.statut === 'cooperative' ? 'Certificat' : 'Vérifier'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TIMELINE */}
          <div className="bg-[#E5E7EB]/30 rounded-2xl p-6">
            <h2 className="font-bold text-sm mb-6">Traçabilité complète — LOT-001</h2>
            <div className="space-y-6 relative ml-2">
              <TimelineStep title="Enregistrement agriculteur — NGARTOBAYE Billy" date="10/04/2026 09:12" details="GPS: 6.8920°N 0.8481°E - 125 kg Cacao" color="bg-green-500" />
              <TimelineStep title="Réception coopérative de Kloto" date="12/04/2026 14:35" details="Poids vérifié : 124 kg - Qualité A" color="bg-green-500" />
              <TimelineStep title="Transformation — Cacao fermenté et séché" date="13/04/2026 11:00" details="Atelier Kloto Agro" color="bg-green-500" isLast />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CERTIFICATE PREVIEW */}
        <div className="col-span-4 bg-[#E5E7EB]/50 rounded-2xl p-6 flex flex-col gap-6 border border-gray-100">
           <div className="flex flex-col gap-4">
              <h2 className="font-bold text-sm">Certificat EUDR — LOT-001</h2>
              <div className="border border-green-500/30 bg-green-50/50 p-3 rounded-lg flex items-center gap-2">
                <span className="text-green-600 text-lg">✓</span>
                <span className="text-green-800 text-xs font-bold">Conforme EUDR 2025</span>
              </div>
           </div>

           <div className="bg-[#1D4ED8] text-white p-4 rounded-lg">
              <p className="text-[10px] font-bold uppercase opacity-80">Certificat de traçabilité</p>
              <p className="text-[9px] opacity-60">ChainCacao - Polygon Blockchain</p>
           </div>

           <div className="space-y-3 text-[11px]">
              <CertDetail label="Lot ID" value="#LOT-001" />
              <CertDetail label="Produit" value="Cacao - 124 kg" />
              <CertDetail label="Origine GPS" value="6.89°N, 0.84°E" />
              <CertDetail label="Récolte" value="10 avr. 2026" />
              <CertDetail label="Producteur" value="N. Billy" />
              <CertDetail label="Hash blockchain" value="0x7f2a...d4b1" isMono />
           </div>

           <div className="mt-auto flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-white p-2 rounded shadow-sm">
                <div className="w-full h-full bg-gray-200" /> {/* QR Code placeholder */}
              </div>
              <button className="w-full bg-[#D97706] text-white py-3 rounded-xl text-sm font-bold">
                Télécharger PDF
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPOSANTS ATOMIQUES ================= */

function StatItem({ label, value, color }: any) {
  return (
    <div className="flex flex-col">
      <span className={`text-4xl font-bold ${color}`}>{value}</span>
      <span className="text-[11px] text-gray-500 font-medium max-w-[120px]">{label}</span>
    </div>
  );
}

function TimelineStep({ title, date, details, color, isLast }: any) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && <div className="absolute left-[5px] top-4 w-[1px] h-full bg-gray-300" />}
      <div className={`w-[11px] h-[11px] rounded-full mt-1.5 z-10 ${color}`} />
      <div>
        <p className="text-[13px] font-bold">{title}</p>
        <p className="text-[10px] text-gray-400 uppercase font-medium">{date}</p>
        <p className="text-[11px] text-gray-500 mt-1 italic">{details}</p>
      </div>
    </div>
  );
}

function CertDetail({ label, value, isMono }: any) {
  return (
    <div className="flex justify-between border-b border-gray-200/50 pb-1">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className={`font-bold ${isMono ? 'font-mono text-[10px]' : ''}`}>{value}</span>
    </div>
  );
}