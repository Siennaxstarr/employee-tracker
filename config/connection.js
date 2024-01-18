// Import the mysql2 package
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',  
  user: 'root',      
  password: 'password', 
  database: 'employee_db', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool to be used in other modules
module.exports = pool.promise();
