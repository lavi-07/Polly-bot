// 📁 models/notes.js
const mongoose = require("mongoose");
const Notes =require('./notes');

const userSchema =new mongoose.Schema(
  {
      id:Number,
      year:Number,
      content:[Notes]
  }
)
const User = mongoose.model('User', userSchema,"Details");
module.exports=User
