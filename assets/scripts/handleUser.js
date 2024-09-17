import { pool } from "../db/connect.js"

export function addUser(id, chatId, firstName, lastname, username, ref, from, balance, rank, isAdmin, callback) {
    const query = `INSERT INTO users (id, chatId, firstName, lastName, username, origin, ref , balance, isAdmin, rank) VALUES (?,?,?,?,?,?,?,?,?,?)`

    pool.query(query, [id, chatId, firstName, lastname, username, from, ref, balance, isAdmin, rank], error => {
        if (error) {
            console.error("Error adding user:", error);
            return callback(error);
        }
        callback(null);
        console.info("User added successfully");
    });
}

export function checkUserExists(id, callback) {
    pool.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error("Error checking user:", error);
            return callback(error, null);
        }
        callback(null, results.length > 0);
    });
}

export async function checkAdmin(bot, chatId, id) {
    const query = 'SELECT isAdmin, username FROM users WHERE id = ?';

    pool.query(query, [id], async (error, results) => {
        try {
            if (error) {
                console.error("Error fetching user data:", error);
                return;
            }

            if (results.length === 0) {
                console.info("User not found in the database.");
                return await bot.sendMessage(chatId, `🌟 Добро пожаловать в E-Vito! 🌟\n\nМы рады приветствовать вас в нашем сервисе...`, startKeyboard);
            }

            const user = results[0];

            if (user.isAdmin === true) {
                console.info("Администратор");
                await bot.sendMessage(chatId, `Приветствую ${user.username}! Вы админ и вот что можете сделать`, adminKeyboard);
            } else {
                console.info("Обычный пользователь");
            }
        } catch (error) {
            console.error("Error in checkAdmin function:", error);
        }
    });
}