const express = require('express');
const router = express.Router();
const controller = require('../controllers/tradeController');

router.post('/buy', controller.buyBTC);
router.post('/sell', controller.sellBTC);
router.get('/wallet', controller.getWallet);
router.get('/history', controller.getHistory);

module.exports = router;
