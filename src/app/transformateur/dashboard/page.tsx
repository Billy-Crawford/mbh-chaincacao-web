// src/app/transformateur/dashboard/page.tsx

"use client";

import { useLots } from "@/hooks/useLots";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TransformateurDashboard() {
  const { data, isLoading, error } = useLots();
  const [selectedLotId, setSelectedLotId] = useState<any>(null);
  const [exportateurs, setExportateurs] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    poids_verifie: "",
    notes: "",
    destinataire: "",
  });

  const lots = Array.isArray(data) ? data : [];
  const filteredLots = lots.filter((l) => l.statut === "receptionne");
  const selectedLot = filteredLots.find((l) => l.id === selectedLotId) || filteredLots[0];

  // ================================
  // FETCH EXPORTATEURS
  // ================================
  useEffect(() => {
    const fetchExportateurs = async () => {
      try {
        const res = await api.get("/api/auth/exportateurs/");
        setExportateurs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Impossible de charger les exportateurs", err);
      }
    };
    fetchExportateurs();
  }, []);

  // ================================
  // ENVOI VERS EXPORTATEUR
  // ================================
  const handleEnvoyer = async () => {
    if (!form.poids_verifie) return alert("Poids requis");
    if (!form.destinataire) return alert("Sélectionne un exportateur");

    setLoading(true);
    try {
      await api.post("/api/transferts/", {
        lot: selectedLot.id,
        destinataire: Number(form.destinataire),
        etape: "transformateur_exportateur",
        poids_verifie: Number(form.poids_verifie),
        notes: form.notes,
      });

      setForm({ poids_verifie: "", notes: "", destinataire: "" });
      setOpenModal(false);
      alert("Lot envoyé à l'exportateur ✅");
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <p className="p-10 font-serif italic text-gray-400">Chargement...</p>;
  if (error) return <p className="p-10 text-red-500">Erreur de connexion</p>;

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-2xl font-serif font-medium mb-1">
            Dashboard Transformateur
          </h1>
          <p className="text-sm text-gray-500 font-serif italic">
            {filteredLots.length} lot(s) en attente de traitement
          </p>
        </div>

        <div className="grid grid-cols-12 gap-12">

          {/* TABLE */}
          <div className="col-span-7">
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
                {filteredLots.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400 font-serif italic">
                      Aucun lot à traiter
                    </td>
                  </tr>
                )}
                {filteredLots.map((lot) => (
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
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-medium px-3 py-1 rounded-full">
                        {lot.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DETAIL PANEL */}
          <div className="col-span-5">
            {selectedLot && (
              <div className="sticky top-8 border border-gray-100 rounded-xl p-6 space-y-6">
                <h2 className="text-base font-serif">
                  LOT-{String(selectedLot.id).slice(0, 6)}
                </h2>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      Agriculteur
                    </p>
                    <p className="font-serif">{selectedLot.agriculteur_detail?.username || "—"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Espèce
                      </p>
                      <p className="font-serif">{selectedLot.espece || "Cacao"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Poids reçu
                      </p>
                      <p className="font-serif">{selectedLot.poids_kg} kg</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      Notes coopérative
                    </p>
                    <p className="font-serif text-gray-600">
                      {selectedLot.notes || "—"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpenModal(true)}
                  className="w-full bg-[#1e60a3] text-white py-3 text-sm font-medium rounded-sm"
                >
                  Envoyer vers exportateur
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL ENVOI EXPORTATEUR */}
      {openModal && selectedLot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[520px] p-6 rounded-xl shadow-xl space-y-5">

            <h2 className="text-lg font-serif">Envoi à l'exportateur</h2>

            {/* POIDS VÉRIFIÉ */}
            <div>
              <label className="text-xs font-bold text-gray-500">
                Poids après traitement (kg)
              </label>
              <input
                type="number"
                className="w-full border p-2 rounded mt-1"
                placeholder="Ex: 71.0"
                value={form.poids_verifie}
                onChange={(e) => setForm({ ...form, poids_verifie: e.target.value })}
              />
            </div>

            {/* NOTES */}
            <div>
              <label className="text-xs font-bold text-gray-500">
                Notes de transformation
              </label>
              <textarea
                className="w-full border p-2 rounded mt-1"
                placeholder="Ex: Traitement finalisé — prêt pour export"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {/* EXPORTATEUR */}
            <div>
              <label className="text-xs font-bold text-gray-500">
                Exportateur
              </label>
              <select
                className="w-full border p-2 rounded mt-1 bg-white text-sm text-gray-800"
                value={form.destinataire}
                onChange={(e) => setForm({ ...form, destinataire: e.target.value })}
              >
                <option value="">— Sélectionner un exportateur —</option>
                {exportateurs.length === 0 && (
                  <option disabled>Aucun exportateur disponible</option>
                )}
                {exportateurs.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.username}{e.first_name ? ` — ${e.first_name} ${e.last_name}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 border py-2 rounded text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleEnvoyer}
                disabled={loading || !form.destinataire || !form.poids_verifie}
                className="flex-1 bg-green-600 text-white py-2 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}






// "use client";

// import { useLots } from "@/hooks/useLots";
// import { useState } from "react";

// export default function TransformateurDashboard() {
//   const { data, isLoading, error } = useLots();
//   const [selectedLotId, setSelectedLotId] = useState<any>(null);

//   const lots = Array.isArray(data) ? data : [];

//   // 👉 seulement les lots reçus de la coopérative
//   const filteredLots = lots.filter(
//     (l) => l.statut === "receptionne"
//   );

//   const selectedLot =
//     filteredLots.find((l) => l.id === selectedLotId) || filteredLots[0];

//   if (isLoading) return <p className="p-10">Chargement...</p>;
//   if (error) return <p className="p-10 text-red-500">Erreur</p>;

//   return (
//     <div className="min-h-screen bg-white p-8">

//       <h1 className="text-2xl font-serif mb-6">
//         Dashboard Transformateur
//       </h1>

//       {/* TABLE */}
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="text-left text-gray-500">
//             <th>ID</th>
//             <th>Agriculteur</th>
//             <th>Poids</th>
//             <th>Statut</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredLots.map((lot) => (
//             <tr
//               key={lot.id}
//               onClick={() => setSelectedLotId(lot.id)}
//               className="cursor-pointer hover:bg-gray-50"
//             >
//               <td>#LOT-{lot.id}</td>
//               <td>{lot.agriculteur_detail?.username}</td>
//               <td>{lot.poids_kg} kg</td>
//               <td>{lot.statut}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ACTION PANEL */}
//       {selectedLot && (
//         <div className="mt-10 border p-6 rounded">

//           <h2 className="text-lg font-serif mb-4">
//             Traitement LOT-{selectedLot.id}
//           </h2>

//           <p className="mb-2">
//             Poids actuel : {selectedLot.poids_kg} kg
//           </p>

//           <input
//             className="border p-2 w-full mb-3"
//             placeholder="Nouveau poids vérifié"
//           />

//           <textarea
//             className="border p-2 w-full mb-3"
//             placeholder="Note de transformation"
//           />

//           <button className="bg-black text-white px-4 py-2">
//             Envoyer vers exportateur
//           </button>

//         </div>
//       )}
//     </div>
//   );
// }
