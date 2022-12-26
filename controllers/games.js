const express = require('express');
const games = express.Router();
const Game = require('../models/game');




////////////////
//---Routes---//
////////////////

games.get('/', getGames);






///////////////////////
// --- FUNCTIONS --- //
///////////////////////

async function getGames(req, res) {
  console.log('getting games')
  try {
    const now = new Date();
    // const now = new Date('12/1/2022')
    console.log(now)
    console.log('------------------  ---------------');


    // bc fields are string in db, bc I saved it bad... could fix
    const query = {
      $expr: {
        $gt: [ {$dateFromString: { 'dateString': '$utcDate'}}, now ]
      }
    }

    // const query = {};

    const games = await Game.find(query)
      .lean()
      .exec();

    // games.forEach( x => console.log(new Date(x.utcDate)))

    res.send({games})
    // return games;

  } 
  catch (error) {
    console.log(error);
    return 'error occured'
  }

}




module.exports = games;