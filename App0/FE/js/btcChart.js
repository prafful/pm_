let chart;
let currentInterval = '1'; // Default to realtime

async function createChart(interval = '1') {
    const res = await fetch(`http://localhost:3000/api/btc/data?interval=${interval}`);
    const data = await res.json();

    const labels = data.map(d => new Date(d.timestamp || d.time_group).toLocaleTimeString());
    const prices = data.map(d => d.price);

    const ctx = document.getElementById('btcChart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'BTC-USD',
                data: prices,
                borderColor: 'blue',
                fill: false,
                tension: 0.2
            }]
        },
        options: {
            animation: { duration: 500 },
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { title: { display: true, text: 'Price (USD)' } }
            }
        }
    });
}

// Called periodically to append the latest point for realtime view
async function pollLatestPoint() {
    if (currentInterval !== '1') return; // Only poll in realtime mode

    try {
        const res = await fetch('http://localhost:3000/api/btc/data');
        const data = await res.json();
        const latestPoint = data[data.length - 1];

        const label = new Date(latestPoint.timestamp).toLocaleTimeString();
        const price = parseFloat(latestPoint.price);

        chart.data.labels.push(label);
        chart.data.datasets[0].data.push(price);
        chart.update();
    } catch (err) {
        console.error("Error updating chart with latest point:", err);
    }
}

// Initial chart load
createChart();

// Poll and animate new point every 15 sec if realtime
setInterval(pollLatestPoint, 15000);

// Update price display
async function updateLatestPrice() {
    try {
        const res = await fetch('http://localhost:3000/api/btc/latest');
        const data = await res.json();
        document.getElementById('priceValue').textContent = data.price;
    } catch (err) {
        console.error("Failed to fetch latest price:", err);
        document.getElementById('priceValue').textContent = '--';
    }
}
updateLatestPrice();
setInterval(updateLatestPrice, 10000);

// Market status from Alpha Vantage
async function loadMarketStatus() {
    const url = "https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=QDBSOXHDMR6R4QD1";

    try {
        const res = await fetch(url);
        const json = await res.json();

        const container = document.getElementById("marketStatusGrid");
        container.innerHTML = '';

        json.markets.forEach(market => {
            const box = document.createElement("div");
            const isOpen = market.current_status.toLowerCase() === 'open';

            box.style.cssText = `
              border: 1px solid ${isOpen ? '#2ecc71' : '#e74c3c'};
              background-color: ${isOpen ? '#ecf9f1' : '#fdecea'};
              color: ${isOpen ? '#2ecc71' : '#e74c3c'};
              padding: 10px;
              width: 200px;
              border-radius: 5px;
              font-size: 0.9em;
            `;

            box.innerHTML = `
              <strong>${market.region} (${market.market_type})</strong><br>
              Status: <strong>${market.current_status.toUpperCase()}</strong><br>
              Time: ${market.local_open} - ${market.local_close}
            `;

            container.appendChild(box);
        });
    } catch (err) {
        console.error("❌ Error loading market status:", err);
        document.getElementById("marketStatusGrid").innerHTML = "<p>Error loading data.</p>";
    }
}
loadMarketStatus();
setInterval(loadMarketStatus, 1800000); // every 30 mins

// Handle dropdown interval change
document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('intervalSelect');
    select.addEventListener('change', (e) => {
        currentInterval = e.target.value;
        createChart(currentInterval);
    });
});


 async function buy() {
    const amount = parseFloat(document.getElementById('buyAmount').value);
    const res = await fetch('http://localhost:3000/api/btc/trade/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usd_amount: amount })
    });
    const data = await res.json();
    console.log(data);
    loadWallet(); // Refresh wallet after trade
  }

  async function sell() {
    const amount = parseFloat(document.getElementById('sellAmount').value);
    const res = await fetch('http://localhost:3000/api/btc/trade/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ btc_amount: amount })
    });
    const data = await res.json();
    console.log(data);
    loadWallet(); // Refresh wallet after trade
  }

  async function loadWallet() {
  try {
    const res = await fetch('http://localhost:3000/api/btc/trade/wallet');
    const data = await res.json();
    document.getElementById('walletStatus').textContent =
      `💰 $${parseFloat(data.usd_balance).toFixed(2)} | ₿${parseFloat(data.btc_balance).toFixed(6)}`;
  } catch (err) {
    console.error("Failed to fetch wallet status:", err);
    document.getElementById('walletStatus').textContent = '⚠️ Error';
  }
}

loadWallet()
