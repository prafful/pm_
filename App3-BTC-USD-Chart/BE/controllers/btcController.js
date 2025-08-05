// BE/controllers/btcController.js
const BTCModel = require('../models/btcModel');

const btcController = (req, res) =>{
    BTCModel.getBTCPriceData((err, results) => {
      if (err) {
        console.error("❌ Controller error:", err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  }


module.exports = btcController;
