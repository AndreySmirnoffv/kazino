import { pool } from "./connect.js";

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        chatId BIGINT,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        username VARCHAR(255),
        ref VARCHAR(255),
        origin VARCHAR(255),
        balance BIGINT,
        isAdmin BOOLEAN,
        rank VARCHAR(255),
        hourly_profit BIGINT
);
`

const createInventoryTable = `
    CREATE TABLE IF NOT EXISTS inventory (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        category VARCHAR(255),
        userId BIGINT,
        cardId BIGINT,
        cardName VARCHAR(255),
        cardAttributes JSON,
        FOREIGN KEY (userId) REFERENCES users(id)
);
`

const cards = `
CREATE TABLE cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    friends_required INT,
    price DECIMAL(10, 2) NOT NULL,
    profit_per_hour INT,
    purchase_limit INT,
    rank VARCHAR(255) NOT NULL
);`
const executeQuery = (query, message) => {
    pool.query(query, error => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            return console.info(message);
        }
    });
};


executeQuery(createUserTable, "Таблица пользователей создана");
executeQuery(createInventoryTable, "Таблица инвенторя создана");
executeQuery(cards, "Таблица инвенторя создана");

