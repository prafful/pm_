async function loadTradeHistoryChart() {
  try {
    const res = await fetch('http://localhost:3000/api/btc/trade/history');
    const data = await res.json();

    const labels = data.map(d => new Date(d.timestamp));
    const prices = data.map(d => parseFloat(d.price));
    const amounts = data.map(d => parseFloat(d.amount));
    const types = data.map(d => d.type);

    const ctx = document.getElementById('tradeHistoryChart').getContext('2d');
    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'BTC Trades',
          data: data.map((d) => ({
            x: new Date(d.timestamp),
            y: parseFloat(d.amount),
            type: d.type
          })),
          backgroundColor: types.map(type => type === 'BUY' ? '#2ecc71' : '#e74c3c'),
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: 'HH:mm:ss',
              displayFormats: { minute: 'HH:mm' }
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'BTC Amount'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const trade = data[context.dataIndex];
                return `${trade.type} ${trade.amount} BTC @ ₹${trade.price}`;
              }
            }
          }
        }
      }
    });
  } catch (err) {
    console.error('Error loading trade chart:', err);
  }
}


async function loadTradeHistoryTable() {
  try {
    const res = await fetch('http://localhost:3000/api/btc/trade/history');
    const data = await res.json();
    const tbody = document.querySelector('#tradeHistoryTable tbody');
    tbody.innerHTML = '';

    data.forEach(trade => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="color: ${trade.type === 'BUY' ? 'green' : 'red'}">${trade.type}</td>
        <td>${parseFloat(trade.amount).toFixed(6)}</td>
        <td>₹${parseFloat(trade.price).toFixed(2)}</td>
        <td>${new Date(trade.timestamp).toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading trade table:', err);
  }
}



document.addEventListener('DOMContentLoaded', () => {
  loadTradeHistoryChart();
  loadTradeHistoryTable();
});

