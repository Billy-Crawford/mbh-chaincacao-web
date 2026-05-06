// src/app/transformateur/lots/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useLot } from "@/hooks/useLots";
import Link from "next/link";

export default function TransformateurLotDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: lot, isLoading } = useLot(id as string);

  if (isLoading)
    return (
      <div className="p-10 text-center font-serif italic text-gray-400">
        Chargement...
      </div>
    );

  if (!lot)
    return (
      <div className="flex items-center justify-center p-10">
        <div className="bg-white rounded-xl border p-8 max-w-md text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h2 className="font-bold text-gray-800">Lot introuvable</h2>
          <p className="text-sm text-gray-500">
            Ce lot ne vous est pas assigné ou n'existe pas.
          </p>
          <Link
            href="/transformateur/lots"
            className="inline-block mt-2 bg-[#1e60a3] text-white px-6 py-2 rounded text-sm font-bold"
          >
            ← Retour aux lots
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-2xl space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Link
          href="/transformateur/lots"
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Retour
        </Link>
      </div>

      <h1 className="text-xl font-bold">
        LOT #{String(lot.id).slice(0, 8)}
      </h1>

      {/* INFOS */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Informations du lot
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Agriculteur" value={lot.agriculteur_detail?.username || "—"} />
          <Field label="Espèce" value={lot.espece || "Cacao"} />
          <Field label="Poids déclaré" value={`${lot.poids_kg} kg`} />
          <Field label="Poids vérifié" value={lot.poids_verifie ? `${lot.poids_verifie} kg` : "—"} />
          <Field
            label="Date de récolte"
            value={
              lot.date_recolte
                ? new Date(lot.date_recolte).toLocaleDateString("fr-FR")
                : "—"
            }
          />
          <Field label="Statut" value={lot.statut} />
          <Field label="GPS" value={`${lot.gps_latitude}°N, ${lot.gps_longitude}°E`} />
          <Field label="Notes" value={lot.notes || "—"} />
        </div>
      </div>

      {/* HISTORIQUE */}
      {lot.historique?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Historique de traçabilité
          </h2>
          <div className="space-y-6 relative ml-1">
            <div className="absolute left-[4px] top-2 bottom-2 w-[1px] bg-gray-100" />
            {lot.historique.map((item: any, index: number) => {
              const labels: any = {
                ferme_cooperative: "Enregistrement agriculteur",
                reception: "Réception coopérative",
                cooperative_transformateur: "Transfert → Transformateur",
                transformateur_exportateur: "Transfert → Exportateur",
                exportateur_europe: "Export → Europe",
              };
              return (
                <div key={index} className="flex gap-4 relative">
                  <div className="w-[9px] h-[9px] rounded-full mt-1 z-10 shrink-0 bg-blue-500" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {labels[item.etape] || item.etape}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {item.date
                        ? new Date(item.date).toLocaleString("fr-FR")
                        : "—"}{" "}
                      · {item.poids} kg
                    </p>
                    {item.tx_hash && item.tx_hash !== "—" && (
                      <p className="text-[9px] font-mono text-gray-300 mt-0.5 truncate max-w-[280px]">
                        {item.tx_hash}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTION */}
      <button
        onClick={() => router.push("/transformateur/dashboard")}
        className="w-full bg-[#1e60a3] text-white py-3 rounded text-sm font-bold"
      >
        Traiter ce lot depuis le dashboard →
      </button>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 mb-1">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}

