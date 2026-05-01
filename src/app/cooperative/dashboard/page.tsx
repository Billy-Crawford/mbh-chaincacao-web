// src/app/cooperative/dashboard/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";
import { useState } from "react";
import Link from "next/link";

export default function CoopDashboard() {
  const { data, isLoading, error } = useLots();
  const [selectedLotId, setSelectedLotId] = useState<string | number | null>(null);

  const lots = Array.isArray(data) ? data : [];

  // =========================
  // KPI PROPRE (LOGIQUE MÉTIER UNIQUE)
  // =========================
  const stats = {
    enAttente: lots.filter(l => l.statut === "en_transit").length,
    valides: lots.filter(l => ["receptionne", "certifie"].includes(l.statut)).length,
    alertes: 0,
    totalPoids: lots.reduce((acc, l) => acc + (Number(l.poids_kg) || 0), 0),
  };

  // =========================
  // LOT SELECTION
  // =========================
  const selectedLot =
    lots.find(l => l.id === selectedLotId) ||
    lots.find(l => l.statut === "en_transit") ||
    lots[0];

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Chargement des lots...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-red-500 text-center">
        Erreur serveur Django
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-bold">Tableau de bord Coopérative</h1>
          <p className="text-xs text-gray-400">
            Sync: {new Date().toLocaleTimeString("fr-FR")}
          </p>
        </div>

        <Link
          href="/cooperative/receptions"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold"
        >
          + Réceptionner un lot
        </Link>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-6">
        <StatItem label="En transit" value={stats.enAttente} color="text-orange-500" />
        <StatItem label="Validés" value={stats.valides} color="text-green-600" />
        <StatItem label="Poids total" value={`${stats.totalPoids} kg`} color="text-blue-600" />
        <StatItem label="Alertes" value={stats.alertes} color="text-red-500" />
      </div>

      <div className="grid grid-cols-12 gap-10">

        {/* TABLE */}
        <div className="col-span-7">
          <h2 className="text-xs font-bold text-gray-500 uppercase mb-4">
            Lots en transit
          </h2>

          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-left text-gray-400">
                <tr>
                  <th className="p-3">ID</th>
                  <th>Agriculteur</th>
                  <th>Poids</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {lots.map(lot => (
                  <tr
                    key={lot.id}
                    onClick={() => setSelectedLotId(lot.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-3 font-mono">
                      {String(lot.id).slice(0, 8)}...
                    </td>

                    <td className="font-semibold">
                      {lot.agriculteur_detail?.username || "N/A"}
                    </td>

                    <td>{lot.poids_kg} kg</td>

                    <td>
                      <StatusBadge status={lot.statut} />
                    </td>

                    <td>
                      <Link
                        href={`/cooperative/receptions/${lot.id}`}
                        className="text-blue-600 font-bold"
                      >
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div className="col-span-5 border-l pl-8">
          {selectedLot && (
            <>
              <h2 className="font-bold mb-4">Inspection</h2>

              <div className="bg-white p-5 rounded-xl border space-y-4">

                <div>
                  <p className="text-xs text-gray-400">Producteur</p>
                  <p className="font-bold">
                    {selectedLot.agriculteur_detail?.username || "Inconnu"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Poids</p>
                  <p className="text-xl font-black text-blue-600">
                    {selectedLot.poids_kg} kg
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Statut</p>
                  <StatusBadge status={selectedLot.statut} />
                </div>

                {selectedLot.statut === "en_transit" ? (
                  <Link
                    href={`/cooperative/receptions/${selectedLot.id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg font-bold"
                  >
                    Scanner & Réceptionner
                  </Link>
                ) : (
                  <div className="text-green-600 font-bold text-center">
                    ✓ Lot déjà traité
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatItem({ label, value, color }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <div className={`text-xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 uppercase">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const map: any = {
    en_transit: "bg-orange-100 text-orange-600",
    receptionne: "bg-blue-100 text-blue-600",
    certifie: "bg-green-100 text-green-600",
    exporte: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${map[status] || ""}`}>
      {status}
    </span>
  );
}

