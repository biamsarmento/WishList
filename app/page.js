import Image from "next/image";
import Link from "next/link";
import BirthdayCountdown from "@/components/BirthdayCountdown";

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

        <div className="relative z-10 mx-auto max-w-2xl rounded-3xl bg-white/50 px-6 py-8 text-center shadow-sm backdrop-blur-sm sm:px-10 sm:py-10">
          <h1 className="font-nerko text-3xl text-rose sm:text-4xl">
            Faltam para o meu aniversário
          </h1>
          <div className="mt-6">
            <BirthdayCountdown />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-center">
          <div className="relative aspect-[3/5] w-full max-w-[220px] overflow-hidden rounded-3xl shadow-sm">
            <Image
              src="/images/babybia.png"
              alt="Foto da Bia quando criança"
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>

          <div className="w-full max-w-sm rounded-3xl bg-white/60 p-6 shadow-sm">
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
                Já comprou algum? Clica em &quot;Já comprei!&quot; pra avisar os outros
                convidados e ninguém repetir o presente.
              </li>
              <li>Itens em dólar mostram o valor convertido em real, na cotação do dia.</li>
              <li>Prefere só mandar um PIX? A chave fica sempre visível na lista de presentes.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
