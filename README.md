# BDay

Site da lista de presentes de aniversário da Bia — Next.js + Tailwind, com os presentes guardados no Supabase para que quem visitar consiga marcar o que já comprou, ver o valor em real dos itens em dólar (com opção de pagar por PIX via Wise), e para a Bia editar tudo pelo painel `/admin`.

## Rodar localmente
```bash
npm install
npm run dev
```
Abre `http://localhost:3000`.

Precisa de um arquivo `.env.local` na raiz com:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
(os mesmos valores do projeto Supabase — ver **Project Settings → API** no painel do Supabase).

## Configurar o Supabase (backend)
1. Criar um projeto grátis em [supabase.com](https://supabase.com).
2. Abrir o **SQL Editor** do projeto e rodar o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) — cria a tabela `gifts`, as permissões (RLS), a função que marca/desmarca presente como comprado, a permissão de escrita para usuários logados e o bucket de imagens `gift-images`.
3. Em **Database → Replication**, ativar Realtime para a tabela `gifts` (assim quem estiver com o site aberto vê em tempo real quando alguém marca um presente).
4. Em **Authentication → Users**, criar um usuário (e-mail + senha) — só quem tiver essa conta consegue logar em `/admin`.
5. Em **Project Settings → API**, copiar a **Project URL** e a **anon public key** para o `.env.local` (local) e para as variáveis de ambiente do projeto na Vercel (produção).

## Editar a lista pelo site (/admin)
A página `/admin` permite adicionar, editar e excluir presentes sem entrar no Supabase — basta logar com o usuário criado no passo 4 acima.

## Deploy (Vercel + domínio próprio)
1. Importar este repositório no [Vercel](https://vercel.com) (login com GitHub) — o Vercel detecta que é um projeto Next.js e configura o build sozinho.
2. Em **Project Settings → Environment Variables**, adicionar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Cada push na `main` gera um deploy automático.
4. Em **Project Settings → Domains**, adicionar `callmebia.com` e apontar o DNS conforme instruções da Vercel.
