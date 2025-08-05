const db = require('../db/db');

const btcModel = {


  getBTCPriceDataByInterval(intervalMinutes, callback) {
    const sql = `
      SELECT
        FROM_UNIXTIME(UNIX_TIMESTAMP(timestamp) - MOD(UNIX_TIMESTAMP(timestamp), ? * 60)) AS time_group,
        AVG(price) AS price
      FROM btc_prices
      GROUP BY time_group
      ORDER BY time_group ASC
    `;
    db.query(sql, [intervalMinutes], callback);
  }
};

module.exports = btcModel;
