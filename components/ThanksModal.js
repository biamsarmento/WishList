"use client";

import Image from "next/image";

export default function ThanksModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 cursor-pointer font-comic text-xl text-rose"
        >
          ×
        </button>

        <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl">
          <Image src="/images/thanks.jpg" alt="Bia agradecendo" fill className="object-cover" />
        </div>

        <h2 className="mt-4 font-nerko text-3xl text-rose">Obrigada</h2>
        <p className="mt-2 font-comic leading-relaxed text-rose">
          Muito obrigada por pensar em mim e escolher esse presente.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 cursor-pointer rounded-full bg-rose px-5 py-2 font-comic text-white transition hover:bg-rose-light"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
