const express = require('express');
const axios = require('axios');
const db = require('../db');

const router = express.Router();

// // Fetch from CoinGecko and save to DB
// router.get('/fetch', async (req, res) => {
//   try {
//     const response = await axios.get(
//       'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
//     );
//     const price = response.data.bitcoin.usd;

//     db.query('INSERT INTO btc_prices (price) VALUES (?)', [price], (err) => {
//       if (err) throw err;
//       res.json({ message: 'Inserted', price });
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch BTC price' });
//   }
// });

// Fetch last 20 records for chart
// router.get('/data', (req, res) => {
//   db.query(
//     'SELECT price, timestamp FROM btc_prices ORDER BY timestamp DESC',
//     (err, results) => {
//       if (err) throw err;
//       // reverse to make it ascending
//       res.json(results.reverse());
//     }
//   );
// });


router.get('/data', (req, res) => {
  const interval = parseInt(req.query.interval) || 1;

  // If interval is 1 (or missing), return raw data
  if (interval === 1) {
    const sql = `
      SELECT price, timestamp
      FROM btc_prices
      ORDER BY timestamp ASC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Error fetching raw data:", err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });

  } else if ([5, 15, 60].includes(interval)) {
    const sql = `
      SELECT 
        FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(timestamp) / (${interval} * 60)) * (${interval} * 60)) AS time_group,
        AVG(price) AS price
      FROM btc_prices
      GROUP BY time_group
      ORDER BY time_group ASC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Error fetching interval data:", err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });

  } else {
    return res.status(400).json({ error: 'Invalid interval. Use 1, 5, 15, or 60.' });
  }
});



// Get the latest BTC price
router.get('/latest', (req, res) => {
  const query = `
    SELECT price, timestamp 
    FROM btc_prices 
    ORDER BY timestamp DESC 
    LIMIT 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching latest BTC price:", err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No price data available' });
    }

    res.json(results[0]); // return { price, timestamp }
  });
});


router.post('/trade/buy', async (req, res) => {
  const { usd_amount } = req.body;
  if (!usd_amount || usd_amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const [priceRes] = await db.promise().query('SELECT price FROM btc_prices ORDER BY timestamp DESC LIMIT 1');
    const price = priceRes[0].price;
    const btcAmount = usd_amount / price;

    const [walletRes] = await db.promise().query('SELECT * FROM wallet WHERE id = 1');
    const wallet = walletRes[0];

    if (wallet.usd_balance < usd_amount) {
      return res.status(400).json({ error: 'Insufficient USD balance' });
    }

    await db.promise().query('UPDATE wallet SET usd_balance = usd_balance - ?, btc_balance = btc_balance + ? WHERE id = 1', [usd_amount, btcAmount]);
    await db.promise().query('INSERT INTO trades (type, price, amount) VALUES (?, ?, ?)', ['BUY', price, btcAmount]);

    res.json({ message: 'Buy successful', btcAmount, price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Buy failed' });
  }
});


router.post('/trade/sell', async (req, res) => {
  const { btc_amount } = req.body;
  if (!btc_amount || btc_amount <= 0) return res.status(400).json({ error: 'Invalid BTC amount' });

  try {
    const [priceRes] = await db.promise().query('SELECT price FROM btc_prices ORDER BY timestamp DESC LIMIT 1');
    const price = priceRes[0].price;
    const usdAmount = btc_amount * price;

    const [walletRes] = await db.promise().query('SELECT * FROM wallet WHERE id = 1');
    const wallet = walletRes[0];

    if (wallet.btc_balance < btc_amount) {
      return res.status(400).json({ error: 'Insufficient BTC balance' });
    }

    await db.promise().query('UPDATE wallet SET btc_balance = btc_balance - ?, usd_balance = usd_balance + ? WHERE id = 1', [btc_amount, usdAmount]);
    await db.promise().query('INSERT INTO trades (type, price, amount) VALUES (?, ?, ?)', ['SELL', price, btc_amount]);

    res.json({ message: 'Sell successful', usdAmount, price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sell failed' });
  }
});


router.get('/trade/wallet', async (req, res) => {
  const [rows] = await db.promise().query('SELECT * FROM wallet WHERE id = 1');
  res.json(rows[0]);
});


router.get('/trade/history', async (req, res) => {
  const [rows] = await db.promise().query('SELECT * FROM trades ORDER BY timestamp DESC');
  res.json(rows);
});



module.exports = router;
