const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const tradeRoutes = require('./routes/trade');
app.use('/api/btc/trade', tradeRoutes);

app.listen(8004, () => {
  console.log('🚀 Server running at http://localhost:8004');
});
