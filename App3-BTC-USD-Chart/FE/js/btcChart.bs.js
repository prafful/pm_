// FE/js/btcChart.js
let chart;
let currentInterval = '1'; // default: realtime

async function createChart() {
  const res = await fetch(`http://localhost:8002/api/btc/data`);
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
        label: 'BTC/USD',
        data: prices,
        borderColor: 'blue',
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 500 },
      scales: {
        x: { title: { display: true, text: 'Time' }},
        y: { title: { display: true, text: 'Price (USD)' }}
      }
    }
  });
}

createChart();
