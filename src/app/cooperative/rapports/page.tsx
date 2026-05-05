// src/app/cooperative/rapports/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";

export default function RapportsPage() {
  const { data, isLoading, error } = useLots();
  const lots = Array.isArray(data) ? data : [];

  const totalPoids = lots.reduce((a, l: any) => a + (Number(l.poids_kg) || 0), 0);
  const totalLots = lots.length;
  const lotsReceptionnes = lots.filter((l: any) =>
    ["receptionne", "certifie", "exporte"].includes(l.statut)
  ).length;
  const tauxConformite = totalLots > 0
    ? Math.round((lotsReceptionnes / totalLots) * 100)
    : 0;
  const agriculteurs = new Set(lots.map((l: any) => l.agriculteur)).size;

  const lotsEnAttente = lots.filter((l: any) => l.statut === "en_transit").length;
  const lotsExportes = lots.filter((l: any) => l.statut === "exporte").length;

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
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-bold">Rapports & Statistiques</h1>
        <p className="text-xs text-gray-400">
          Analyse de la production et de la traçabilité
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-8">
        <ReportCard
          title="Total Collecté"
          value={`${totalPoids} kg`}
          sub="Poids total des lots"
          trend={`${totalLots} lots`}
        />
        <ReportCard
          title="Taux de Conformité"
          value={`${tauxConformite}%`}
          sub="Lots réceptionnés / total"
          trend={`${lotsReceptionnes} conformes`}
        />
        <ReportCard
          title="Producteurs Actifs"
          value={String(agriculteurs)}
          sub="Agriculteurs distincts"
          trend="Actifs"
        />
      </div>

      {/* STATS SECONDAIRES */}
      <div className="grid grid-cols-3 gap-8">
        <ReportCard
          title="En Transit"
          value={String(lotsEnAttente)}
          sub="Lots en attente de réception"
          trend="⏳"
        />
        <ReportCard
          title="Exportés"
          value={String(lotsExportes)}
          sub="Lots exportés avec succès"
          trend="✅"
        />
        <ReportCard
          title="Total Lots"
          value={String(totalLots)}
          sub="Tous statuts confondus"
          trend="📦"
        />
      </div>

      {/* TABLEAU DÉTAIL */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold mb-6">Détail par lot</h2>
        <table className="w-full text-[13px]">
          <thead className="text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-100">
            <tr>
              <th className="text-left pb-3 font-normal">ID LOT</th>
              <th className="text-left pb-3 font-normal">AGRICULTEUR</th>
              <th className="text-left pb-3 font-normal">ESPÈCE</th>
              <th className="text-left pb-3 font-normal">POIDS</th>
              <th className="text-left pb-3 font-normal">STATUT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lots.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                  Aucun lot
                </td>
              </tr>
            )}
            {lots.map((lot: any) => (
              <tr key={lot.id}>
                <td className="py-4 font-serif">
                  #LOT-{String(lot.id).slice(0, 6)}
                </td>
                <td className="py-4">
                  {lot.agriculteur_detail?.username || "—"}
                </td>
                <td className="py-4">{lot.espece || "Cacao"}</td>
                <td className="py-4">{lot.poids_kg} kg</td>
                <td className="py-4">
                  <span
                    className={`text-[10px] font-medium px-3 py-1 rounded-full ${
                      lot.statut === "exporte"
                        ? "bg-gray-100 text-gray-600"
                        : lot.statut === "receptionne" || lot.statut === "certifie"
                        ? "bg-green-50 text-green-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {lot.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportCard({
  title,
  value,
  sub,
  trend,
}: {
  title: string;
  value: string;
  sub: string;
  trend: string;
}) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {title}
      </p>
      <div className="flex justify-between items-end">
        <p className="text-2xl font-black text-[#1D4ED8]">{value}</p>
        <span className="text-[9px] font-bold text-teal-500 bg-teal-50 px-1.5 py-0.5 rounded">
          {trend}
        </span>
      </div>
      <p className="text-[10px] text-gray-400 italic">{sub}</p>
    </div>
  );
}

