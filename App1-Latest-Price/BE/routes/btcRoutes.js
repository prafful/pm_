const express = require('express');
const router = express.Router();
const btcController = require('../controllers/btcController');

router.get('/latest', btcController.getLatestPrice);

module.exports = router;
