// public/js/marketstatus.js
const API_URL = 'http://localhost:8001/api/market/status';

document.addEventListener('DOMContentLoaded', () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => renderMarketCards(data))
    .catch(err => {
      console.error('❌ Error fetching data:', err);
      document.getElementById('marketCardGrid').innerHTML = `
        <div class="text-danger">⚠️ Error loading market data</div>
      `;
    });
});

function renderMarketCards(markets) {
  const grid = document.getElementById('marketCardGrid');
  grid.innerHTML = '';

  markets.forEach(market => {
    const card = document.createElement('div');
    card.className = 'card market-card shadow-sm';

    card.innerHTML = `
      <div class="card-body d-flex flex-column justify-content-between h-100">
        <div>
          <h5 class="card-title">${market.market_name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${market.country}</h6>
          <p class="card-text mb-1">🕒 Open: <strong>${market.open_time_IST}</strong></p>
          <p class="card-text">🕔 Close: <strong>${market.close_time_IST}</strong></p>
        </div>
        <div class="mt-3">
          <span class="badge rounded-pill ${market.is_open_now ? 'bg-success' : 'bg-danger'} badge-status">
            ${market.is_open_now ? '🟢 Open' : '🔴 Closed'}
          </span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}
