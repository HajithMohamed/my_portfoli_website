"use client";

import dynamic from "next/dynamic";

const DeveloperDNACanvas = dynamic(
  () => import("@/components/3d/developer-dna").then((m) => ({ default: m.DeveloperDNA })),
  { 
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-[#050816] rounded-xl flex items-center justify-center text-slate-500">Loading neural network...</div>
  }
);

export function DeveloperDNAClient() {
  return <DeveloperDNACanvas />;
}
