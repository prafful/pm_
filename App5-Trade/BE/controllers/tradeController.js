const Trade = require('../models/tradeModel');

const tradeController = {
  buyBTC(req, res) {
    const { price, amount } = req.body;
    const cost = price * amount;

    Trade.getWallet((err, results) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      const wallet = results[0];

      if (wallet.usd_balance < cost) {
        return res.status(400).json({ error: 'Insufficient USD balance' });
      }

      const newUSD = wallet.usd_balance - cost;
      const newBTC = wallet.btc_balance + amount;

      Trade.updateWallet(newUSD, newBTC, (err) => {
        if (err) return res.status(500).json({ error: 'Update failed' });

        Trade.insertTrade('BUY', price, amount, (err) => {
          if (err) return res.status(500).json({ error: 'Insert trade failed' });
          res.json({ message: 'Trade executed successfully (BUY)' });
        });
      });
    });
  },

  sellBTC(req, res) {
    const { price, amount } = req.body;
    const gain = price * amount;

    Trade.getWallet((err, results) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      const wallet = results[0];

      if (wallet.btc_balance < amount) {
        return res.status(400).json({ error: 'Insufficient BTC balance' });
      }

      const newUSD = wallet.usd_balance + gain;
      const newBTC = wallet.btc_balance - amount;

      Trade.updateWallet(newUSD, newBTC, (err) => {
        if (err) return res.status(500).json({ error: 'Update failed' });

        Trade.insertTrade('SELL', price, amount, (err) => {
          if (err) return res.status(500).json({ error: 'Insert trade failed' });
          res.json({ message: 'Trade executed successfully (SELL)' });
        });
      });
    });
  },

  getWallet(req, res) {
    Trade.getWallet((err, results) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(results[0]);
    });
  },

  getHistory(req, res) {
    const { from, to } = req.query;

    if (from && to) {
      Trade.getTradeHistoryByDate(from, to, (err, results) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json(results);
      });
    } else {
      Trade.getTradeHistory((err, results) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json(results);
      });
    }
  }
};

module.exports = tradeController;
