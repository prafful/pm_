const btcModel = require('../models/btcModel');

async function getLatestPrice(req, res) {
  try {
    const latest = await btcModel.fetchLatestPrice();
    res.json(latest);
  } catch (err) {
    console.error('❌ Error fetching latest BTC price:', err.message);
    res.status(500).json({ error: 'Failed to fetch latest price' });
  }
}

module.exports = {
  getLatestPrice
};
