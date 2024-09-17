import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { pool } from '../assets/db/connect.js';

dotenv.config({ path: "../modules/.env" });

const PORT = process.env.PORT || 8000;

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.locals.msg = '';

app.post("/", (req, res) => {
    app.locals.msg = req.body;
    res.status(200).json({ message: app.locals.msg });
});

app.get("/", (_, res) => {
    res.status(200).json({ message: app.locals.msg });
});

app.get('/user', (_, res) => {
    const query = `SELECT (username, balance) WHERE username = ?`

    pool.query(query, [app.locals.msg.from.username], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const username = results[0].username
        const balance = results[0].balance;

        res.status(200).json({ username, balance })
    })
})

app.post("/updaterank", async req => {
    const { rank } = req.body;
    const query = `UPDATE users SET rank = ? WHERE id = ?`

    pool.query(query, [rank, app.locals.msg.from.id])
});

app.post("/updatebalance", async (req, res) => {
    const { balance } = req.body;
    if (!app.locals.msg || !app.locals.msg.from || !app.locals.msg.from.id) {
        return res.status(400).json({ error: "User ID is not available" });
    }
    const query = `UPDATE users SET balance = ? WHERE id = ?`;
    pool.query(query, [balance, app.locals.msg.from.id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ message: "Balance updated successfully" });
    });
});

app.listen(PORT, () => console.log(`Server is running on port http://127.0.0.1:${PORT}`));
