import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { pool } from '../assets/db/connect.js';

dotenv.config({ path: "../modules/.env" });

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(express.json());


app.get('/user', (req, res) => {
    const {username} = req.body
    const query = `SELECT * WHERE username = ?`

    pool.query(query, [username], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const user = results[0]
        

        res.status(200).json({ user })
    })
})


app.post("/updaterank", async req => {
    const { rank, userId } = req.body;
    const query = `UPDATE users SET rank = ? WHERE id = ?`

    pool.query(query, [rank, userId])
});

app.post("/updatebalance", async (req, res) => {
    const { balance, userId } = req.body;

   
    const query = `UPDATE users SET balance = ? WHERE id = ?`;
    pool.query(query, [balance, userId], error => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ message: "Balance updated successfully" });
    });
});

app.get('/top', (_, res) => {
    const query = ` SELECT id, username, hourly_profit FROM users ORDER BY hourly_profit DESC LIMIT 100`
    const rows = pool.query(query)

    res.status(200).json({rows})
})


app.post("/addInventory", async (req, res) => {
    const { cardName, cardAttributes } = req.body;

    if ( !cardName || !cardAttributes) {
        return res.status(400).json({ error: "Все поля обязательны" });
    }

    const query = `INSERT INTO inventory (userId, cardName, cardAttributes) VALUES (?, ?, ?)`;
    pool.query(query, [app.locals.msg.from.id, cardName, JSON.stringify(cardAttributes)], (error) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: "Запись добавлена в инвентарь" });
    });
});

app.get('/getcards', async (_, res) => {
    const query = `SELECT * FROM cards`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Ошибка при выполнении запроса:', error);
            return res.status(500).json({ error: 'Ошибка базы данных' });
        }
        res.json(results);
    });
});


app.listen(PORT, () => console.log(`Server is running on port http://127.0.0.1:${PORT}`));
