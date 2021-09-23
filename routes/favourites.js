const express = require('express');
const router  = express.Router();
const { getFavourites } = require("./helpers");

module.exports = (db) => {
  router.get('/:id', (req, res) => {
    const userID = req.session.user_id;
    const mapID = req.params.id;
    let values = [userID, mapID];
    let queryString = `
      SELECT * FROM user_favourites
      WHERE user_id = $1 AND map_id = $2 AND removed_at IS NULL`;

    db.query(queryString, values)
      .then(data => {
        if (data.rows.length === 0) {
          res.send(false);
        } else  {
          res.send(true);
        }
      })
      .catch((err) => console.log("query error", err.stack));

  });
  router.post('/:id', (req, res) => {
    const userID = req.session.user_id;
    const mapID = parseInt(req.params.id);
    getFavourites(db, userID) //Avoid adding a fav twice to the database
      .then(favs => { //Returned favs for each user
        let found = false; //found boolean.
        for(let fav of favs){
          if (fav.id == mapID){
            console.log('Oops, that fav is already on your list');
            found = true; //If a match is found, set found to TRUE
          }
        }
        if (!found){ //If NOT FOUND, then insert to database.
          let values = [userID, mapID];
          let queryString = `
            INSERT INTO user_favourites (created_at, user_id, map_id)
            VALUES (now()::date, $1, $2)`;

          db.query(queryString, values)
            .then(res => res.rows)
            .catch((err) => console.log("query error", err.stack));
          res.send();
        }
        else{
          res.send(); //If FOUND, do nothing.
          // TODO: SEND MESSSAGE OF FAV ALREADY ADDED BEFORE
        }
      });

  });
  router.post('/:id/delete', (req, res) => {
    const userID = req.session.user_id;
    const mapID = parseInt(req.params.id);
    let values = [userID, mapID];
    let queryString = `
      UPDATE user_favourites
      SET removed_at = now()::date
      WHERE user_id = $1 AND map_id = $2 AND removed_at IS NULL`;

    db.query(queryString, values)
      .then(res => res.rows)
      .catch((err) => console.log("query error", err.stack));
    res.send();
  });
  return router;
};
