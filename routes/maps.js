const express = require("express");
//const { getAllPinsFromDb } = require("../database");
const { getMapById, getUserMaps, getAllMaps, getCoordinates, createNewMap, updateMap, deleteMap } = require("./helpers");
const router = express.Router();

// how can i use getAllPinsFromDb from the database.js inside router.get

module.exports = (db, cookieSession) => {
  router.get("/", (req, res) => {
    // const pinsData = getAllPinsFromDb().then((result) => {
    //   console.log(result[0]);
    //   return result[0];
    // });
    console.log(req.session);
    const templateVars = {};
    if (!req.session) {
      templateVars.user = null;
      templateVars.id = null;
    } else {
      templateVars.user = req.session.username;
      templateVars.id = req.session.user_id;
    }
    getAllMaps(db)
      .then(allMaps => {
        templateVars.allMaps = allMaps;
        templateVars.mapName = null;
        console.log(templateVars);
        res.render('maps_index', templateVars);
      });
  });

  // GET /maps/user/:userID to get all maps from a specific user
  router.get('/user/:userID', (req, res)=> {
    //#TODO: Remove debug comments later
    // console.log(`The user visiting this website is ${req.params.userID}`);
    // console.log('Checking session:');
    // console.log(req.session.user_id);
    getUserMaps(db, req.params.userID)
    .then(userMaps => {
      const templateVars = {};
      templateVars.userMaps = userMaps;
      templateVars.mapOwnerID = req.params.userID; //The owner of the requested maps might not match the logged in user
      templateVars.userID = req.session.userID;
      templateVars.email = req.session.email;
      templateVars.username = req.session.username;
      templateVars.isMapOwner = false;
      if(Number(templateVars.mapOwnerID) == templateVars.userID){
        templateVars.isMapOwner = true;
      }
      console.log(templateVars);
      res.render('userMaps', templateVars);
    })
  });
  // GET /maps/:id to view specific map based on map's id.
  router.get("/:id", (req, res) => {
    const mapID = req.params.id;
    const templateVars = {};
    if (!mapID) {
      res.statusCode = 404;
      if (!req.session.user_id) {
        templateVars.user = null;
        templateVars.id = null;
        templateVars.mapName = null;
      } else {
        templateVars.user = req.session.username;
        templateVars.id = req.session.user_id;
        templateVars.mapName = null;
      }
      res.render('404', templateVars);
    }
    const requestedMapId = mapID;
    getMapById(db, requestedMapId)
      .then(requestedMap => {
        templateVars.requestedMap = requestedMap;
        if (!req.session) {
          templateVars.user = null;
          templateVars.id = null;
        } else {
          templateVars.user = req.session.username;
          templateVars.id = req.session.user_id;
        }
        templateVars.mapName = requestedMap.title;
        res.render('maps_show', templateVars);
      })
      .catch((err) => {
        res.statusCode = 404;
        templateVars.mapName = null;
        res.render('404', templateVars);
      });
  });

  // Add a new map to db only if logged in, then redirect to new map.
  router.post("/", (req, res) => {
    const templateVars = {};
    if (!req.session.user_id) {
      templateVars.user = null;
      templateVars.id = null;
      templateVars.mapName = null;
      res.statusCode = 401;
      res.render('401', templateVars);
    } else {
      templateVars.user = req.session.username;
      templateVars.id = req.session.user_id;
      const values = req.body;
      const { title, country, city } = values;
      getCoordinates(country, city)
        .then(coordinates => {
          const parsedCoords = JSON.parse(coordinates);
          const resultsArray = parsedCoords.results[0];
          const resultsCoords = resultsArray.locations[0];
          const latitude = resultsCoords.latLng.lat;
          const longitude = resultsCoords.latLng.lng;
          const user_id = req.session.user_id;
          const map = {
            title,
            country,
            city,
            latitude,
            longitude,
            created_at: new Date(),
            user_id
          };
          createNewMap(db, map)
            .then(newMap => {
              res.redirect(`/maps/${newMap.id}`);
            })
            .catch((err) => {
              console.log("query error", err.stack);
              res.statusCode = 400;
              templateVars.mapName = null;
              templateVars.message = "Oops, something went wrong.";
              res.render('400', templateVars);
            });
        });
    }
  });


  return router;
}
