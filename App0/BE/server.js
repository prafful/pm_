const express = require('express');
const app = express();
const cors = require('cors');
const btcRoutes = require('./routes/btc');

app.use(cors());
app.use(express.json());
app.use('/api/btc', btcRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
