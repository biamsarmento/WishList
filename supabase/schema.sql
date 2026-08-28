-- Rode este script inteiro no SQL Editor do seu projeto Supabase.

create table if not exists gifts (
    id text primary key,
    title text not null,
    details text,
    link text not null,
    image text not null,
    price numeric,
    currency text not null default 'BRL' check (currency in ('BRL', 'USD')),
    is_purchased boolean not null default false,
    sort_order int not null default 0
);

alter table gifts enable row level security;

-- Qualquer visitante pode ler a lista de presentes.
create policy "Gifts are viewable by everyone"
    on gifts for select
    using (true);

-- Não existe policy de update/insert/delete pública: a única forma de
-- alterar o estado "comprado" pelo site é via a função abaixo, que só
-- mexe em is_purchased (preço, título, link etc. ficam protegidos).
create or replace function toggle_gift_purchased(p_gift_id text)
returns gifts
language plpgsql
security definer
set search_path = public
as $$
    declare
        updated_gift gifts;
    begin
        update gifts
        set is_purchased = not is_purchased
        where id = p_gift_id
        returning * into updated_gift;

        return updated_gift;
    end;
$$;

grant execute on function toggle_gift_purchased(text) to anon;

-- Lista inicial de presentes (preço/moeda a preencher/ajustar depois
-- pelo Table Editor do Supabase, ou editando este script antes de rodar).
insert into gifts (id, title, details, link, image, price, currency, sort_order)
values
    ('perfume-sol-de-janeiro', 'Perfume Sol de Janeiro', null,
        'https://www.sephora.com.br/Mist-Perfumado-Sol-de-Janeiro-Cheirosa--68-Body---Hair-Mist-44991535-584187.html',
        './images/solDeJaneiro.jpg.avif', null, 'BRL', 1),
    ('contorno-rare-beauty', 'Bastão de Contorno Rare Beauty', 'Cor: Bright Side',
        'https://www.sephora.com.br/bronzer-em-bastao-rare-beauty-warm-wishes-effortless-bronzer-44991113-577237.html',
        './images/contorno.jpg.avif', null, 'BRL', 2),
    ('massagem-elia-spa', 'Massagem Eliá Spa', null,
        'https://www.eliaspa.com.br/unidade/sudoeste',
        './images/elia-spa-palmas.jpg', null, 'BRL', 3),
    ('benefit-cera-sobrancelha', 'Benefit Cera de Sobrancelha', null,
        'https://www.sephora.com.br/mini-cera-de-sobrancelhas-benefit-fluff-up--648786.html',
        './images/benefit.jpg.avif', null, 'BRL', 4),
    ('scarpin-capodarte', 'Scarpin Capodarte', 'Cor: Bege claro',
        'https://www.capodarte.com.br/scarpin-verniz-seda-2001031698/p',
        './images/scarpin.png', null, 'BRL', 5),
    ('collant-so-danca', 'Collant Só Dança', 'Modelo: Luciana Sagioro. Cor: Preta. Cupom: DRY10',
        'https://www.sodanca.com.br/collant-luciana-sagioro-preto-ls29/p',
        './images/Collant.png', null, 'BRL', 6),
    ('macacao-live', 'Macacão Live', 'Cor: Fig',
        'https://www.liveoficial.com.br/macacao-long-cross-bynature-fig-4605000VN04/p',
        './images/Macacao.png', null, 'BRL', 7)
on conflict (id) do nothing;
