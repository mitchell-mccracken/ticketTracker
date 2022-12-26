const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {type:String, required: true},
    lastName: {type:String, required: false},
    userName: {type:String, required: true, unique: true},
    email: {type: String, unique: false, required: false},    //use front end validation for this
    cell: {type:String, unique: false, required: false},      //use front end validation for this
    userPassword: {type:String, required: false},
},
{
    timestamps: true
})

const User = mongoose.model('User' , userSchema)
module.exports = User