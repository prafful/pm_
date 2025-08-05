// public/js/btcChart.js
let chart;

async function createChart() {
  try {
    const response = await fetch('http://localhost:8002/api/btc/data');
    const data = await response.json();

    const labels = data.map(entry =>
      new Date(entry.timestamp || entry.time_group).toLocaleTimeString()
    );
    const prices = data.map(entry => entry.price);

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
        animation: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price (USD)'
            }
          }
        }
      }
    });
  } catch (err) {
    console.error('Error fetching BTC chart data:', err);
  }
}

createChart();
