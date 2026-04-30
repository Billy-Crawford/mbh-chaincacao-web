// src/app/cooperative/layout.tsx
"use client";

import AuthGuard from "@/components/AuthGuard";


export default function CoopLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["cooperative"]}>
      <div className="flex min-h-screen bg-white text-[#1f2937]">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-gray-100 p-6 flex flex-col">
          <div className="mb-10">
            <p className="text-[11px] font-bold text-gray-400">WEB</p>
            <div className="mt-4">
              <h2 className="text-sm font-bold">ChainCacao</h2>
              <p className="text-[10px] text-gray-500">Coopérative de Kloto</p>
            </div>
          </div>

          <nav className="space-y-1">
  <MenuItem active label="Tableau de bord" icon="🏠" href="/cooperative/dashboard" />
  <MenuItem label="Réceptions" icon="📥" href="/cooperative/receptions" />
  <MenuItem label="Rapports" icon="📊" href="/cooperative/rapports" />
  <MenuItem label="Mon compte" icon="👤" href="/cooperative/compte" />
</nav>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}

function MenuItem({ label, active, icon }: any) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
        active 
          ? "bg-blue-50 text-blue-700 font-semibold" 
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[13px]">{label}</span>
    </div>
  );
}

