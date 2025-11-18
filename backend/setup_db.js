const mysql = require('mysql2');
const fs = require('fs');

// Create a connection without specifying database to create it
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

// Read the SQL file
const sql = fs.readFileSync('setup.sql', 'utf8');

// Split the SQL into individual statements
const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

// Execute each statement sequentially
let index = 0;
const executeNext = () => {
    if (index >= statements.length) {
        console.log('Database setup completed successfully!');
        connection.end();
        return;
    }

    const statement = statements[index].trim() + ';';
    console.log(`Executing: ${statement}`);
    connection.query(statement, (err, results) => {
        if (err) {
            console.error('Error executing SQL:', err);
            connection.end();
            return;
        }
        index++;
        executeNext();
    });
};

executeNext();
