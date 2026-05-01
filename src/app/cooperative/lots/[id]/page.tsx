// src/app/cooperative/lots/[id]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { useLot } from "@/hooks/useLot";
import { useState } from "react";
import api from "@/lib/api";

export default function LotDetail() {
  const { id } = useParams();
  const router = useRouter();

  const { data: lot, isLoading } = useLot(id as string);

  const [poidsVerifie, setPoidsVerifie] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoading) return <p>Chargement...</p>;
  if (!lot) return <p>Lot introuvable</p>;

  const variation =
    lot.poids_kg && poidsVerifie
      ? Math.abs(Number(poidsVerifie) - Number(lot.poids_kg)) / Number(lot.poids_kg)
      : 0;

  const handleValider = async () => {
    setLoading(true);

    try {
      await api.post(`/api/lots/${lot.id}/confirmer/`, {
        poids_verifie: Number(poidsVerifie),
        notes: "Validation coopérative",
      });

      router.push("/cooperative/dashboard");
    } catch (e) {
      alert("Erreur validation réception");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#f6f1e7] min-h-screen">

      <h1 className="text-xl font-bold mb-4">Validation lot</h1>

      <div className="bg-white p-4 rounded mb-4">
        <p><b>Poids déclaré:</b> {lot.poids_kg} kg</p>

        {/* ✅ dynamique backend */}
        <p className="text-blue-700">
          <b>Dernier poids vérifié:</b> {lot.poids_verifie ?? "—"} kg
        </p>
      </div>

      <div className="bg-white p-4 rounded">
        <input
          value={poidsVerifie}
          onChange={(e) => setPoidsVerifie(e.target.value)}
          placeholder="Poids vérifié"
          className="border p-2 w-full mb-3"
        />

        {variation > 0.05 && (
          <p className="text-red-600 text-sm">
            ⚠ Écart important détecté
          </p>
        )}

        <button
          onClick={handleValider}
          disabled={loading}
          className="bg-[#5c3a21] text-white px-4 py-2 rounded mt-3"
        >
          {loading ? "Validation..." : "Valider réception"}
        </button>
      </div>
    </div>
  );
}







// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useLot } from "@/hooks/useLot";
// import { useState } from "react";
// import api from "@/lib/api";

// export default function LotDetail() {
//   const { id } = useParams();
//   const router = useRouter();

//   const { data: lot, isLoading } = useLot(id as string);

//   const [poidsVerifie, setPoidsVerifie] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [txHash, setTxHash] = useState("");

//   if (isLoading) return <p>Chargement...</p>;

//   const variation =
//     lot?.poids && poidsVerifie
//       ? Math.abs(Number(poidsVerifie) - lot.poids) / lot.poids
//       : 0;

//   const handleValider = async () => {
//     setLoading(true);

//     try {
//       const res = await api.post("/api/transferts/", {
//         lot: lot.id,
//         poids_verifie: Number(poidsVerifie),
//         observations: "Validation coopérative",
//       });

//       setTxHash(res.data.tx_hash);

//       setTimeout(() => {
//         router.push("/cooperative/dashboard");
//       }, 2000);
//     } catch (err) {
//       alert("Erreur transaction");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ background: "#f6f1e7", minHeight: "100vh" }}
//          className="p-6">

//       <h1 className="text-xl font-bold mb-4"
//           style={{ color: "#5c3a21" }}>
//         Détail Lot
//       </h1>

//       <div className="bg-white p-4 rounded shadow mb-4">
//         <p><b>Nom:</b> {lot.nom}</p>
//         <p><b>Poids déclaré:</b> {lot.poids} kg</p>
//         <p><b>Agriculteur:</b> {lot.agriculteur?.nom}</p>
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <h2 className="font-bold mb-2">Validation réception</h2>

//         <input
//           className="border p-2 w-full mb-2"
//           placeholder="Poids vérifié (kg)"
//           value={poidsVerifie}
//           onChange={(e) => setPoidsVerifie(e.target.value)}
//         />

//         {variation > 0.05 && (
//           <p className="text-red-600 text-sm mb-2">
//             ⚠ Écart supérieur à 5%
//           </p>
//         )}

//         <button
//           onClick={handleValider}
//           disabled={loading}
//           className="bg-[#5c3a21] text-white px-4 py-2 rounded"
//         >
//           {loading ? "Transaction..." : "Valider réception"}
//         </button>

//         {txHash && (
//           <p className="mt-3 text-green-700">
//             TX: {txHash}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

