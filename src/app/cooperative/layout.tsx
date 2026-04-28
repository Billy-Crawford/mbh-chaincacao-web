// src/app/cooperative/layout.tsx
"use client";

import { AuthGuard } from "@/components/AuthGuard";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CoopLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["cooperative"]}>
      <div className="flex min-h-screen bg-white text-[#1f2937]">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-gray-100 p-6 flex flex-col fixed h-full">
          <div className="mb-10">
            <p className="text-[11px] font-bold text-gray-400 tracking-widest">WEB</p>
            <div className="mt-4">
              <h2 className="text-sm font-bold tracking-tight">ChainCacao</h2>
              <p className="text-[10px] text-gray-500">Coopérative de Kloto</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            <MenuItem label="Tableau de bord" icon="🏠" href="/cooperative/dashboard" />
            <MenuItem label="Réceptions" icon="📥" href="/cooperative/receptions" />
            <MenuItem label="Rapports" icon="📊" href="/cooperative/rapports" />
            <MenuItem label="Mon compte" icon="👤" href="/cooperative/compte" />
          </nav>
          
          <div className="pt-6 border-t border-gray-50">
             <button className="text-[11px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-tight">
               Déconnexion
             </button>
          </div>
        </aside>

        {/* MAIN CONTENT Area - Added ml-64 to compensate for fixed sidebar */}
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}

function MenuItem({ label, icon, href }: { label: string; icon: string; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
        isActive 
          ? "bg-blue-50 text-blue-700 font-semibold" 
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[13px]">{label}</span>
    </Link>
  );
}
