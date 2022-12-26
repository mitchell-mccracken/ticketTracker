const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
    location: {type: String},
    price: {type: Number},
    numTickets: {type: Number},
    gameName: {type: String},
    gameID: {type: String},
    userName: {type: String},
    smallDate: {type: String},
    longDate: {type: String},
    utcDate: String,
    gameId: Number,
    foundTickets: {},
    lastChecked: Date
});

const Tracker = mongoose.model('Tracker', trackerSchema);
module.exports = Tracker;