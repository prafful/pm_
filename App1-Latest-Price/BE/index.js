const express = require('express');
const cors = require('cors');
const app = express();

const btcRoutes = require('./routes/btcRoutes');
app.use(cors());
app.use(express.json());

app.use('/api/btc', btcRoutes);

app.listen(8000, () => {
  console.log('✅ Server running on http://localhost:8000');
});
