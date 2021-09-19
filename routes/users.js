/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

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
    }
  });

  router.get('/register', (req, res) => {
    const templateVars = {};
    res.render('register', templateVars);
  });

  router.post('/register', (req, res) => {
    if (req.body.email.length === 0 || req.body.password.length === 0 || req.body.username.length === 0){
      res.status(400);
      res.send('Incomplete information');
      // res.render("register", templateVars);
    }
    // #TODO: CHECK IF EMAIL IS NOT ALREADY REGISTERED
    else if(false){
      res.status(403);
      res.send('That email is taken');
    }
    else{
      // #TODO: SET SESSION AND LOGIN
        console.log("Data received");
        console.log(`Email: ${req.body.email} | Username: ${req.body.username} | Password: ${req.body.password}`);
    }
  });


  return router;
};
