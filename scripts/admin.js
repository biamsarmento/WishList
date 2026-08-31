import { supabase } from "./supabaseClient.js";

const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const addGiftForm = document.getElementById("add-gift-form");
const addGiftStatus = document.getElementById("add-gift-status");
const giftsAdminList = document.getElementById("gifts-admin-list");

function slugify(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

async function handleLogin(event) {
    event.preventDefault();
    loginError.hidden = true;

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        loginError.textContent = "E-mail ou senha inválidos.";
        loginError.hidden = false;
    }
}

async function handleLogout() {
    await supabase.auth.signOut();
}

function renderGiftEditCard(gift) {
    const card = document.createElement("form");
    card.className = "gift admin-edit-card";
    card.dataset.giftId = gift.id;
    card.innerHTML = `
        <input type="text" name="title" value="${gift.title}" required>
        <input type="text" name="details" value="${gift.details ?? ""}" placeholder="Detalhes">
        <input type="url" name="link" value="${gift.link}" required>
        <input type="number" step="0.01" min="0" name="price" value="${gift.price ?? ""}" placeholder="Preço">
        <select name="currency">
            <option value="BRL" ${gift.currency === "BRL" ? "selected" : ""}>BRL</option>
            <option value="USD" ${gift.currency === "USD" ? "selected" : ""}>USD</option>
        </select>
        <input type="number" name="sort_order" value="${gift.sort_order}">
        <div class="admin-edit-actions">
            <button type="submit" class="gift-buy-btn">Salvar</button>
            <button type="button" class="gift-buy-btn admin-delete-btn">Excluir</button>
        </div>
        <p class="admin-status" hidden></p>
    `;

    card.addEventListener("submit", (event) => saveGift(event, gift.id));
    card.querySelector(".admin-delete-btn").addEventListener("click", () => deleteGift(gift.id, card));

    return card;
}

async function loadGiftsForEditing() {
    const { data: gifts, error } = await supabase.from("gifts").select("*").order("sort_order");

    if (error) {
        console.error("Não foi possível carregar os presentes:", error);
        return;
    }

    giftsAdminList.innerHTML = "";
    gifts.forEach((gift) => giftsAdminList.appendChild(renderGiftEditCard(gift)));
}

async function saveGift(event, id) {
    event.preventDefault();
    const form = event.target;
    const status = form.querySelector(".admin-status");
    const formData = new FormData(form);

    const { error } = await supabase
        .from("gifts")
        .update({
            title: formData.get("title"),
            details: formData.get("details") || null,
            link: formData.get("link"),
            price: formData.get("price") ? Number(formData.get("price")) : null,
            currency: formData.get("currency"),
            sort_order: Number(formData.get("sort_order")) || 0,
        })
        .eq("id", id);

    status.hidden = false;
    status.textContent = error ? "Erro ao salvar." : "Salvo!";
    if (error) console.error(error);
}

async function deleteGift(id, card) {
    if (!confirm("Tem certeza que quer excluir esse presente?")) return;

    const { error } = await supabase.from("gifts").delete().eq("id", id);

    if (error) {
        console.error(error);
        alert("Não foi possível excluir.");
        return;
    }

    card.remove();
}

async function handleAddGift(event) {
    event.preventDefault();
    const form = event.target;
    addGiftStatus.hidden = false;
    addGiftStatus.textContent = "Enviando...";

    const formData = new FormData(form);
    const file = formData.get("image");
    const title = formData.get("title");

    try {
        const baseSlug = slugify(title) || "presente";
        const id = `${baseSlug}-${Date.now().toString(36)}`;
        const filePath = `${id}-${file.name}`;

        const { error: uploadError } = await supabase.storage.from("gift-images").upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("gift-images").getPublicUrl(filePath);

        const { error: insertError } = await supabase.from("gifts").insert({
            id,
            title,
            details: formData.get("details") || null,
            link: formData.get("link"),
            image: data.publicUrl,
            price: formData.get("price") ? Number(formData.get("price")) : null,
            currency: formData.get("currency"),
            sort_order: Number(formData.get("sort_order")) || 0,
        });
        if (insertError) throw insertError;

        addGiftStatus.textContent = "Presente adicionado!";
        form.reset();
        loadGiftsForEditing();
    } catch (error) {
        console.error(error);
        addGiftStatus.textContent = "Erro ao adicionar presente.";
    }
}

function showAdminPanel() {
    loginSection.hidden = true;
    adminPanel.hidden = false;
    loadGiftsForEditing();
}

function showLogin() {
    loginSection.hidden = false;
    adminPanel.hidden = true;
}

supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
        showAdminPanel();
    } else {
        showLogin();
    }
});

loginForm.addEventListener("submit", handleLogin);
logoutBtn.addEventListener("click", handleLogout);
addGiftForm.addEventListener("submit", handleAddGift);
