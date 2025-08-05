// models/marketModel.js
const db = require('../db/db');

exports.getAllMarkets = (callback) => {
    const sql = 'SELECT * FROM market_timings';
    db.query(sql, callback);
};
