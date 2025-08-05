// BE/db.js
const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',        // or your DB host
  user: 'root',             // replace with your DB username
  password: '',// replace with your DB password
  database: 'crypto' // replace with your DB name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL as ID:', connection.threadId);
});

// Export the connection
module.exports = connection;
