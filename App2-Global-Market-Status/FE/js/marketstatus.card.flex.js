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

  markets.forEach(m => {
    const card = document.createElement('div');
    card.className = 'market-card';

    card.innerHTML = `
      <div>
        <div class="market-title">${m.market_name}</div>
        <div class="text-muted mb-2">${m.country}</div>
        <div class="market-info">🕒 Open: <strong>${m.open_time_IST}</strong></div>
        <div class="market-info">🕔 Close: <strong>${m.close_time_IST}</strong></div>
      </div>
      <div class="mt-3">
        <span class="badge rounded-pill ${m.is_open_now ? 'bg-success' : 'bg-danger'} status-badge">
          ${m.is_open_now ? '🟢 Open' : '🔴 Closed'}
        </span>
      </div>
    `;

    grid.appendChild(card);
  });
}
