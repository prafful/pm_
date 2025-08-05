// BE/server.js
const express = require('express');
const cors = require('cors');
const btcRoutes = require('./routes/btc');

const app = express();
const PORT = 8002;

app.use(cors());
app.use('/api/btc', btcRoutes); // base route for BTC

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
