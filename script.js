const products = [
  { id: 1, name: "Velvet Rose", category: "floral", size: "50 ml", price: 145000 },
  { id: 2, name: "Sandalwood Dusk", category: "woody", size: "50 ml", price: 165000 },
  { id: 3, name: "Citrus Breeze", category: "fresh", size: "30 ml", price: 110000 },
  { id: 4, name: "Jasmine Dew", category: "floral", size: "30 ml", price: 115000 }
];

const NO_WA = "6281234567890"; // Ganti dengan nomor WhatsApp penjual (format 62...)
let cart = [];

const productListEl = document.getElementById("product-list");
const cartPanelEl = document.getElementById("cart-panel");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);

function renderProducts(category = "all") {
  const filtered = category === "all"
    ? products
    : products.filter((p) => p.category === category);

  productListEl.innerHTML = filtered
    .map(
      (p) => `
      <article class="product-card">
        <div>
          <h3>${p.name}</h3>
          <p class="product-meta">${p.category.toUpperCase()} • ${p.size}</p>
        </div>
        <p class="product-price">${formatRupiah(p.price)}</p>
        <button class="add-btn" onclick="addToCart(${p.id})" type="button">
          Tambah ke Keranjang
        </button>
      </article>
    `
    )
    .join("");
}

function addToCart(id) {
  const item = products.find((p) => p.id === id);
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountEl.textContent = totalQty;
  cartTotalEl.textContent = formatRupiah(totalPrice);

  cartItemsEl.innerHTML = cart.length
    ? cart
        .map(
          (item) => `
        <li class="cart-item">
          <span>${item.name} (${item.size}) x${item.qty}</span>
          <span>${formatRupiah(item.price * item.qty)}</span>
        </li>
      `
        )
        .join("")
    : "<li>Keranjang masih kosong.</li>";
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});

document.getElementById("btn-cart").addEventListener("click", () => {
  cartPanelEl.classList.remove("hidden");
});

document.getElementById("close-cart").addEventListener("click", () => {
  cartPanelEl.classList.add("hidden");
});

document.getElementById("checkout-wa").addEventListener("click", () => {
  if (!cart.length) {
    alert("Pilih minimal satu parfum terlebih dahulu.");
    return;
  }
  const lines = cart.map(
    (item) => `- ${item.name} (${item.size}) x${item.qty} = ${formatRupiah(item.price * item.qty)}`
  );
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const text = encodeURIComponent(
    `Halo, saya ingin memesan parfum:\n${lines.join("\n")}\nTotal: ${formatRupiah(total)}`
  );
  window.open(`https://wa.me/${NO_WA}?text=${text}`, "_blank");
});

renderProducts();
renderCart();