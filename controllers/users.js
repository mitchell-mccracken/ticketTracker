const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router();
const cors = require('cors')
const User = require('../models/users');
const Game = require('../models/game');
// const res = require('express/lib/response')
const { Router } = require('express')
const {MongoClient} = require('mongodb')
const cookieParser = require('cookie-parser')
const res = require('express/lib/response')
const app = express()
const axios = require('axios')
const fetch = require("node-fetch");



app.use(cookieParser());
const uri = process.env.uri;
// let uri = "mongodb://localhost:27017/ticketapp"; 


////////////////
//---Routes---//
////////////////
users.get('/', getAllUsers)
users.get('/games', getAllGames);
users.post('/session' , createSession)
users.get('/session', createCookie)

users.get('/createUser', newUserPage );
users.post('/', createUser)
users.get('/login', userLoginPage );
users.post('/login', userLogin);

users.get('/mitchRoute', mitchRoute);

async function mitchRoute(req, res){
  console.log('mitch route');
  // const client = new MongoClient(process.env.URI_REMOTE);
  // await client.connect()
  // let games = await client
  //   .db('ticketapp')
  //   .collection('pensGames')
  //   .find()
  //   .toArray();

  // console.log(games)

  const games = await Game.find().lean().exec();
  games.forEach( x => console.log(x) );





  res.send('done')
}

users.delete('/deletemany', deleteMany)
users.delete('/', deleteUser)
users.patch('/', editUser)          //depending on how the form is set up it might be better to just update all fields with a PUT method
users.get('/tickets', getGames)     //get all games
users.get('/trackedgames/:id', getUserTrackedGames);

users.get('/signin' , (req , res)=> {
    res.cookie('session_id', '1234');
    res.send(200);
    // createCookie()
})


/////////////////
//---GLOBALS---//
/////////////////
const homeGamesUrl = 'https://www.vividseats.com/hermes/api/v1/productions?performerId=684&includeIpAddress=true&radius=80450&pageSize=100';
const gameUrl = 'https://www.vividseats.com/hermes/api/v1/listings?productionId=4012402&includeIpAddress=false';


///////////////////
//---Functions---//
///////////////////
async function getAllGames( req, res ) {
  console.log('------------------  ---------------');
  const games = await fetch(gameUrl);
  console.log(games)
  console.log('------------------  ---------------');
  // console.log(games)
  // const parsed = await games.json();
  console.log('------------------  ---------------');
  // console.log(parsed)
  // request({
  //   uri: homeGamesUrl,
  //   qs: {
  //     api_key: 'not a key',
  //     query: 'none'
  //   },
  //   function(error, response, body) {
  //     if (!error && response.statusCode === 200) {
  //       console.log(body);
  //       res.json(body);
  //     } else {
  //       res.json(error);
  //     }
  //   }
  // })
  res.send(parsed)

}

// router.get('/', function(req, res, next) {
//   request({
//     uri: 'http://www.giantbomb.com/api/search',
//     qs: {
//       api_key: '123456',
//       query: 'World of Warcraft: Legion'
//     },
//     function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//         console.log(body);
//         res.json(body);
//       } else {
//         res.json(error);
//       }
//     }
//   });
// });

function newUserPage( _req, res) {
  console.log('newUserPage')
  res.render('../views/createUser');
}

function userLoginPage( _req, res ) {
  res.render('../views/userLogin');
}


