"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGiftCard from "@/components/AdminGiftCard";
import AdminGiftForm from "@/components/AdminGiftForm";

export default function AdminPage() {
  const [session, setSession] = useState(undefined);
  const [gifts, setGifts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const loadGifts = useCallback(async () => {
    const { data, error } = await supabase.from("gifts").select("*").order("sort_order");
    if (error) {
      console.error(error);
      return;
    }
    setGifts(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadGifts();
  }, [session, loadGifts]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError("E-mail ou senha inválidos.");
  };

  const handleLogout = () => supabase.auth.signOut();

  const handleDeleted = (id) => {
    setGifts((current) => current.filter((gift) => gift.id !== id));
  };

  if (session === undefined) {
    return <p className="pt-40 p-12 text-center font-comic">Carregando...</p>;
  }

  if (!session) {
    return (
      <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 pb-16 pt-40 sm:pt-28">
        <h1 className="text-center font-nerko text-3xl text-rose">Login</h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-3 rounded-3xl bg-white/70 p-6 shadow-sm"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="E-mail"
            className="rounded-xl border-2 border-blush px-3 py-2 font-comic"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="Senha"
            className="rounded-xl border-2 border-blush px-3 py-2 font-comic"
          />
          <button
            type="submit"
            className="rounded-full bg-rose px-4 py-2 font-comic text-white hover:bg-rose-light"
          >
            Entrar
          </button>
          {loginError && <p className="font-comic text-sm text-red-500">{loginError}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pb-12 pt-40 sm:pt-28">
      <button
        onClick={handleLogout}
        type="button"
        className="self-end font-comic text-sm text-rose underline"
      >
        Sair
      </button>

      <AdminGiftForm onAdded={loadGifts} />

      <h2 className="font-nerko text-2xl text-rose">Presentes atuais</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {gifts.map((gift) => (
          <AdminGiftCard key={gift.id} gift={gift} onSaved={loadGifts} onDeleted={handleDeleted} />
        ))}
      </div>
    </div>
  );
}
