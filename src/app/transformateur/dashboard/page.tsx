"use client";

import { useLots } from "@/hooks/useLots";
import { useState } from "react";

export default function TransformateurDashboard() {
  const { data, isLoading, error } = useLots();
  const [selectedLotId, setSelectedLotId] = useState<any>(null);

  const lots = Array.isArray(data) ? data : [];

  // 👉 seulement les lots reçus de la coopérative
  const filteredLots = lots.filter(
    (l) => l.statut === "receptionne"
  );

  const selectedLot =
    filteredLots.find((l) => l.id === selectedLotId) || filteredLots[0];

  if (isLoading) return <p className="p-10">Chargement...</p>;
  if (error) return <p className="p-10 text-red-500">Erreur</p>;

  return (
    <div className="min-h-screen bg-white p-8">

      <h1 className="text-2xl font-serif mb-6">
        Dashboard Transformateur
      </h1>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>ID</th>
            <th>Agriculteur</th>
            <th>Poids</th>
            <th>Statut</th>
          </tr>
        </thead>

        <tbody>
          {filteredLots.map((lot) => (
            <tr
              key={lot.id}
              onClick={() => setSelectedLotId(lot.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <td>#LOT-{lot.id}</td>
              <td>{lot.agriculteur_detail?.username}</td>
              <td>{lot.poids_kg} kg</td>
              <td>{lot.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ACTION PANEL */}
      {selectedLot && (
        <div className="mt-10 border p-6 rounded">

          <h2 className="text-lg font-serif mb-4">
            Traitement LOT-{selectedLot.id}
          </h2>

          <p className="mb-2">
            Poids actuel : {selectedLot.poids_kg} kg
          </p>

          <input
            className="border p-2 w-full mb-3"
            placeholder="Nouveau poids vérifié"
          />

          <textarea
            className="border p-2 w-full mb-3"
            placeholder="Note de transformation"
          />

          <button className="bg-black text-white px-4 py-2">
            Envoyer vers exportateur
          </button>

        </div>
      )}
    </div>
  );
}
