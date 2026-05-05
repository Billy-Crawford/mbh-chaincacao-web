// src/app/cooperative/layout.tsx
// "use client";

// import AuthGuard from "@/components/AuthGuard";

// export default function CoopLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <AuthGuard allowedRoles={["cooperative"]}>
//       <div className="flex min-h-screen bg-white text-[#1f2937]">
//         {/* SIDEBAR */}
//         <aside className="w-64 border-r border-gray-100 p-6 flex flex-col">
//           <div className="mb-10">
//             <p className="text-[11px] font-bold text-gray-400">WEB</p>
//             <div className="mt-4">
//               <h2 className="text-sm font-bold">ChainCacao</h2>
//               <p className="text-[10px] text-gray-500">Coopérative de Kloto</p>
//             </div>
//           </div>

//           <nav className="space-y-1">
//             <MenuItem
//               active
//               label="Tableau de bord"
//               icon="🏠"
//               href="/cooperative/dashboard"
//             />
//             <MenuItem
//               label="Réceptions"
//               icon="📥"
//               href="/cooperative/receptions"
//             />
//             <MenuItem label="Rapports" icon="📊" href="/cooperative/rapports" />
//             <MenuItem label="Mon compte" icon="👤" href="/cooperative/compte" />
//           </nav>
//         </aside>

//         <main className="flex-1 p-8 overflow-y-auto">{children}</main>
//       </div>
//     </AuthGuard>
//   );
// }

// import Link from "next/link";

// function MenuItem({ label, active, icon, href }: any) {
//   return (
//     <Link
//       href={href}
//       className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
//         active
//           ? "bg-blue-50 text-blue-700 font-semibold"
//           : "text-gray-500 hover:bg-gray-50"
//       }`}
//     >
//       <span className="text-sm">{icon}</span>
//       <span className="text-[13px]">{label}</span>
//     </Link>
//   );
// }


// src/app/cooperative/layout.tsx
"use client";

import AuthGuard from "@/components/AuthGuard";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function CoopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
            <MenuItem
              label="Tableau de bord"
              icon="🏠"
              href="/cooperative/dashboard"
              active={pathname === "/cooperative/dashboard"}
            />
            <MenuItem
              label="Réceptions"
              icon="📥"
              href="/cooperative/receptions"
              active={pathname.startsWith("/cooperative/receptions")}
            />
            <MenuItem
              label="Rapports"
              icon="📊"
              href="/cooperative/rapports"
              active={pathname === "/cooperative/rapports"}
            />
            <MenuItem
              label="Mon compte"
              icon="👤"
              href="/cooperative/compte"
              active={pathname === "/cooperative/compte"}
            />
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </AuthGuard>
  );
}

function MenuItem({
  label,
  active,
  icon,
  href,
}: {
  label: string;
  active: boolean;
  icon: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
        active
          ? "bg-blue-50 text-blue-700 font-semibold"
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[13px]">{label}</span>
    </Link>
  );
}
