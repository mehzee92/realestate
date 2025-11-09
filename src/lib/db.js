import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost', // Replace with your DB host
  user: 'root',      // Replace with your DB user
  password: '',  // Replace with your DB password
  database: 'village_properties', // Replace with your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
