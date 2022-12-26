const bcrypt = require('bcrypt');
const express = require('express');
const sessions = express.Router();
const User = require('../models/users');



//routes
// sessions.post('/', createSession);

//functions
async function createSession(req , res){        //meant to be used during login, probably need to create some type of cookie 
    try{
        let foundUser = await User.findOne({email : req.body.userEmail});
        // console.log(req.body);
        if (foundUser === null) {                //this will catch an invalid input
            console.log('user not found');
            res.send("No user found");
        } else {
            console.log(req.body.userPassword);
            console.log(foundUser.userPassword);
            if (await bcrypt.compareSync(req.body.userPassword , foundUser.userPassword)) {
                // req.session = foundUser
                req.session.currentUser = foundUser
                console.log('session created');
                console.log(req.session.currentUser);
                console.log(req.session);
                console.log(res.cookie.value);
                let userInfo = {
                    // test:'stuff',
                    userName: req.session.currentUser.userName,
                    userID: req.session.currentUser.id
                };
                res.cookie('asdf', '12345');
                console.log(res.cookie);

                res.send(userInfo);
                // res.sendStatus(200);
            } else {
                res.send('Password does not match');
            }
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}

module.exports = sessions