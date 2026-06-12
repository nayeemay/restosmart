const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}

let cart = JSON.parse(localStorage.getItem("restoSmartCart")) || [];

function saveCart() {
    localStorage.setItem("restoSmartCart", JSON.stringify(cart));
}

function formatMoney(amount) {
    return "₹" + amount.toFixed(0);
}

function updateCartCount() {
    const countElements = document.querySelectorAll("#cartCount");
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    countElements.forEach((element) => {
        element.textContent = count;
    });
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const grandTotalElement = document.getElementById("grandTotal");

    updateCartCount();

    if (!cartItems || !subtotalElement || !taxElement || !grandTotalElement) {
        return;
    }

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">No items added yet.</p>';
    } else {
        cartItems.innerHTML = cart.map((item) => `
            <div class="cart-line">
                <div>
                    <strong>${item.name}</strong>
                    <span>Qty ${item.quantity} × ${formatMoney(item.price)}</span>
                </div>
                <strong>${formatMoney(item.price * item.quantity)}</strong>
            </div>
        `).join("");
    }

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const grandTotal = subtotal + tax;

    subtotalElement.textContent = formatMoney(subtotal);
    taxElement.textContent = formatMoney(tax);
    grandTotalElement.textContent = formatMoney(grandTotal);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".add-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".food-card");
        const name = card.dataset.name;
        const price = Number(card.dataset.price);
        const existingItem = cart.find((item) => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        saveCart();
        renderCart();
        showToast(`${name} added to cart.`);
    });
});

const clearCartButton = document.getElementById("clearCart");
if (clearCartButton) {
    clearCartButton.addEventListener("click", () => {
        cart = [];
        saveCart();
        renderCart();
        showToast("Cart cleared.");
    });
}

const menuSearch = document.getElementById("menuSearch");
const categoryFilter = document.getElementById("categoryFilter");
const menuCards = document.querySelectorAll(".food-card");

function filterMenu() {
    const searchValue = menuSearch ? menuSearch.value.toLowerCase() : "";
    const categoryValue = categoryFilter ? categoryFilter.value : "All";

    menuCards.forEach((card) => {
        const nameMatches = card.dataset.name.toLowerCase().includes(searchValue);
        const categoryMatches = categoryValue === "All" || card.dataset.category === categoryValue;
        card.style.display = nameMatches && categoryMatches ? "block" : "none";
    });
}

if (menuSearch) {
    menuSearch.addEventListener("input", filterMenu);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", filterMenu);
}

const reservationDate = document.getElementById("date");
if (reservationDate) {
    reservationDate.min = new Date().toISOString().split("T")[0];
}

const reservationForm = document.getElementById("reservationForm");
const formMessage = document.getElementById("formMessage");

if (reservationForm && formMessage) {
    reservationForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const guests = Number(document.getElementById("guests").value);

        if (name.length < 3) {
            formMessage.className = "form-message error";
            formMessage.textContent = "Please enter a valid name.";
            return;
        }

        if (phone.length < 10 || isNaN(Number(phone))) {
            formMessage.className = "form-message error";
            formMessage.textContent = "Please enter a valid 10 digit phone number.";
            return;
        }

        if (!date || !time || guests < 1) {
            formMessage.className = "form-message error";
            formMessage.textContent = "Please select date, time, and number of guests.";
            return;
        }

        formMessage.className = "form-message success";
        formMessage.textContent = `Reservation confirmed for ${name}. Table request for ${guests} guest(s) has been submitted.`;
        reservationForm.reset();
        if (reservationDate) {
            reservationDate.min = new Date().toISOString().split("T")[0];
        }
    });
}

renderCart();
