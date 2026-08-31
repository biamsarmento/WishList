"use client";

import { useState } from "react";
import { WISE_PIX_KEY } from "@/lib/constants";

export default function PixBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WISE_PIX_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Não foi possível copiar a chave PIX:", error);
    }
  };

  return (
    <div className="max-w-2xl rounded-3xl border-2 border-rose bg-white/80 p-6 text-center shadow-sm">
      <h2 className="font-nerko text-2xl text-rose">Chave PIX?</h2>

      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <span className="rounded-full bg-cream px-5 py-2 font-comic text-lg font-bold text-rose">
          {WISE_PIX_KEY}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full bg-rose px-5 py-2 font-comic text-white transition hover:bg-rose-light"
        >
          {copied ? "Copiado!" : "Copiar chave"}
        </button>
      </div>
    </div>
  );
}
