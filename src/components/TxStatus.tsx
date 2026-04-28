"use client";

export default function TxStatus({ txHash }: { txHash?: string }) {
  if (!txHash) return null;

  return (
    <div className="mt-3 p-3 bg-green-100 rounded">
      <p className="text-green-800 font-bold">
        Transaction confirmée
      </p>

      <a
        className="text-sm underline"
        href={`https://mumbai.polygonscan.com/tx/${txHash}`}
        target="_blank"
      >
        Voir sur Polygonscan
      </a>
    </div>
  );
}
