// src/app/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";

// export default function HomePage() {
//   const router = useRouter();
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     const token = Cookies.get("access_token");
//     setIsConnected(!!token);
//   }, []);

//   return (
//     <div
//       className="h-screen flex items-center justify-center"
//       style={{ background: "#f6f1e7" }}
//     >
//       <div className="w-full max-w-md text-center p-6">

//         {/* LOGO / TITRE */}
//         <h1
//           className="text-3xl font-bold mb-2"
//           style={{ color: "#5c3a21" }}
//         >
//           ChainCacao
//         </h1>

//         <p className="text-sm mb-8 text-gray-700">
//           Traçabilité agricole & exportation cacao certifié EUDR
//         </p>

//         {/* ACTIONS */}
//         <div className="space-y-3">

//           {!isConnected && (
//             <>
//               <button
//                 onClick={() => router.push("/login")}
//                 className="w-full py-3 text-white font-bold rounded"
//                 style={{ background: "#5c3a21" }}
//               >
//                 Se connecter
//               </button>

//               <button
//                 onClick={() => router.push("/register")}
//                 className="w-full py-3 font-bold rounded border"
//                 style={{ borderColor: "#5c3a21", color: "#5c3a21" }}
//               >
//                 Créer un compte
//               </button>
//             </>
//           )}

//           {isConnected && (
//             <button
//               onClick={() => router.push("/login")}
//               className="w-full py-3 text-white font-bold rounded"
//               style={{ background: "#2f6b3f" }}
//             >
//               Continuer vers l’application
//             </button>
//           )}

//         </div>

//         {/* FOOTER */}
//         <p className="text-xs mt-8 text-gray-500">
//           MIABE Hackathon 2026 — Togo
//         </p>

//       </div>
//     </div>
//   );
// }

// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function HomePage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsConnected(!!token);
  }, []);

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "#f6f1e7" }}
    >
      <div className="w-full max-w-md text-center p-6">

        {/* LOGO / TITRE */}
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "#5c3a21" }}
        >
          ChainCacao
        </h1>

        <p className="text-sm mb-8 text-gray-700">
          Traçabilité agricole & exportation cacao certifié EUDR
        </p>

        {/* ACTIONS */}
        <div className="space-y-3">

          {!isConnected && (
            <>
              <button
                onClick={() => router.push("/login")}
                className="w-full py-3 text-white font-bold rounded"
                style={{ background: "#5c3a21" }}
              >
                Se connecter
              </button>

              <button
                onClick={() => router.push("/register")}
                className="w-full py-3 font-bold rounded border"
                style={{ borderColor: "#5c3a21", color: "#5c3a21" }}
              >
                Créer un compte
              </button>
            </>
          )}

          {isConnected && (
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 text-white font-bold rounded"
              style={{ background: "#2f6b3f" }}
            >
              Continuer vers l'application
            </button>
          )}

          {/* VÉRIFICATION PUBLIQUE */}
          <button
            onClick={() => router.push("/verify")}
            className="w-full py-3 font-bold rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            🔍 Vérifier un lot
          </button>

        </div>

        {/* FOOTER */}
        <p className="text-xs mt-8 text-gray-500">
          MIABE Hackathon 2026 — Togo
        </p>

      </div>
    </div>
  );
}
