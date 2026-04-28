// src/app/exportateur/certificats/page.tsx

"use client";

export default function CertificatsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Certificats EUDR</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">📜</div>
              <div>
                <p className="font-bold text-sm">Certificat_LOT-00{i}.pdf</p>
                <p className="text-[10px] text-gray-400">Généré le 12/04/2026 • 2.4 MB</p>
              </div>
            </div>
            <button className="text-[#D97706] text-xs font-bold hover:underline">Télécharger</button>
          </div>
        ))}
      </div>
    </div>
  );
}