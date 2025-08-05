async function updateLatestPrice() {
  try {
    const res = await fetch('http://localhost:8000/api/btc/latest');
    const data = await res.json();
    document.getElementById('priceValue').textContent = parseFloat(data.price).toFixed(2);
  } catch (err) {
    console.error("Failed to fetch latest price:", err);
    document.getElementById('priceValue').textContent = '--';
  }
}

// Initial call
// updateLatestPrice();

// Update every 10 seconds
setInterval(updateLatestPrice, 5000);
// Ensure the function is called when the document is ready
document.addEventListener('DOMContentLoaded', updateLatestPrice)