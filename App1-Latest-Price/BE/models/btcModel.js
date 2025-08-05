const db = require('../db/mysql');

const fetchLatestPrice = () => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM btc_prices ORDER BY timestamp DESC LIMIT 1',
      (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      }
    );
  });
};


module.exports = {
    fetchLatestPrice
    };