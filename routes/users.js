/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getUserByUsername, getUserByEmail, addUser, getUserById, getUserMaps, getUserFaves, getUserPins} = require('./helpers');


module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get('/test', (req, res) => {
    console.log('Welcome to the test page');
  });

  router.get('/login', (req, res) => {
    const templateVars = {};
    res.render('login', templateVars);
  });

  router.post('/login', (req, res) => {
    if (req.body.email.length === 0 || req.body.password.length === 0){
      res.status(400);
      res.send('Incomplete information');
      // res.render("register", templateVars);
    }
    // #TODO: CHECK IF EMAIL IS REGISTERED
    else if(false){
      res.status(403);
      res.send('There is no account associated with that email');
    } else if (false){
      // #TODO: CHECK IF PASSWORD IS VALID
      res.status(403);
      res.send('Invalid password');
    }
    else{
      // #TODO: SET SESSION AND LOGIN
        console.log("Data received");
        console.log(`${req.body.email} : ${req.body.password}`);
        //Get user id and pass it to users/maps/:userId
        getUserByEmail(db, req.body.email)
          .then(existingUser => {
            if (existingUser) {
              console.log('User ID found: ' + existingUser.id);
              req.session.userID = existingUser.id;
              req.session.email = existingUser.email;
              req.session.username = existingUser.username; 
              res.redirect(`/maps/user/${existingUser.id}`);
            } else {
              console.log('User is not registered');
              res.redirect('/users/login');
            }
          });
    }
  });

  // GET /register if no user is logged in. If user is logged in, redirect to /maps.
  router.get('/register', (req, res) => {
    const userID = req.session && req.session.user_id;
    if (!userID) {
      res.render('register');
    } else {
      res.redirect('/maps');
    }
  });

  // POST to /register only if new user with valid username, email and password. Checks if username and email have previously been registered via helper functions getUserByUsername and getUserByEmail in helpers.js file. If registration successful, adds new user to database via helper function addUser in helpers.js file and redirects to /maps (for now, can be changed to redirect to user's profile or create new map, etc. later.)
  router.post('/register', (req, res) => {
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    };
    const templateVars = {};
    if (user.username === '' || user.email === '' || user.password === '') {
      res.statusCode = 400;
      templateVars.message = 'Oops, you left the username, email and/or password field(s) blank. Please try again.';
      res.render('400', templateVars);
    } else {
      getUserByUsername(db, user.username)
      .then(existingUser => {
        if (existingUser) {
          res.statusCode = 400;
          templateVars.message = 'Sorry, that username is already registered.';
          res.render('400', templateVars)
        } else {
          getUserByEmail(db, user.email)
          .then(existingUser => {
            if (existingUser) {
              res.statusCode = 400;
              templateVars.message = 'Sorry, that email is already registered.';
              res.render('400', templateVars);
            } else {
              addUser(db, user);
              res.redirect('/maps');
            }
          });
        }
      });
    }
  });

  router.get('/profile/:id', (req, res) => {
    const currentUser = req.session.user_id;
    const requestedUserId = req.params.id;
    const templateVars = {};
    getUserById(db, requestedUserId)
      .then(user => {
        templateVars.ownerIsLoggedIn = currentUser === user.id;
        templateVars.username = user.username;
        getUserFaves(db, requestedUserId)
          .then(userFaves => {
            templateVars.userFaves = userFaves;
            getUserMaps(db, requestedUserId)
              .then(userMaps => {
                templateVars.userMaps = userMaps;
                getUserPins(db, requestedUserId)
                  .then(userPins => {
                    templateVars.userPins = userPins;
                    if (!req.session.user_id) {
                      templateVars.user = null;
                      templateVars.id = null;
                      templateVars.mapName = null;
                    } else {
                      templateVars.user = req.session.username;
                      templateVars.userID = req.session.user_id;
                      templateVars.mapName = null;
                    }
                    res.render('profiles_show', templateVars);
                  });
              });
          });

      });
  });

  return router;
};
