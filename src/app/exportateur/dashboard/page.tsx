// src/app/exportateur/dashboard/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function ExportDashboard() {
  const { data, isLoading, error } = useLots();
  const [selectedLotId, setSelectedLotId] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ poids_verifie: "", notes: "" });

  const lots = Array.isArray(data) ? data : [];
  const selectedLot = lots.find((l: any) => l.id === selectedLotId) || lots[0];

  const stats = {
    total: lots.length,
    certifies: lots.filter((l: any) => l.statut === "certifie").length,
    exportes: lots.filter((l: any) => l.statut === "exporte").length,
  };

  const handleExporter = async () => {
    if (!form.poids_verifie) return alert("Poids requis");

    setLoading(true);
    try {
      await api.post(`/api/lots/${selectedLot.id}/exporter/`, {
        poids_verifie: Number(form.poids_verifie),
        notes: form.notes,
      });

      setForm({ poids_verifie: "", notes: "" });
      setOpenModal(false);
      alert("Lot exporté avec succès ✅");
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur serveur");
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-2xl font-serif font-medium mb-1">
              Dashboard Exportateur
            </h1>
            <p className="text-sm text-gray-500 font-serif italic">
              Station Lomé-Port — Togo
            </p>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-3 mb-16 px-4">
          <KPIDisplay
            value={stats.total}
            label="Lots disponibles"
            color="text-orange-800"
          />
          <KPIDisplay
            value={stats.certifies}
            label="Certifiés EUDR"
            color="text-green-800"
          />
          <KPIDisplay
            value={stats.exportes}
            label="Exportés"
            color="text-blue-800"
          />
        </div>

        <div className="grid grid-cols-12 gap-16">

          {/* TABLE */}
          <div className="col-span-7">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-serif">Lots prêts pour embarquement</h2>
              <span className="bg-[#fdf3e7] text-[#d97706] text-[10px] font-bold px-3 py-1 rounded-full">
                {stats.certifies} lots
              </span>
            </div>

            <table className="w-full text-[13px]">
              <thead className="text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                <tr>
                  <th className="text-left pb-4 font-normal">ID LOT</th>
                  <th className="text-left pb-4 font-normal">AGRICULTEUR</th>
                  <th className="text-left pb-4 font-normal">ESPÈCE</th>
                  <th className="text-left pb-4 font-normal">POIDS</th>
                  <th className="text-left pb-4 font-normal">STATUT</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {lots.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-gray-400 font-serif italic"
                    >
                      Aucun lot disponible
                    </td>
                  </tr>
                )}
                {lots.map((lot: any) => (
                  <tr
                    key={lot.id}
                    onClick={() => setSelectedLotId(lot.id)}
                    className={`cursor-pointer hover:bg-gray-50/60 transition ${
                      selectedLot?.id === lot.id ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="py-5 font-serif">
                      #LOT-{String(lot.id).slice(0, 6)}
                    </td>
                    <td className="py-5">
                      {lot.agriculteur_detail?.username || "—"}
                    </td>
                    <td className="py-5">{lot.espece || "Cacao"}</td>
                    <td className="py-5">{lot.poids_kg} kg</td>
                    <td className="py-5">
                      <span
                        className={`text-[10px] font-medium px-3 py-1 rounded-full ${
                          lot.statut === "exporte"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-green-50 text-green-700"
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

          {/* DETAIL PANEL */}
          <div className="col-span-5 px-4">
            {selectedLot && (
              <div className="sticky top-8">
                <h2 className="text-base font-serif mb-8">
                  LOT-{String(selectedLot.id).slice(0, 6)}
                </h2>

                <div className="space-y-6 mb-10">
                  <DetailRow
                    label="AGRICULTEUR"
                    value={selectedLot.agriculteur_detail?.username || "—"}
                    subValue={`GPS : ${selectedLot.gps_latitude}°N, ${selectedLot.gps_longitude}°E`}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <DetailRow
                      label="ESPÈCE"
                      value={selectedLot.espece || "Cacao"}
                    />
                    <DetailRow
                      label="POIDS"
                      value={`${selectedLot.poids_kg} kg`}
                    />
                  </div>

                  <DetailRow label="STATUT" value={selectedLot.statut} />

                  {selectedLot.tx_hash && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                        TX BLOCKCHAIN
                      </p>
                      <p className="text-xs font-mono text-gray-500 break-all">
                        {selectedLot.tx_hash}
                      </p>
                    </div>
                  )}

                  {selectedLot.certificat_url && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                        CERTIFICAT EUDR
                      </p>
                      <Link
                        href={selectedLot.certificat_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1e60a3] underline"
                      >
                        Voir le certificat →
                      </Link>
                    </div>
                  )}
                </div>

                {selectedLot.statut === "certifie" && (
                  <button
                    onClick={() => setOpenModal(true)}
                    className="w-full bg-[#D97706] text-white py-3 text-sm font-medium rounded-sm mb-6"
                  >
                    Exporter ce lot
                  </button>
                )}

                {selectedLot.statut === "exporte" && (
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded text-sm text-gray-500 font-serif italic text-center mb-6">
                    Lot déjà exporté
                  </div>
                )}

                {/* BLOCKCHAIN SIDEBAR */}
                <div className="bg-[#1f2937] text-white p-6 rounded-xl">
                  <h3 className="text-xs font-bold uppercase opacity-60 mb-4 tracking-widest">
                    Aperçu Blockchain
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-2 border-[#D97706] pl-4">
                      <p className="text-[10px] opacity-60">Dernier Hash</p>
                      <p className="text-[11px] font-mono truncate">
                        {selectedLot.tx_hash || "0x—"}
                      </p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-4">
                      <p className="text-[10px] opacity-60">Réseau</p>
                      <p className="text-[11px] font-bold">Polygon Mainnet</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL EXPORT */}
      {openModal && selectedLot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[480px] p-6 rounded-xl shadow-xl space-y-5">

            <h2 className="text-lg font-serif">
              Exporter LOT-{String(selectedLot.id).slice(0, 6)}
            </h2>

            <div>
              <label className="text-xs font-bold text-gray-500">
                Poids final (kg)
              </label>
              <input
                type="number"
                className="w-full border p-2 rounded mt-1"
                placeholder="Ex: 70.5"
                value={form.poids_verifie}
                onChange={(e) =>
                  setForm({ ...form, poids_verifie: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500">
                Notes d'export
              </label>
              <textarea
                className="w-full border p-2 rounded mt-1"
                placeholder="Ex: Conteneur 40HC — Port d'Amsterdam"
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 border py-2 rounded text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleExporter}
                disabled={loading || !form.poids_verifie}
                className="flex-1 bg-[#D97706] text-white py-2 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Export en cours..." : "Confirmer l'export"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

/* COMPOSANTS */
function KPIDisplay({ value, label, color }: { value: any; label: string; color: string }) {
  return (
    <div className="text-center border-r last:border-r-0 border-gray-100">
      <p className={`text-4xl font-serif mb-2 ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function DetailRow({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-base font-serif">{value}</p>
      {subValue && (
        <p className="text-[11px] text-gray-500 mt-1">{subValue}</p>
      )}
    </div>
  );
}

