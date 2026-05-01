// src/app/transformateur/layout.tsx
"use client";

import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

export default function TransformateurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["transformateur"]}>
      <div className="flex min-h-screen bg-white text-[#1f2937]">

        {/* SIDEBAR */}
        <aside className="w-64 border-r border-gray-100 p-6 flex flex-col">
          <div className="mb-10">
            <p className="text-[11px] font-bold text-gray-400">WEB</p>
            <div className="mt-4">
              <h2 className="text-sm font-bold">ChainCacao</h2>
              <p className="text-[10px] text-gray-500">
                Interface Transformateur
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <MenuItem
              label="Tableau de bord"
              icon="🏠"
              href="/transformateur/dashboard"
            />
            <MenuItem
              label="Lots reçus"
              icon="📥"
              href="/transformateur/lots"
            />
            <MenuItem
              label="Traitements"
              icon="⚙️"
              href="/transformateur/traitements"
            />
            <MenuItem
              label="Mon compte"
              icon="👤"
              href="/transformateur/compte"
            />
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}

function MenuItem({
  label,
  icon,
  href,
}: {
  label: string;
  icon: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-50"
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[13px]">{label}</span>
    </Link>
  );
}

