// routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/market/status', marketController.getMarkets);

module.exports = router;
