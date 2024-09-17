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
        rank VARCHAR(255)
);
`

const createInventoryTable = `
    CREATE TABLE IF NOT EXISTS inventory (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        userId BIGINT,
        cardId BIGINT,
        cardName VARCHAR(255),
        cardAttributes JSON,
        FOREIGN KEY (userId) REFERENCES users(id)
);

`

const executeQuery = (query, message) => {
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.info(message);
        }
    });
};


executeQuery(createUserTable, "Таблица пользователей создана");
executeQuery(createInventoryTable, "Таблица инвенторя создана");
