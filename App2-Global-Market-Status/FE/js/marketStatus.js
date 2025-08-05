// file: public/js/marketstatus.js
const API_URL = 'http://localhost:8001/api/market/status';

document.addEventListener('DOMContentLoaded', () => {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => renderMarketTable(data))
    .catch(err => {
      console.error('❌ API fetch error:', err);
      document.getElementById('marketTableBody').innerHTML = `<tr><td colspan="5">Error loading market data</td></tr>`;
    });
});

function renderMarketTable(markets) {
  const table = document.getElementById('marketTableBody');
  table.innerHTML = '';

  markets.forEach(market => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${market.market_name}</td>
      <td>${market.country}</td>
      <td>${market.open_time_IST}</td>
      <td>${market.close_time_IST}</td>
      <td class="open-status ${market.is_open_now ? 'open' : 'closed'}">
        ${market.is_open_now ? '🟢 Open' : '🔴 Closed'}
      </td>
    `;

    table.appendChild(row);
  });
}
