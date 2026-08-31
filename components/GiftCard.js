"use client";

import { resolveImageSrc } from "@/lib/giftImage";

const brlFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function GiftCard({ gift, rate, onClaim, onRelease }) {
  const totalUnits = gift.total_units ?? 1;
  const purchasedUnits = gift.purchased_units ?? 0;
  const isMultiUnit = totalUnits > 1;
  const isFullyClaimed = purchasedUnits >= totalUnits;

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
          {isMultiUnit && <span className="font-normal"> por cota</span>}
        </p>
      )}

      {isMultiUnit && (
        <div className="w-full">
          <p className="font-comic text-sm">
            {purchasedUnits} de {totalUnits} já compraram
          </p>
          <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-rose transition-all duration-300"
              style={{ width: `${Math.min((purchasedUnits / totalUnits) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto flex w-full flex-col items-center gap-2 pt-2">
        {isMultiUnit ? (
          <>
            {isFullyClaimed ? (
              <p className="rounded-full bg-gray-400 px-5 py-2 font-comic text-white">
                Todas as cotas já foram compradas
              </p>
            ) : (
              <button
                type="button"
                onClick={() => onClaim(gift.id)}
                className="cursor-pointer rounded-full bg-rose px-5 py-2 font-comic text-white transition hover:bg-rose-light"
              >
                Contribuir com uma cota
              </button>
            )}
            {purchasedUnits > 0 && (
              <button
                type="button"
                onClick={() => onRelease(gift.id)}
                className="cursor-pointer font-comic text-sm text-rose underline"
              >
                Contribuí por engano, desmarcar uma cota
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => (isFullyClaimed ? onRelease(gift.id) : onClaim(gift.id))}
            className={`cursor-pointer rounded-full px-5 py-2 font-comic text-white transition ${
              isFullyClaimed ? "bg-gray-400 hover:bg-gray-500" : "bg-rose hover:bg-rose-light"
            }`}
          >
            {isFullyClaimed ? "Já foi presenteado (clique para desmarcar)" : "Já comprei!"}
          </button>
        )}
      </div>
    </div>
  );
}
