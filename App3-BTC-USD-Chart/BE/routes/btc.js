// BE/routes/btc.js
const express = require('express');
const router = express.Router();
const btcController = require('../controllers/btcController');

router.get('/data', btcController);

module.exports = router;
