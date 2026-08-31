"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const inputClass = "rounded-xl border-2 border-blush px-3 py-2 font-comic";

export default function AdminGiftCard({ gift, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    title: gift.title,
    details: gift.details ?? "",
    link: gift.link,
    price: gift.price ?? "",
    currency: gift.currency,
    sort_order: gift.sort_order,
    total_units: gift.total_units ?? 1,
    purchased_units: gift.purchased_units ?? 0,
  });
  const [status, setStatus] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus("saving");

    const { error } = await supabase
      .from("gifts")
      .update({
        title: form.title,
        details: form.details || null,
        link: form.link,
        price: form.price === "" ? null : Number(form.price),
        currency: form.currency,
        sort_order: Number(form.sort_order) || 0,
        total_units: Math.max(Number(form.total_units) || 1, 1),
        purchased_units: Math.max(Number(form.purchased_units) || 0, 0),
      })
      .eq("id", gift.id);

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }

    setStatus("saved");
    onSaved?.();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from("gifts").delete().eq("id", gift.id);
    setDeleting(false);

    if (error) {
      console.error(error);
      setStatus("delete-error");
      return;
    }

    onDeleted?.(gift.id);
  };

  return (
    <form
      onSubmit={handleSave}
      className="flex w-full max-w-sm flex-col gap-3 rounded-3xl bg-white/70 p-6 shadow-sm"
    >
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        required
        placeholder="Título"
        className={inputClass}
      />
      <input
        name="details"
        value={form.details}
        onChange={handleChange}
        placeholder="Detalhes"
        className={inputClass}
      />
      <input
        name="link"
        type="url"
        value={form.link}
        onChange={handleChange}
        required
        placeholder="Link"
        className={inputClass}
      />

      <div className="flex gap-2">
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={handleChange}
          placeholder="Preço"
          className={`w-full ${inputClass}`}
        />
        <select name="currency" value={form.currency} onChange={handleChange} className={inputClass}>
          <option value="BRL">BRL</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <label className="font-comic text-sm text-rose">
        Ordem
        <input
          name="sort_order"
          type="number"
          value={form.sort_order}
          onChange={handleChange}
          className={`mt-1 w-full ${inputClass}`}
        />
      </label>

      <div className="flex gap-2">
        <label className="w-full font-comic text-sm text-rose">
          Quantidade de cotas
          <input
            name="total_units"
            type="number"
            min="1"
            value={form.total_units}
            onChange={handleChange}
            className={`mt-1 w-full ${inputClass}`}
          />
        </label>
        <label className="w-full font-comic text-sm text-rose">
          Cotas já compradas
          <input
            name="purchased_units"
            type="number"
            min="0"
            value={form.purchased_units}
            onChange={handleChange}
            className={`mt-1 w-full ${inputClass}`}
          />
        </label>
      </div>
      <p className="-mt-2 font-comic text-xs text-rose">
        Deixe quantidade de cotas em 1 pra presentes normais (comprados por inteiro).
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-rose px-4 py-2 font-comic text-white hover:bg-rose-light"
        >
          Salvar
        </button>

        {confirmingDelete ? (
          <div className="flex items-center gap-2 font-comic text-sm">
            <span>Excluir?</span>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="cursor-pointer rounded-full bg-red-400 px-3 py-1 text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="cursor-pointer rounded-full border-2 border-blush px-3 py-1 text-rose"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="cursor-pointer rounded-full border-2 border-red-300 px-4 py-2 font-comic text-red-500 hover:bg-red-50"
          >
            Excluir
          </button>
        )}
      </div>

      {status === "saved" && <p className="font-comic text-sm text-green-600">Salvo!</p>}
      {status === "error" && <p className="font-comic text-sm text-red-500">Erro ao salvar.</p>}
      {status === "delete-error" && (
        <p className="font-comic text-sm text-red-500">Erro ao excluir.</p>
      )}
    </form>
  );
}
