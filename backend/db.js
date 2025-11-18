const mysql = require('mysql2');

// Create a connection pool to MySQL database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',     // XAMPP default username
    password: '',     // XAMPP default password (empty)
    database: 'dynasty_inventory',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool queries into promises to use async/await
const promisePool = pool.promise();

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to MySQL database!');
    connection.release();
});

module.exports = promisePool;
