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
    ('castical-ceramica', 'Castiçal de Cerâmica', 'Cor: Verde',
        'https://www.zarahome.com/br/castical-de-ceramica-com-estampado-floral-l42460048?srch=true&pelement=451544992&colorId=528',
        './images/vela.webp', null, 'BRL', 1),
    ('regata-live-harmony', 'Regata Live Harmony', 'Tamanho: PP. Cor: Slate ou Claret',
        'https://www.liveoficial.com.br/regata-harmony-slate-P133200CZ75/p',
        './images/regata-live-1.jpg', null, 'BRL', 2),
    ('regata-live-move-sense', 'Regata Live Move Sense', 'Tamanho: P. Cor: Sprout ou Nutmeg ou Claret',
        'https://www.liveoficial.com.br/regata-move-sense-sprout-P11280VD249/p?size=P',
        './images/regata-live-2.jpg', null, 'BRL', 3),
    ('top-live', 'Top Live', 'Tamanho: PP. Cor: Oat ou Mushroom',
        'https://www.liveoficial.com.br/top-slim-bt-sense-oat-P620000OW14/p',
        './images/top-live-1.jpg', null, 'BRL', 4),
    ('short-live-movement-dryside', 'Short Live Movement Dryside', 'Tamanho: P. Cor: Tide ou Escape',
        'https://www.liveoficial.com.br/shorts-movement-dryside-tide-P13460AZ212/p',
        './images/short-live.jpg', null, 'BRL', 5),
    ('short-legging-live', 'Short Legging Live', 'Tamanho: P. Cor: Drop ou Eclipse',
        'https://www.liveoficial.com.br/shorts-active-drop-P30540AZ190/p',
        './images/short-legging-live.jpg', null, 'BRL', 6),
    ('legging-max-lupo-sport', 'Legging Max Lupo Sport', 'Tamanho: P. Cor: Cinza ou Chocolate',
        'https://www.lsport.com.br/calca-lupo-af-leg--max-lupo-71053-001/p?idsku=134',
        './images/legging-lupo.png', null, 'BRL', 7),
    ('massagem-elia-spa', 'Massagem Eliá Spa', null,
        'https://www.eliaspa.com.br/unidade/sudoeste',
        './images/elia-spa-palmas.jpg', null, 'BRL', 8)
on conflict (id) do nothing;
