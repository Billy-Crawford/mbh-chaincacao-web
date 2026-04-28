// src/app/exportateur/compte/page.tsx

"use client";

export default function ExportComptePage() {
  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-bold">Paramètres de l'entreprise</h1>
      
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 bg-[#FEF3C7] text-[#D97706] rounded-2xl flex items-center justify-center font-bold text-xl">TE</div>
          <div>
            <h2 className="font-bold">TOGO EXPORT SARL</h2>
            <p className="text-[11px] text-gray-400 italic">Agrément Exportateur : #TG-EXP-2026-88</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-50 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Contact principal</span>
            <span className="font-medium">Oumarou Billy</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Email professionnel</span>
            <span className="font-medium">billing@togoexport.tg</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Wallet Blockchain</span>
            <span className="font-mono text-[10px] bg-gray-50 px-2 py-1 rounded">0x7f2a...d4b1</span>
          </div>
        </div>
      </div>
    </div>
  );
}