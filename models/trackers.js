const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
  location: {type: String},
  price: {type: Number},
  numTickets: {type: Number},
  gameName: {type: String},
  gameID: {type: String},
  userName: {type: String},
  userEmail: {type: String},
  smallDate: {type: String},
  longDate: {type: String},
  utcDate: String,
  gameId: Number,
  foundTickets: {},
  lastChecked: Date,
  threadId: String,
});

const Tracker = mongoose.model('Tracker', trackerSchema);
module.exports = Tracker;