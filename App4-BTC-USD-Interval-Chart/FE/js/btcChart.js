let chart;

async function createChart(interval = '1') {
  let apiUrl;


    apiUrl = `http://localhost:8003/api/btc/data/interval/${interval}`;
  

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const labels = data.map(d =>
      new Date(d.timestamp || d.time_group).toLocaleTimeString()
    );
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
        animation: false,
        scales: {
          x: { title: { display: true, text: 'Time' }},
          y: { title: { display: true, text: 'Price (USD)' }}
        }
      }
    });
  } catch (err) {
    console.error('Error fetching BTC chart data:', err);
  }
}

document.getElementById('intervalSelect').addEventListener('change', (e) => {
  createChart(e.target.value);
});

createChart(); // default load (raw)
