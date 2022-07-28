const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_type: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);