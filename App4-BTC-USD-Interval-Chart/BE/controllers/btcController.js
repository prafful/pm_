const BTCModel = require('../models/btcModel');

const btcControllerInterval = (req, res)=> {
    
    const interval = parseInt(req.params.minutes);
    if (isNaN(interval) || interval < 1) {
      return res.status(400).json({ error: 'Invalid interval' });
    }

    BTCModel.getBTCPriceDataByInterval(interval, (err, results) => {
      if (err) {
        console.error(`❌ Error fetching ${interval}-min BTC data:`, err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  }


module.exports = btcControllerInterval;
