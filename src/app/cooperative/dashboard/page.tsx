// src/app/cooperative/dashboard/page.tsx

"use client";

import { useLots } from "@/hooks/useLots";
import { useState } from "react";
import Link from "next/link";

export default function CoopDashboard() {
  const { data, isLoading, error } = useLots();
  const [selectedLotId, setSelectedLotId] = useState<string | number | null>(
    null,
  );

  const lots = Array.isArray(data) ? data : [];

  if (isLoading)
    return (
      <div className="p-10 text-center font-serif italic text-gray-400">
        Chargement...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-serif">
        Erreur de connexion
      </div>
    );

  // =========================
  // KPI (LOGIQUE INCHANGÉE)
  // =========================
  const stats = {
    enAttente: lots.filter((l) => l.statut === "en_transit").length,
    valides: lots.filter((l) =>
      ["receptionne", "certifie", "exporte"].includes(l.statut),
    ).length,
    alertes: lots.filter(
      (l) =>
        l.poids_verifie &&
        Math.abs(Number(l.poids_verifie) - Number(l.poids_kg)) > 8,
    ).length,
    totalPoids: lots.reduce((a, l) => a + (Number(l.poids_kg) || 0), 0),
  };

  const selectedLot = lots.find((l) => l.id === selectedLotId) || lots[0];

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-2xl font-serif font-medium mb-1">
              Tableau de bord
            </h1>

            <p className="text-sm text-gray-500 font-serif italic">
              Mise à jour —{" "}
              {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <Link
            href="/cooperative/receptions"
            className="bg-[#1e60a3] text-white px-6 py-2 text-sm font-medium rounded-sm shadow-sm hover:bg-[#164d85]"
          >
            + Réceptionner un lot
          </Link>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-4 mb-16 px-4">
          <KPIDisplay
            value={stats.enAttente}
            label="En attente de réception"
            color="text-orange-800"
          />
          <KPIDisplay
            value={stats.valides}
            label="Lots validés ce mois"
            color="text-green-800"
          />
          <KPIDisplay
            value={`${stats.totalPoids} kg`}
            label="Lots transférés"
            color="text-blue-800"
          />
          <KPIDisplay
            value={stats.alertes}
            label="Alerte poids"
            color="text-red-700"
          />
        </div>

        <div className="grid grid-cols-12 gap-16">
          {/* TABLE */}
          <div className="col-span-7">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-serif">Lots en attente</h2>

              <span className="bg-[#fdf3e7] text-[#d97706] text-[10px] font-bold px-3 py-1 rounded-full">
                {stats.enAttente} lots
              </span>
            </div>

            {stats.alertes > 0 && (
              <div className="bg-[#fef9f2] border border-[#f59e0b]/20 p-4 flex items-center gap-3 mb-6">
                <span className="text-[#b45309]">⚠️</span>
                <p className="text-sm text-[#b45309] font-serif italic">
                  Anomalies de poids détectées — vérification requise
                </p>
              </div>
            )}

            <table className="w-full text-[13px]">
              <thead className="text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                <tr>
                  <th className="text-left pb-4 font-normal">ID LOT</th>
                  <th className="text-left pb-4 font-normal">AGRICULTEUR</th>
                  <th className="text-left pb-4 font-normal">CULTURE</th>
                  <th className="text-left pb-4 font-normal">POIDS</th>
                  <th className="text-left pb-4 font-normal">REÇU LE</th>
                  <th className="text-left pb-4 font-normal">STATUT</th>
                  <th className="text-left pb-4 font-normal"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {lots.map((lot) => (
                  <tr
                    key={lot.id}
                    onClick={() => setSelectedLotId(lot.id)}
                    className="group cursor-pointer hover:bg-gray-50/60 transition"
                  >
                    <td className="py-6 font-serif">
                      #LOT-{String(lot.id).slice(0, 3)}
                    </td>

                    <td className="py-6">
                      {lot.agriculteur_detail?.username || "—"}
                    </td>

                    <td className="py-6">{lot.espece || "Cacao"}</td>

                    <td className="py-6">{lot.poids_kg} kg</td>

                    <td className="py-6 font-serif italic text-gray-500">
                      {lot.date_reception
                        ? new Date(lot.date_reception).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </td>

                    <td className="py-6">
                      <StatusBadge status={lot.statut} />
                    </td>

                    <td className="py-6 text-right">
                      <span className="font-serif text-gray-800 hover:underline">
                        {lot.statut === "en_transit" ? "Valider" : "Détail"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DETAIL */}
          <div className="col-span-5 px-4">
            {selectedLot && (
              <div className="sticky top-8">
                <h2 className="text-base font-serif mb-8">
                  Validation LOT-{String(selectedLot.id).slice(0, 3)}
                </h2>

                <div className="space-y-8 mb-12">
                  <DetailRow
                    label="AGRICULTEUR SOURCE"
                    value={selectedLot.agriculteur_detail?.username || "--"}
                    subValue={`GPS : ${selectedLot.gps_latitude}°N, ${selectedLot.gps_longitude}°E`}
                  />

                  <div className="grid grid-cols-2 gap-8">
                    <DetailRow
                      label="TYPE"
                      value={selectedLot.espece || "Cacao"}
                    />
                    <DetailRow
                      label="POIDS DÉCLARÉ"
                      value={`${selectedLot.poids_kg} kg`}
                    />
                  </div>

                  {/* ✅ CORRECTION ICI : dynamique backend */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">
                      POIDS VÉRIFIÉ (kg)
                    </label>

                    <p className="text-xl font-serif pl-2">
                      {selectedLot.poids_verifie ?? "—"}
                    </p>
                  </div>

                  <DetailRow
                    label="OBSERVATIONS"
                    value={
                      selectedLot.notes ||
                      "Qualité bonne, fermentation correcte"
                    }
                  />
                </div>

                <div className="flex items-center gap-6 mb-16">
                  <button className="flex-1 bg-[#1e60a3] text-white py-3 text-sm font-medium rounded-sm">
                    Valider la réception
                  </button>

                  <button className="text-red-700 text-sm font-medium">
                    Signaler
                  </button>
                </div>

                {/* TIMELINE (RESTE STATIQUE UI, DATA READY BACKEND) */}
                {/* TIMELINE DYNAMIQUE */}
                <div>
                  <h3 className="text-sm font-serif mb-6">
                    Historique blockchain
                  </h3>

                  <div className="space-y-8 relative">
                    <div className="absolute left-[4px] top-2 bottom-2 w-[0.5px] bg-gray-200" />

                    {selectedLot?.historique?.length ? (
                      selectedLot.historique.map((item: any, index: number) => {
                        const labels: any = {
                          ferme_cooperative: "Réception coopérative",
                          cooperative_transformateur: "Transformateur",
                          transformateur_exportateur: "Exportateur",
                        };

                        const isDone = true; // déjà enregistré = vert
                        const isLast =
                          index === selectedLot.historique.length - 1;

                        return (
                          <TimelineStep
                            key={index}
                            title={labels[item.etape] || item.etape}
                            date={
                              item.date
                                ? new Date(item.date).toLocaleString("fr-FR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "—"
                            }
                            color={isLast ? "bg-green-600" : "bg-green-500"}
                          />
                        );
                      })
                    ) : (
                      <>
                        <TimelineStep
                          title="Enregistrement agriculteur"
                          date="—"
                          color="bg-green-600"
                        />

                        <TimelineStep
                          title="Réception coopérative"
                          date="En attente..."
                          color="bg-orange-400"
                        />

                        <TimelineStep
                          title="Transformateur"
                          date="—"
                          color="bg-gray-200"
                        />

                        <TimelineStep
                          title="Exportateur"
                          date="—"
                          color="bg-gray-200"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */
function KPIDisplay({ value, label, color }: any) {
  return (
    <div className="text-center border-r last:border-r-0 border-gray-100">
      <p className={`text-4xl font-serif mb-2 ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    en_transit: "bg-[#fdf3e7] text-[#d97706]",
    receptionne: "bg-[#f0f9ff] text-[#0369a1]",
    certifie: "bg-[#f0fdf4] text-[#15803d]",
    exporte: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`text-[10px] font-medium px-3 py-1 rounded-full ${styles[status] || styles.en_transit}`}
    >
      {status}
    </span>
  );
}

function DetailRow({ label, value, subValue }: any) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">
        {label}
      </p>
      <p className="text-base font-serif">{value}</p>
      {subValue && <p className="text-[11px] text-gray-500 mt-1">{subValue}</p>}
    </div>
  );
}

function TimelineStep({ title, date, color }: any) {
  return (
    <div className="relative pl-8">
      <div
        className={`absolute left-0 top-[6px] w-[9px] h-[9px] rounded-full ${color}`}
      />
      <p className="text-xs font-medium">{title}</p>
      <p className="text-[11px] text-gray-400 mt-1">{date}</p>
    </div>
  );
}
