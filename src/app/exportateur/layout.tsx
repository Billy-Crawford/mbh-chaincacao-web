// src/app/exportateur/layout.tsx
"use client";

import AuthGuard from "@/components/AuthGuard";
import { useRouter, usePathname } from "next/navigation";

export default function ExportLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    // CORRECTION ICI : "exportateur" au lieu de "cooperative"
    <AuthGuard allowedRoles={["exportateur"]}>
      <div className="flex min-h-screen bg-[#F9FAFB] text-[#1f2937]">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-[#D97706] rounded-md" />
              <h2 className="text-xl font-bold tracking-tight">ChainCacao</h2>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">
              TOGO EXPORT SARL
            </p>
          </div>

          <nav className="space-y-1 flex-1">
            <MenuItem 
              active={pathname === "/exportateur/dashboard"} 
              label="Dashboard" 
              icon="📊" 
              onClick={() => router.push("/exportateur/dashboard")}
            />
            <MenuItem 
              active={pathname === "/exportateur/lots"}
              label="Lots disponibles" 
              icon="📦" 
              onClick={() => router.push("/exportateur/lots")}
            />
            <MenuItem 
              active={pathname === "/exportateur/certificats"}
              label="Certificats EUDR" 
              icon="📜" 
              onClick={() => router.push("/exportateur/certificats")}
            />
            <MenuItem 
              active={pathname === "/exportateur/historique"}
              label="Historique exports" 
              icon="🕒" 
              onClick={() => router.push("/exportateur/historique")}
            />
            <MenuItem 
              active={pathname === "/exportateur/compte"}
              label="Mon compte" 
              icon="👤" 
              onClick={() => router.push("/exportateur/compte")}
            />
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}

function MenuItem({ label, active, icon, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
        active 
          ? "bg-[#FEF3C7] text-[#D97706] font-medium" 
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

