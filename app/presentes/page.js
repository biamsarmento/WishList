"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getExchangeRate } from "@/lib/exchangeRate";
import GiftCard from "@/components/GiftCard";
import PixBanner from "@/components/PixBanner";

export default function PresentesPage() {
  const [gifts, setGifts] = useState([]);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadGifts = useCallback(async () => {
    const [exchangeRate, { data, error }] = await Promise.all([
      getExchangeRate(),
      supabase.from("gifts").select("*").order("sort_order"),
    ]);

    setRate(exchangeRate);

    if (error) {
      console.error("Não foi possível carregar a lista de presentes:", error);
      setLoading(false);
      return;
    }

    setGifts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGifts();

    const channel = supabase
      .channel("gifts-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "gifts" },
        (payload) => {
          setGifts((current) =>
            current.map((gift) => (gift.id === payload.new.id ? payload.new : gift))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadGifts]);

  const toggleGift = async (id, wasPurchased) => {
    setGifts((current) =>
      current.map((gift) => (gift.id === id ? { ...gift, is_purchased: !wasPurchased } : gift))
    );

    const { error } = await supabase.rpc("toggle_gift_purchased", { p_gift_id: id });

    if (error) {
      console.error("Não foi possível atualizar o presente:", error);
      setGifts((current) =>
        current.map((gift) => (gift.id === id ? { ...gift, is_purchased: wasPurchased } : gift))
      );
      alert("Ops, não deu pra marcar agora. Tenta de novo em instantes!");
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pb-12 pt-40 sm:pt-28">
      <p className="max-w-xl text-center font-comic text-lg leading-relaxed">
        Oi gente! Criei esse site para dar sugestões de presentes para as pessoas que estiverem na
        dúvida sobre o que me dar... :) É só clicar na imagem para entrar no site! Se você já
        comprou algum presente, marca aqui para ninguém repetir. E nos itens em dólar dá pra ver o
        valor convertido em real, na cotação do dia.
      </p>

      <PixBanner />

      {loading ? (
        <p className="font-comic text-lg">Carregando a lista de presentes...</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {gifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} rate={rate} onToggle={toggleGift} />
          ))}
        </div>
      )}
    </div>
  );
}
