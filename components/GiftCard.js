"use client";

import { useState } from "react";
import { resolveImageSrc } from "@/lib/giftImage";

const WISE_PIX_KEY = "+55 61 998793939";

const brlFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function GiftCard({ gift, rate, onToggle }) {
  const [showPix, setShowPix] = useState(false);

  const brlAmount = gift.price != null && rate ? brlFormatter.format(gift.price * rate) : null;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl bg-white/60 p-6 text-center shadow-sm">
      <h2 className="font-nerko text-2xl text-rose">{gift.title}</h2>
      {gift.details && <p className="font-comic text-sm">{gift.details}</p>}

      <a href={gift.link} target="_blank" rel="noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveImageSrc(gift.image)}
          alt={gift.title}
          className="h-72 w-72 rounded-2xl object-cover"
        />
      </a>

      {gift.price != null && (
        <p className="font-comic font-bold">
          {gift.currency === "USD" ? usdFormatter.format(gift.price) : brlFormatter.format(gift.price)}
          {gift.currency === "USD" && brlAmount && (
            <span className="font-normal"> (≈ {brlAmount} hoje)</span>
          )}
        </p>
      )}

      <button
        type="button"
        onClick={() => onToggle(gift.id, gift.is_purchased)}
        className={`rounded-full px-5 py-2 font-comic text-white transition ${
          gift.is_purchased ? "bg-gray-400 hover:bg-gray-500" : "bg-rose hover:bg-rose-light"
        }`}
      >
        {gift.is_purchased ? "🎉 Já foi presenteado (clique para desmarcar)" : "Já comprei!"}
      </button>

      {gift.currency === "USD" && gift.price != null && (
        <div className="w-full">
          <button
            type="button"
            onClick={() => setShowPix((current) => !current)}
            className="font-comic text-sm text-rose underline"
          >
            Prefiro pagar por PIX 💸
          </button>

          {showPix && (
            <div className="mt-2 rounded-2xl border-2 border-dashed border-blush bg-cream p-3 font-comic text-sm">
              <p>
                Chave PIX (Wise): <strong>{WISE_PIX_KEY}</strong>
              </p>
              <p>
                Valor aproximado hoje: <strong>{brlAmount ?? "indisponível no momento"}</strong>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
