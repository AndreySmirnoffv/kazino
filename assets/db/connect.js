import mysql from 'mysql2'

export const pool = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "kazino",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MariaDB:', err);
        return;
    }
    console.info("Connected to MariaDB");
    connection.release();
});





