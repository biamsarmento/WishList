import { supabase } from "./supabaseClient.js";

const WISE_PIX_KEY = "+55 61 998793939";
const EXCHANGE_RATE_URL = "https://open.er-api.com/v6/latest/USD";
const EXCHANGE_RATE_CACHE_KEY = "usd-brl-rate";
const EXCHANGE_RATE_TTL_MS = 6 * 60 * 60 * 1000; // 6h

const listEl = document.getElementById("gifts-list");

const brlFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

async function getExchangeRate() {
    const cached = sessionStorage.getItem(EXCHANGE_RATE_CACHE_KEY);
    if (cached) {
        const { rate, fetchedAt } = JSON.parse(cached);
        if (Date.now() - fetchedAt < EXCHANGE_RATE_TTL_MS) return rate;
    }

    try {
        const response = await fetch(EXCHANGE_RATE_URL);
        const data = await response.json();
        const rate = data.rates.BRL;
        sessionStorage.setItem(EXCHANGE_RATE_CACHE_KEY, JSON.stringify({ rate, fetchedAt: Date.now() }));
        return rate;
    } catch (error) {
        console.error("Não foi possível buscar a cotação do dólar:", error);
        return null;
    }
}

function renderPrice(gift, rate) {
    if (gift.price == null) return "";

    if (gift.currency === "USD") {
        const brlAmount = rate ? brlFormatter.format(gift.price * rate) : null;
        return `
            <p class="gift-price">
                ${usdFormatter.format(gift.price)}${brlAmount ? ` <span class="gift-price-converted">(≈ ${brlAmount} hoje)</span>` : ""}
            </p>
        `;
    }

    return `<p class="gift-price">${brlFormatter.format(gift.price)}</p>`;
}

function renderPixBox(gift, rate) {
    if (gift.currency !== "USD" || gift.price == null) return "";

    const brlAmount = rate ? brlFormatter.format(gift.price * rate) : "valor indisponível no momento";

    return `
        <button type="button" class="gift-pix-toggle" aria-expanded="false">Prefiro pagar por PIX 💸</button>
        <div class="gift-pix-box" hidden>
            <p>Chave PIX (Wise): <strong>${WISE_PIX_KEY}</strong></p>
            <p>Valor aproximado hoje: <strong>${brlAmount}</strong></p>
        </div>
    `;
}

function buyButtonLabel(isPurchased) {
    return isPurchased ? "🎉 Já foi presenteado (clique para desmarcar)" : "Já comprei! 🎁";
}

function renderGift(gift, rate) {
    const article = document.createElement("div");
    article.className = "gift";
    article.dataset.giftId = gift.id;

    article.innerHTML = `
        <h2 class="gift-title">${gift.title}</h2>
        ${gift.details ? `<p class="gift-details">${gift.details}</p>` : ""}
        <a href="${gift.link}" class="gift-link" target="_blank">
            <img src="${gift.image}" alt="${gift.title}" class="gift-image">
        </a>
        ${renderPrice(gift, rate)}
        <button type="button" class="gift-buy-btn ${gift.is_purchased ? "is-purchased" : ""}">
            ${buyButtonLabel(gift.is_purchased)}
        </button>
        ${renderPixBox(gift, rate)}
    `;

    article.querySelector(".gift-buy-btn").addEventListener("click", () => toggleGift(gift.id));

    const pixToggle = article.querySelector(".gift-pix-toggle");
    if (pixToggle) {
        pixToggle.addEventListener("click", () => {
            const box = article.querySelector(".gift-pix-box");
            const expanded = pixToggle.getAttribute("aria-expanded") === "true";
            pixToggle.setAttribute("aria-expanded", String(!expanded));
            box.hidden = expanded;
        });
    }

    return article;
}

function updateGiftInDom(gift) {
    const article = listEl.querySelector(`[data-gift-id="${gift.id}"]`);
    if (!article) return;

    const button = article.querySelector(".gift-buy-btn");
    button.textContent = buyButtonLabel(gift.is_purchased);
    button.classList.toggle("is-purchased", gift.is_purchased);
}

async function toggleGift(id) {
    const article = listEl.querySelector(`[data-gift-id="${id}"]`);
    const button = article.querySelector(".gift-buy-btn");
    const wasPurchased = button.classList.contains("is-purchased");

    // Atualização otimista, com rollback se a chamada falhar
    updateGiftInDom({ id, is_purchased: !wasPurchased });

    const { error } = await supabase.rpc("toggle_gift_purchased", { p_gift_id: id });

    if (error) {
        console.error("Não foi possível atualizar o presente:", error);
        updateGiftInDom({ id, is_purchased: wasPurchased });
        alert("Ops, não deu pra marcar agora. Tenta de novo em instantes!");
    }
}

function subscribeToChanges(rate) {
    supabase
        .channel("gifts-changes")
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "gifts" },
            (payload) => updateGiftInDom(payload.new)
        )
        .subscribe();
}

async function loadGifts() {
    const [rate, { data: gifts, error }] = await Promise.all([
        getExchangeRate(),
        supabase.from("gifts").select("*").order("sort_order"),
    ]);

    if (error) {
        console.error("Não foi possível carregar a lista de presentes:", error);
        listEl.innerHTML = `<p class="gift-aviso">Ops, não consegui carregar a lista agora. Recarrega a página?</p>`;
        return;
    }

    listEl.innerHTML = "";
    gifts.forEach((gift) => listEl.appendChild(renderGift(gift, rate)));

    subscribeToChanges(rate);
}

loadGifts();