//this is a temp function
async function getGames(req , res){
    try{
        // let uri = "mongodb://localhost:27017/ticketapp";
        const client = new MongoClient(uri);
        await client.connect();
        let allTickets = await client.db('ticketapp').collection('penguins_tickets').find({}).toArray();
        client.close();
        let curDate = new Date
        let newTickets = await allTickets.map(x => {
            let sd = new Date(x.localDate.substr(0,25));        //create Date object to create the smallDate value for better reading on the front end
            let rObj = {
                "id": x.id,
                "name": x.name,
                "date": x.localDate.substr(0,25),
                // "smallDate": x.localDate.substr(5,5) + '-' + x.localDate.substr(0,4) ,
                "smallDate": sd.toDateString() + ' ' +  sd.toLocaleTimeString(),
            };
            return rObj;
        });
        let futureTickets = []
        for (game of newTickets) {
            // console.log(curDate);
            // console.log(new Date(game.date));
            if (new Date(game.date) > curDate){
                futureTickets.push(game);
            };
        };
        // console.log(futureTickets[0].date);
        console.log(futureTickets[0].smallDate);
        // console.log(newTickets);
        console.log('number of games future games =' , futureTickets.length);
        // res.send(allTickets);
        res.send(futureTickets);
    } catch (error) {
        console.log(error);
        console.log('catch');
        res.sendStatus(400);
    }
}

async function getUserTrackedGames(req, res){
    try {
        const client = new MongoClient(uri);
        await client.connect()
        let userTrackedGames = await client.db('ticketapp').collection('trackers').find({userID: req.params.id}).toArray();
        console.log(req.params.id);
        client.close();
        res.send(userTrackedGames)
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    };
}

async function createCookie(){
    res.cookie('name', 'value')
    res.send(200)
}

async function getAllUsers(req , res) {
    try {
        const allUsers = await User.find({})
        res.send(allUsers)
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
}

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

async function createUser(req, res){
  console.log('------------------ this is a user route ---------------');
  console.log(req.body)
  try{
    let { firstName, lastName, email,
    userName, userPassword1, userPassword2 } = req.body;
    
    // // TODO: taken out of development purposes
    // if ( Object.values(req.body).includes('') ) {
    //   res.send('Fields cannot be empty' );
    //   return;
    // }

    if ( userPassword1 !== userPassword2 ) {
      res.send('Passwords do not match');
      return;
    }

    ePassword = bcrypt.hashSync(userPassword1, 10);
    console.log(ePassword)
    const newUser = new User({
      firstName,
      lastName,
      email,
      userName,
      userPassword: ePassword
    });

    await newUser.save();
    
    // req.body.userPassword =  await bcrypt.hashSync(req.body.userPassword, bcrypt.genSaltSync(10));
    // let createdUser = await User.create(req.body);
    // console.log(createdUser);
    res.send('User created');

    // TODO: redirect to login page
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
}

async function userLogin( req, res ) {
  try {
    const { userName } = req.body;
    const user = await User.findOne({userName})
      .lean()
      .exec();
    
    if ( !user ) {
      res.send('User not found');
      return;
    }

    const { userPassword } = user;

    const pWMatch = bcrypt.compareSync( req.body.userPassword, userPassword);
    if ( pWMatch ) {
      // login sucessful

      //create cookie for tracking who is using the site
      const exprTime = process.env.EXPR_TIME;

      const cookies = req.cookies;

      let s = 'some string' + Math.random().toFixed(6).toString();
      res.cookie('ticketAppCook', s, { maxAge: exprTime, httpOnly: false });
      res.cookie('ticketUserName', userName, { maxAge: exprTime, httpOnly: false })

      // redirect to user home page
      res.redirect('/')
      return;
    }



    // bcrypt.compareSync(req.body.userPassword1, foundUser.userPassword1)
    res.send('complete')
    
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    
  }
}

async function deleteMany(req, res){
    try{
        let deletedCount = await (await User.deleteMany({ firstName: "test"})).deletedCount;
        if (deletedCount > 0 ){
            console.log(deletedCount , " users deleted");
            res.sendStatus(200);
        } else {
            console.log('Empty query, no users deleted');
            res.sendStatus(200);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

async function deleteUser(req, res){
    try{
        let deletedUser = await User.findByIdAndDelete(req.body.userId);
        console.log(deletedUser);
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

async function editUser(req, res){
    try{
        let updatedUser = await User.findByIdAndUpdate(req.body._id, req.body.update, {new:true});
        console.log(updatedUser);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}






module.exports = users