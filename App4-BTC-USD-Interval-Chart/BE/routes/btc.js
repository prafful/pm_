const express = require('express');
const router = express.Router();
const btcController = require('../controllers/btcController');
const btcControllerInterval = require('../controllers/btcController');

router.get('/data/interval/:minutes', btcControllerInterval);

module.exports = router;
