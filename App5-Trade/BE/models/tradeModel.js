const db = require('../db/db');

const tradeModel = {
  getWallet(callback) {
    const sql = 'SELECT * FROM wallet WHERE id = 1';
    db.query(sql, callback);
  },

  updateWallet(usd, btc, callback) {
    const sql = 'UPDATE wallet SET usd_balance = ?, btc_balance = ? WHERE id = 1';
    db.query(sql, [usd, btc], callback);
  },

  insertTrade(type, price, amount, callback) {
    const sql = `
      INSERT INTO trades (type, price, amount, timestamp)
      VALUES (?, ?, ?, NOW())
    `;
    db.query(sql, [type, price, amount], callback);
  },

  getTradeHistory(callback) {
    const sql = 'SELECT * FROM trades ORDER BY timestamp DESC';
    db.query(sql, callback);
  },

  getTradeHistoryByDate(from, to, callback) {
    const sql = `
      SELECT * FROM trades
      WHERE timestamp BETWEEN ? AND ?
      ORDER BY timestamp DESC
    `;
    db.query(sql, [from, to], callback);
  }
};

module.exports = tradeModel;
