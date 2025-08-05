// public/js/marketstatus.js
const API_URL = 'http://localhost:8001/api/market/status';

document.addEventListener('DOMContentLoaded', () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => renderMarkets(data))
    .catch(err => {
      console.error('❌ Error fetching market data:', err);
      document.getElementById('marketTableBody').innerHTML = `
        <tr><td colspan="5" class="text-danger">⚠️ Error loading data</td></tr>
      `;
    });
});

function renderMarkets(markets) {
  const tbody = document.getElementById('marketTableBody');
  tbody.innerHTML = '';

  markets.forEach(market => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${market.market_name}</td>
      <td>${market.country}</td>
      <td>${market.open_time_IST}</td>
      <td>${market.close_time_IST}</td>
      <td>
        <span class="badge rounded-pill ${market.is_open_now ? 'bg-success' : 'bg-danger'} badge-status">
          ${market.is_open_now ? '🟢 Open' : '🔴 Closed'}
        </span>
      </td>
    `;

    tbody.appendChild(row);
  });
}
