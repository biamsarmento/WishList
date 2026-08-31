const EXCHANGE_RATE_URL = "https://open.er-api.com/v6/latest/USD";
const CACHE_KEY = "usd-brl-rate";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h

export async function getExchangeRate() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    const { rate, fetchedAt } = JSON.parse(cached);
    if (Date.now() - fetchedAt < CACHE_TTL_MS) return rate;
  }

  try {
    const response = await fetch(EXCHANGE_RATE_URL);
    const data = await response.json();
    const rate = data.rates.BRL;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rate, fetchedAt: Date.now() }));
    return rate;
  } catch (error) {
    console.error("Não foi possível buscar a cotação do dólar:", error);
    return null;
  }
}
