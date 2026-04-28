"use client";

export default function GlobalLoader() {
  return (
    <div className="flex items-center justify-center h-screen"
         style={{ background: "#f6f1e7" }}>

      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto"
             style={{ borderColor: "#5c3a21" }} />

        <p className="mt-3 text-sm" style={{ color: "#5c3a21" }}>
          Chargement ChainCacao...
        </p>
      </div>
    </div>
  );
}

