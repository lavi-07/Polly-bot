// 📁 models/notes.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: Number,
  title: String,
  url: String
});

const User = mongoose.model('User', userSchema,"Details");
module.exports = User;
