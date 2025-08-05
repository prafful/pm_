const API_BASE = 'http://localhost:8004/api/btc/trade';

async function loadWallet() {
  const res = await fetch(`${API_BASE}/wallet`);
  const wallet = await res.json();
  document.getElementById('usdBalance').textContent = wallet.usd_balance.toFixed(2);
  document.getElementById('btcBalance').textContent = wallet.btc_balance.toFixed(6);
}

async function loadHistory() {
  const res = await fetch(`${API_BASE}/history`);
  const history = await res.json();

  const table = document.getElementById('historyTable');
  table.innerHTML = '';

  history.forEach(trade => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${trade.type}</td>
      <td>${parseFloat(trade.price).toFixed(2)}</td>
      <td>${parseFloat(trade.amount).toFixed(6)}</td>
      <td>${new Date(trade.timestamp).toLocaleString()}</td>
    `;

    table.appendChild(row);
  });
}

async function placeTrade() {
  const type = document.getElementById('tradeType').value;
  const price = parseFloat(document.getElementById('price').value);
  const amount = parseFloat(document.getElementById('amount').value);

  if (isNaN(price) || isNaN(amount)) {
    alert("Please enter valid price and amount.");
    return;
  }

  const payload = { price, amount };

  const endpoint = type === 'buy' ? 'buy' : 'sell';

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await res.json();

  if (res.ok) {
    alert(result.message);
    loadWallet();
    loadHistory();
  } else {
    alert(result.error || "Trade failed.");
  }
}

loadWallet();
loadHistory();
