const productSelect = document.getElementById("productSelect");
const message = document.getElementById("message");
const totalSales = document.getElementById("totalSales");

async function loadProducts() {
  const res = await fetch("/products");
  const products = await res.json();

  productSelect.innerHTML = "";
  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.name} - ₱${p.price}`;
    productSelect.appendChild(opt);
  });
}

async function recordSale() {
  const product_id = productSelect.value;
  const quantity = document.getElementById("quantity").value;

  if (!quantity || quantity <= 0) {
    message.textContent = "⚠️ Please enter a valid quantity.";
    message.className = "text-red-600 font-semibold";
    return;
  }

  const res = await fetch("/sale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, quantity }),
  });

  const data = await res.json();

  if (data.error) {
    message.textContent = "❌ " + data.error;
    message.className = "text-red-600 font-semibold";
  } else {
    message.textContent = `✅ Sale recorded! Total: ₱${data.total}`;
    message.className = "text-green-600 font-semibold";
    loadTotalSales();
  }
}

async function deleteLastSale() {
  const res = await fetch("/sale/last", { method: "DELETE" });
  const data = await res.json();

  if (data.error) {
    message.textContent = "❌ " + data.error;
    message.className = "text-red-600 font-semibold";
  } else {
    message.textContent = "🗑️ Last sale removed!";
    message.className = "text-green-600 font-semibold";
    loadTotalSales();
  }
}

async function loadTotalSales() {
  const res = await fetch("/sales/total");
  const data = await res.json();
  totalSales.textContent = `₱${data.total_sales.toFixed(2)}`;
}

// Events
document.getElementById("submitSale").addEventListener("click", recordSale);
document.getElementById("deleteLastSale").addEventListener("click", deleteLastSale);

// Init
loadProducts();
loadTotalSales();
