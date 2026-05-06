// src/app/transformateur/traitements/page.tsx
"use client";

import { useLots } from "@/hooks/useLots";

export default function TraitementsPage() {
  const { data, isLoading, error } = useLots();
  const lots = Array.isArray(data) ? data : [];

  const receptionnes = lots.filter((l: any) => l.statut === "receptionne");
  const certifies = lots.filter((l: any) => l.statut === "certifie");
  const exportes = lots.filter((l: any) => l.statut === "exporte");

  const totalPoidsEntree = receptionnes.reduce(
    (a: number, l: any) => a + (Number(l.poids_kg) || 0), 0
  );
  const totalPoidsSortie = certifies.reduce(
    (a: number, l: any) => a + (Number(l.poids_verifie) || 0), 0
  );

  if (isLoading)
    return <div className="p-10 text-center font-serif italic text-gray-400">Chargement...</div>;

  if (error)
    return <div className="p-10 text-center text-red-500">Erreur de chargement.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Traitements</h1>
        <p className="text-xs text-gray-400 mt-1">
          Suivi des transformations en cours
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          label="En cours de traitement"
          value={receptionnes.length}
          color="text-orange-600"
          bg="bg-orange-50"
        />
        <StatCard
          label="Traités — prêts export"
          value={certifies.length}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          label="Exportés"
          value={exportes.length}
          color="text-blue-600"
          bg="bg-blue-50"
        />
      </div>

      {/* POIDS */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Poids total reçu
          </p>
          <p className="text-3xl font-bold text-gray-800">{totalPoidsEntree} kg</p>
          <p className="text-xs text-gray-400 mt-1">Lots en attente de traitement</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Poids total traité
          </p>
          <p className="text-3xl font-bold text-gray-800">{totalPoidsSortie} kg</p>
          <p className="text-xs text-gray-400 mt-1">Lots certifiés prêts pour export</p>
        </div>
      </div>

      {/* LISTE LOTS EN TRAITEMENT */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold mb-6">Lots en cours de traitement</h2>

        {receptionnes.length === 0 ? (
          <p className="text-center text-gray-400 font-serif italic py-8">
            Aucun lot en cours de traitement
          </p>
        ) : (
          <div className="space-y-3">
            {receptionnes.map((lot: any) => (
              <div
                key={lot.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-bold">
                    #LOT-{String(lot.id).slice(0, 6)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {lot.agriculteur_detail?.username || "—"} · {lot.espece || "Cacao"} · {lot.poids_kg} kg
                  </p>
                </div>
                <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-orange-50 text-orange-700">
                  En traitement
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`${bg} border border-gray-100 rounded-xl p-6`}>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

