import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-4 py-12">
      <section className="text-center">
        <h1 className="font-nerko text-4xl text-rose sm:text-5xl">Oi, eu sou a Bia! 🎂</h1>
        {/* TODO: Bia, troca esse parágrafo pelo texto que você quiser sobre você */}
        <p className="mt-4 font-comic text-lg leading-relaxed">
          Em breve conto um pouquinho mais sobre mim por aqui...
        </p>
      </section>

      <section className="rounded-3xl bg-white/60 p-6 shadow-sm">
        <h2 className="font-nerko text-2xl text-rose">Como o site funciona</h2>
        <ul className="mt-4 flex flex-col gap-3 font-comic leading-relaxed">
          <li>
            🎁 Na{" "}
            <Link href="/presentes" className="underline">
              lista de presentes
            </Link>{" "}
            você encontra as sugestões — é só clicar na imagem pra ir até a loja.
          </li>
          <li>
            ✅ Já comprou algum? Clica em &quot;Já comprei!&quot; pra avisar os outros convidados e
            ninguém repetir o presente.
          </li>
          <li>💵 Itens em dólar mostram o valor convertido em real, na cotação do dia.</li>
          <li>💸 Prefere não comprar o item direto? Dá pra pagar o valor equivalente por PIX.</li>
        </ul>
      </section>
    </div>
  );
}
