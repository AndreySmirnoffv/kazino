require('dotenv').config({ path: '../modules/.env' });
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    id: Number,
    firstName: String,
    lastName: String,
    chatId: Number,
    balance: Number,
    ref: String,
    from: Number,
    isAdmin: Boolean,
    isSubscribed: Boolean
});

const User = mongoose.model('User', userSchema);



module.exports = User;
