import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src="/images/background.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-cream/45" />

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <h1 className="font-nerko text-4xl text-rose sm:text-5xl">Oi, eu sou a Bia!</h1>
          {/* TODO: Bia, troca esse parágrafo pelo texto que você quiser sobre você */}
          <p className="mt-4 font-comic text-lg leading-relaxed text-rose">
            Em breve conto um pouquinho mais sobre mim por aqui...
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl bg-white/60 p-6 shadow-sm">
          <h2 className="font-nerko text-2xl text-rose">Como o site funciona</h2>
          <ul className="mt-4 flex flex-col gap-3 font-comic leading-relaxed text-rose">
            <li>
              Na{" "}
              <Link href="/presentes" className="underline">
                lista de presentes
              </Link>{" "}
              você encontra as sugestões. É só clicar na imagem pra ir até a loja.
            </li>
            <li>
              Já comprou algum? Clica em &quot;Já comprei!&quot; pra avisar os outros convidados e
              ninguém repetir o presente.
            </li>
            <li>Itens em dólar mostram o valor convertido em real, na cotação do dia.</li>
            <li>Prefere só mandar um PIX? A chave fica sempre visível na lista de presentes.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
