// src/app/transformateur/layout.tsx
"use client";

import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TransformateurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthGuard allowedRoles={["transformateur"]}>
      <div className="flex min-h-screen bg-white text-[#1f2937]">
        <aside className="w-64 border-r border-gray-100 p-6 flex flex-col">
          <div className="mb-10">
            <p className="text-[11px] font-bold text-gray-400">WEB</p>
            <div className="mt-4">
              <h2 className="text-sm font-bold">ChainCacao</h2>
              <p className="text-[10px] text-gray-500">Interface Transformateur</p>
            </div>
          </div>

          <nav className="space-y-1">
            <MenuItem label="Tableau de bord" icon="🏠" href="/transformateur/dashboard" active={pathname === "/transformateur/dashboard"} />
            <MenuItem label="Lots reçus" icon="📥" href="/transformateur/lots" active={pathname.startsWith("/transformateur/lots")} />
            <MenuItem label="Traitements" icon="⚙️" href="/transformateur/traitements" active={pathname === "/transformateur/traitements"} />
            <MenuItem label="Mon compte" icon="👤" href="/transformateur/compte" active={pathname === "/transformateur/compte"} />
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </AuthGuard>
  );
}

function MenuItem({ label, icon, href, active }: { label: string; icon: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
        active ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[13px]">{label}</span>
    </Link>
  );
}

