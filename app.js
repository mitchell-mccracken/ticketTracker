const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const sessionsController = require('./controllers/session.js');
const trackersController = require('./controllers/trackers.js');
const gamesController = require('./controllers/games');
require('dotenv').config();

const port = process.env.PORT || 3000;
let mongoDB = `mongodb://localhost:27017/ticketapp`
mongoDB = process.env.URI_REMOTE
// console.log(remoteDB)

app.use(cors())
app.use( session({ secret:"something", resave: false, saveUninitialized: false, cookie:{secure:true} }));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

// Connect to Mongo
mongoose.connect(mongoDB , 
// mongoose.connect(remoteDB , 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        // useFindAndModify: false  //I've used this in other apps but for some reason it was throwing a "not supported error"
    }
)
mongoose.connection.once('open', () => {
    console.log('connected to Mongo at ', mongoDB)
})

////////////////
// MIDDLEWARE //
////////////////
app.use(express.json())     //this is needed to send the body of the request properly



/////////////////
// CONTROLLERS //
/////////////////
const usersController = require('./controllers/users')
app.use('/users', usersController)
app.use('/sessions' , sessionsController);
app.use('/trackers', trackersController);
app.use('/games', gamesController);



app.get('/' , (req , res) => {
  console.log('--- going home ---')
    // res.send('Hello World!')
    const currentUser = req.cookies.ticketUserName;
    console.log(req.cookies.ticketUserName)
    console.log(currentUser)
    // res.render('../views/home', {currentUser})
    res.render('../views/userHome', {currentUser})
})

app.listen(port, () => {
    console.log('Listening on port ' , port)
})