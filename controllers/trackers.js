const express = require('express');
const trackers = express.Router();
const Tracker = require('../models/trackers');
const {MongoClient} = require('mongodb');
// const { send } = require('express/lib/response');


const app = express();

let uri = "mongodb://localhost:27017/ticketapp"; 

////////////////
//---Routes---//
////////////////
trackers.get('/', test)
trackers.post('/', createTracker)
trackers.get('/gametickets' , getGameTickets)
trackers.delete('/delete/:id' , deleteTracker)
trackers.post('/getUserTrackers', getUserTrackers)



///////////////////
//---Functions---//
///////////////////

async function test(req, res){
    res.send('this is a test')
}

async function deleteTracker(req, res) {
    try{
        let deletedTracker = await Tracker.deleteOne({_id:req.params.id})
        console.log(deletedTracker);
        res.send(deletedTracker)
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    };
};

async function createTracker(req, res){
    // res.send('this post request worked')
    try{
      console.log(req.body)

      //bandaid for now
      if ( !req.body.foundTickets ) {
        req.body.foundTickets = {};
      }

      // let newTracker = new Tracker(req.body)



        let createdTracker = await Tracker.create(req.body);
        console.log(createdTracker);
        res.send(createdTracker)     //this was giving me a front end error, I kept this here for notes but I would have to change the FE response type to 'text' to make it work, maybe I shouldn't be sending a response with a post request???
        // res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    };
};

async function getGameTickets(req, res) {
    try{
        const client = new MongoClient(uri);
        await client.connect()
        let filteredTickets = await client.db('ticketapp').collection('trackers').find({}).toArray();
        client.close()
        res.send({filteredTickets});
    } catch (error) {
        console.log(error);
    };
};


async function getUserTrackers( req, res ) {
  try {
    console.log('------------------ getUserGames ---------------');
    // console.log(req.body)
    const { user } = req.body;

    const trackers = await Tracker.find({ userName: user }).lean().exec();

    const userTrackedGames = [];
    const now = new Date();
    trackers.forEach( t => {
      const date = new Date(t.utcDate);
      if ( date > now ) userTrackedGames.push(t);
    } );
    // console.log(userTrackedGames)

    res.send(userTrackedGames)

  } catch (error) {
    console.log(error);
    return 'error occured';
  }
}

 
module.exports = trackers;