"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const inputClass = "rounded-xl border-2 border-blush px-3 py-2 font-comic";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyForm = { title: "", details: "", link: "", price: "", currency: "BRL", sort_order: 0 };

export default function AdminGiftForm({ onAdded }) {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setStatus("Escolhe uma imagem pro presente.");
      return;
    }

    setStatus("Enviando...");

    try {
      const baseSlug = slugify(form.title) || "presente";
      const id = `${baseSlug}-${Date.now().toString(36)}`;
      const filePath = `${id}-${file.name}`;

      const { error: uploadError } = await supabase.storage.from("gift-images").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("gift-images").getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("gifts").insert({
        id,
        title: form.title,
        details: form.details || null,
        link: form.link,
        image: data.publicUrl,
        price: form.price === "" ? null : Number(form.price),
        currency: form.currency,
        sort_order: Number(form.sort_order) || 0,
      });
      if (insertError) throw insertError;

      setStatus("Presente adicionado!");
      setForm(emptyForm);
      setFile(null);
      event.target.reset();
      onAdded?.();
    } catch (error) {
      console.error(error);
      setStatus("Erro ao adicionar presente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-3 rounded-3xl bg-white/70 p-6 shadow-sm"
    >
      <h2 className="font-nerko text-xl text-rose">Adicionar presente</h2>
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
        placeholder="Detalhes (opcional)"
        className={inputClass}
      />
      <input
        name="link"
        type="url"
        value={form.link}
        onChange={handleChange}
        required
        placeholder="Link da loja"
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
          placeholder="Preço (opcional)"
          className={`w-full ${inputClass}`}
        />
        <select name="currency" value={form.currency} onChange={handleChange} className={inputClass}>
          <option value="BRL">BRL</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <input
        name="sort_order"
        type="number"
        value={form.sort_order}
        onChange={handleChange}
        placeholder="Ordem"
        className={inputClass}
      />

      <input
        type="file"
        accept="image/*"
        required
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="font-comic text-sm"
      />

      <button
        type="submit"
        className="rounded-full bg-rose px-4 py-2 font-comic text-white hover:bg-rose-light"
      >
        Adicionar
      </button>

      {status && <p className="font-comic text-sm text-rose">{status}</p>}
    </form>
  );
}
