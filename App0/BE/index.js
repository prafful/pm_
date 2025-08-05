const axios = require('axios');

var url = 'https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=demo';

//var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo';

async function getNSEData() {
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'request'
    }
  });
  console.log(res.data)
}


getNSEData();

// let i =1
// setInterval(() => {
//   console.log(`${i++} load data...`);
//     getNSEData()
// }, 2000);
