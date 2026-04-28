// src/app/exportateur/layout.tsx
"use client";

import { AuthGuard } from "@/components/AuthGuard";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ExportLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["exportateur"]}>
      <div className="flex min-h-screen bg-[#F9FAFB] text-[#1f2937]">
        <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col fixed h-full">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-[#D97706] rounded-md" />
              <h2 className="text-xl font-bold tracking-tight">ChainCacao</h2>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">TOGO EXPORT SARL</p>
          </div>

          <nav className="space-y-1 flex-1">
            <MenuItem label="Dashboard" icon="📊" href="/exportateur/dashboard" />
            <MenuItem label="Lots disponibles" icon="📦" href="/exportateur/lots" />
            <MenuItem label="Certificats EUDR" icon="📜" href="/exportateur/certificats" />
            <MenuItem label="Historique exports" icon="🕒" href="/exportateur/historique" />
            <MenuItem label="Mon compte" icon="👤" href="/exportateur/compte" />
          </nav>
        </aside>

        <main className="flex-1 ml-64 p-8 overflow-y-auto">{children}</main>
      </div>
    </AuthGuard>
  );
}

function MenuItem({ label, icon, href }: any) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
        active ? "bg-[#FEF3C7] text-[#D97706] font-medium" : "text-gray-500 hover:bg-gray-50"
      }`}>
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}
