# BDay

Sugestões de presentes para o meu aniversário :) Site estático (HTML/CSS/JS puro, sem build step) com a lista de presentes guardada no Supabase, para que quem visitar consiga marcar o que já comprou e ver o valor em real dos itens em dólar (com opção de pagar por PIX via Wise).

## Rodar localmente
Não tem build step. Só servir os arquivos estáticos, por exemplo:

```bash
python3 -m http.server
```

e abrir `http://localhost:8000`.

## Configurar o Supabase (backend)
1. Criar um projeto grátis em [supabase.com](https://supabase.com).
2. Abrir o **SQL Editor** do projeto e rodar o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) — cria a tabela `gifts`, as permissões (RLS) e a função que marca/desmarca presente como comprado.
3. Em **Database → Replication**, ativar Realtime para a tabela `gifts` (assim quem estiver com o site aberto vê em tempo real quando alguém marca um presente).
4. Em **Project Settings → API**, copiar a **Project URL** e a **anon public key** e colar em [`scripts/supabaseClient.js`](scripts/supabaseClient.js).
5. Preço e moeda de cada presente ficam na tabela `gifts` (colunas `price`/`currency`) — dá pra editar direto pelo **Table Editor** do Supabase, sem precisar mexer em código.

## Deploy (Vercel + domínio próprio)
1. Importar este repositório no [Vercel](https://vercel.com) (login com GitHub) — não precisa configurar build, é site estático.
2. Cada push na `main` gera um deploy automático.
3. Em **Project Settings → Domains**, adicionar `callmebia.com` e apontar o DNS conforme instruções da Vercel.
