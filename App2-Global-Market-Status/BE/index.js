const express = require('express');
const app = express();
const marketRoutes = require('./routes/marketRoutes');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/api', marketRoutes);

app.listen(8001, () => console.log('✅ Server on port 8001'));
