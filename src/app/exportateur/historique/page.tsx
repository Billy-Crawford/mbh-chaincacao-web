// src/app/exportateur/historique/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";
import Link from "next/link";

export default function HistoriquePage() {
  const { data, isLoading, error } = useLots();

  const lots = (Array.isArray(data) ? data : []).filter(
    (l: any) => l.statut === "exporte"
  );

  const handleExportCSV = () => {
    if (lots.length === 0) return alert("Aucun lot à exporter");

    const headers = ["ID LOT", "AGRICULTEUR", "ESPÈCE", "POIDS (kg)", "STATUT", "TX BLOCKCHAIN"];
    const rows = lots.map((l: any) => [
      `LOT-${String(l.id).slice(0, 6)}`,
      l.agriculteur_detail?.username || "—",
      l.espece || "Cacao",
      l.poids_kg,
      l.statut,
      l.tx_hash || "—",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.join(";"))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exports_chaincacao_${new Date().getFullYear()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-2xl font-serif font-medium mb-1">
              Historique des exports
            </h1>
            <p className="text-sm text-gray-500 font-serif italic">
              Saison {new Date().getFullYear()} — {lots.length} lot(s) exporté(s)
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="border border-gray-200 text-gray-600 px-5 py-2 text-sm rounded-sm hover:bg-gray-50 transition"
          >
            Exporter CSV
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-3 mb-16 px-4">
          <KPIDisplay
            value={lots.length}
            label="Lots exportés"
            color="text-green-800"
          />
          <KPIDisplay
            value={`${lots.reduce((a: number, l: any) => a + (Number(l.poids_kg) || 0), 0)} kg`}
            label="Poids total exporté"
            color="text-blue-800"
          />
          <KPIDisplay
            value={lots.filter((l: any) => l.tx_hash).length}
            label="Enregistrés blockchain"
            color="text-orange-800"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Saison {new Date().getFullYear()}
            </span>
            <span className="bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full">
              {lots.length} lots
            </span>
          </div>

          {lots.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 font-serif italic text-sm">
                Aucun export finalisé pour le moment.
              </p>
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead className="text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-normal">ID LOT</th>
                  <th className="text-left px-6 py-4 font-normal">AGRICULTEUR</th>
                  <th className="text-left px-6 py-4 font-normal">ESPÈCE</th>
                  <th className="text-left px-6 py-4 font-normal">POIDS</th>
                  <th className="text-left px-6 py-4 font-normal">BLOCKCHAIN</th>
                  <th className="text-left px-6 py-4 font-normal">CERTIFICAT</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {lots.map((lot: any) => (
                  <tr key={lot.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-5 font-serif">
                      #LOT-{String(lot.id).slice(0, 6)}
                    </td>
                    <td className="px-6 py-5">
                      {lot.agriculteur_detail?.username || "—"}
                    </td>
                    <td className="px-6 py-5">{lot.espece || "Cacao"}</td>
                    <td className="px-6 py-5">{lot.poids_kg} kg</td>
                    <td className="px-6 py-5">
                      {lot.tx_hash ? (
                        <span className="font-mono text-[11px] text-gray-500 truncate block max-w-[120px]">
                          {lot.tx_hash}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {lot.certificat_url ? (
                        <Link
                          href={lot.certificat_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1e60a3] text-xs underline"
                        >
                          Voir →
                        </Link>
                      ) : (
                        <span className="text-gray-300 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function KPIDisplay({
  value,
  label,
  color,
}: {
  value: any;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center border-r last:border-r-0 border-gray-100">
      <p className={`text-4xl font-serif mb-2 ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}