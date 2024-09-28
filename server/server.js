// import express from 'express';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
// import cors from 'cors'
// import { pool } from '../assets/db/connect.js';


// dotenv.config({ path: "../modules/.env" });

// const PORT = process.env.PORT || 7777;

// const app = express();

// app.use(bodyParser.json());
// app.use(express.json());
// app.use(cors())

// app.post('/user', (req, res) => {
//     const {username} = req.body
//     console.log(username)
//     const query = `SELECT * FROM users WHERE username = ?`
//     pool.query(query, [username], (error, results) => {
//         if (error) {
//             console.log(error)
//             return res.status(500).json({ error: error.message });
//         }

//         const user = results[0]

//         res.status(200).json({ user })
//     })
// })

// app.post("/updaterank", async req => {
//     const { rank, userId } = req.body;
//     const query = `UPDATE users SET rank = ? WHERE id = ?`

//     pool.query(query, [rank, userId])
// });

// app.post("/updatebalance", async (req, res) => {
//     const { balance, userId } = req.body;

//     const query = `UPDATE users SET balance = ? WHERE id = ?`;
//     pool.query(query, [balance, userId], error => {
//         if (error) {
//             return res.status(500).json({ error: error.message });
//         }
//         res.status(200).json({ message: "Balance updated successfully" });
//     });
// });

// app.get('/top', (_, res) => {
//     const query = `SELECT id, username, hourly_profit FROM users ORDER BY hourly_profit DESC LIMIT 100`
//     const rows = pool.query(query)

//     res.status(200).json({rows})
// })


// app.post("/addInventory", async (req, res) => {
//     const { cardName, cardAttributes } = req.body;

//     if ( !cardName || !cardAttributes) {
//         return res.status(400).json({ error: "Все поля обязательны" });
//     }

//     const query = `INSERT INTO inventory (userId, cardName, cardAttributes) VALUES (?, ?, ?)`;
//     pool.query(query, [app.locals.msg.from.id, cardName, JSON.stringify(cardAttributes)], (error) => {
//         if (error) {
//             return res.status(500).json({ error: error.message });
//         }
//         res.status(201).json({ message: "Запись добавлена в инвентарь" });
//     });
// });

// app.get('/getcards', async (_, res) => {
//     const query = `SELECT * FROM cards`;

//     pool.query(query, (error, results) => {
//         if (error) {
//             console.error('Ошибка при выполнении запроса:', error);
//             return res.status(500).json({ error: 'Ошибка базы данных' });
//         }
//         res.json(results);
//     });
// });

// app.listen(PORT, () => console.log(`Server is running on port http://127.0.0.1:${PORT}`));

import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

const BOT_TOKEN = 'ваш_токен_бота';

app.post('/webapp-closed', (req, res) => {
  const { initData } = req.body;

  if (verifyInitData(initData)) {
    console.log('WebApp закрыт');    res.json({ status: 'success' });
  } else {    res.status(403).json({ status: 'error', message: 'Неверные данные' });
  }});

  function verifyInitData(initData) {  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const [hash, ...params] = initData.split('&').sort();  const checkString = params.join('\n');
  const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');  return hmac === hash;
}
app.listen(3000, () => {  console.log('Сервер запущен на порту 3000');
});