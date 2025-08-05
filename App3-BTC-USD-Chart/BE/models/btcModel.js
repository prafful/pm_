// BE/models/btcModel.js
const db = require('../db/db');

function getBTCPriceData(callback) {
  const sql = `
    SELECT price, timestamp
    FROM btc_prices
    ORDER BY timestamp ASC
  `;
  db.query(sql, callback);
}

module.exports = {
  getBTCPriceData
};
