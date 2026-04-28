"use client";

import { useParams } from "next/navigation";
import { useLot } from "@/hooks/useLot";
import QRCode from "react-qr-code";

export default function ExportLotDetail() {
  const { id } = useParams();
  const { data: lot, isLoading } = useLot(id as string);

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div style={{ background: "#f6f1e7", minHeight: "100vh" }}
         className="p-6">

      <h1 className="text-xl font-bold mb-4"
          style={{ color: "#5c3a21" }}>
        Certificat EUDR
      </h1>

      {/* BANNIERE */}
      <div className="p-3 mb-4 rounded"
           style={{
             background: lot.eudr_conforme ? "#d1fae5" : "#fee2e2"
           }}>
        {lot.eudr_conforme
          ? "✅ Conforme EUDR"
          : "❌ Non conforme"}
      </div>

      {/* INFOS */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <p><b>ID:</b> {lot.id}</p>
        <p><b>Produit:</b> {lot.culture}</p>
        <p><b>Poids:</b> {lot.poids} kg</p>
        <p><b>GPS:</b> {lot.latitude}, {lot.longitude}</p>
        <p><b>Producteur:</b> {lot.agriculteur?.nom}</p>
      </div>

      {/* QR CODE */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="font-bold mb-2">QR Code Vérification</p>

        <QRCode
          value={`${window.location.origin}/verify?id=${lot.id}`}
        />
      </div>

      {/* POLYGON */}
      <a
        href={`https://mumbai.polygonscan.com/tx/${lot.tx_hash}`}
        target="_blank"
        className="text-blue-600 underline"
      >
        Voir sur Polygonscan
      </a>
    </div>
  );
}

