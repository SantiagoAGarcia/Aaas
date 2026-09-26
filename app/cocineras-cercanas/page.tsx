import React from "react";
import Link from "next/link";
import { MapPin, ArrowLeft, ChefHat } from "lucide-react";

export default function CocinerasCercanasPage() {
  return (
    <main className="min-h-screen bg-[#14110f] text-[#fcfaf7] px-6 py-12 flex flex-col items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-[#1c1714] border border-lime-500/30 rounded-3xl p-8 md:p-12 shadow-2xl text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
          <MapPin className="w-8 h-8 stroke-[1.5]" />
        </div>
        
        <h1 className="font-['Syne'] text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
          Mapa de Proximidad
        </h1>
        
        <p className="text-stone-300 text-sm leading-relaxed max-w-lg font-light">
          Explora en tiempo real las cocineras y cocinas de barrio activas en tu radio de cercanía.
        </p>

        <div className="w-full p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs text-lime-300/80 font-mono">
          Ruta activa: /cocineras-cercanas • Mapa interactivo en desarrollo
        </div>

        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lime-500 hover:bg-lime-400 text-black font-semibold text-xs uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a OllaCercana
        </Link>
      </div>
    </main>
  );
}
