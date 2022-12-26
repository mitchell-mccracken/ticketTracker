const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

const Game = mongoose.model('Game' , userSchema);
module.exports = Game;