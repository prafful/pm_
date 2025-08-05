// fetchBtcToDb.js
const axios = require('axios');
const db = require('./db/db'); // assumes db.js is in the same directory

async function fetchAndSaveBTC() {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );

    const price = response.data.bitcoin.usd;
    db.query('INSERT INTO btc_prices (price) VALUES (?)', [price], (err) => {
      if (err) {
        console.error("❌ DB Insert Error:", err.message);
      } else {
        console.log(`✅ Saved BTC Price: $${price} at ${new Date().toLocaleTimeString()}`);
      }
    });
  } catch (err) {
    console.error("❌ API Fetch Error:", err.message);
  }
}

setInterval(fetchAndSaveBTC, 10000); // every 10 seconds