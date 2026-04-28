// src/app/cooperative/compte/page.tsx
"use client";

export default function ComptePage() {
  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-bold">Paramètres du compte</h1>
        <p className="text-xs text-gray-400">Informations certifiées de la coopérative</p>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-50">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
            CK
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-lg leading-tight">Coopérative de Kloto</h2>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Partenaire Certifié</p>
            <p className="text-xs text-gray-400">ID: COOP-TG-KL-002</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-6">
          <ProfileField label="Responsable de zone" value="Jean Kouamé" />
          <ProfileField label="Adresse email" value="contact@kloto-coop.tg" />
          <ProfileField label="Siège Social" value="Kpalimé, Togo (Région des Plateaux)" />
          <ProfileField label="Type de culture" value="Cacao Forestier, Café Arabica" />
        </div>

        <div className="mt-12 flex gap-3">
          <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-black transition-all">
            Modifier le profil
          </button>
          <button className="px-6 py-3 border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-all">
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-[13px] font-semibold text-gray-800">{value}</p>
    </div>
  );
}