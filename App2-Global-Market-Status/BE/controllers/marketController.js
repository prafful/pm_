// controllers/marketController.js
const moment = require('moment-timezone');
const Market = require('../models/marketModel');

// Helper to convert local time to IST
const convertToIST = (timeStr, tz) => {
    return moment.tz(timeStr, 'HH:mm:ss', tz).tz('Asia/Kolkata').format('HH:mm:ss');
};

// Helper to check if market is open in IST
const isMarketOpen = (openIST, closeIST) => {
    const now = moment.tz('Asia/Kolkata').format('HH:mm:ss');
    return now >= openIST && now <= closeIST;
};

exports.getMarkets = (req, res) => {
    Market.getAllMarkets((err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        const markets = results.map(m => {
            const openIST = convertToIST(m.open_time, m.timezone);
            const closeIST = convertToIST(m.close_time, m.timezone);
            return {
                market_name: m.market_name,
                country: m.country,
                timezone: m.timezone,
                open_time_IST: openIST,
                close_time_IST: closeIST,
                is_open_now: isMarketOpen(openIST, closeIST)
            };
        });

        res.json(markets);
    });
};
