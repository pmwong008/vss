const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Testing route is working with CORS-enabled!' });
});

router.get('/resource', function(req, res, next) {
    res.send('respond with a resource');
  });
  
 router.get('/add', function(req, res, next) {
    res.render ('index', { title: 'Add User' }); // render the index.ejs file in views folder
  });
  
  /*  .get('/delete', function(req,res,next) { // testing in class
    res.send ('this is to handle /user/delete'); // testing in class
  }).get('/goodbye', function(req,res,next) {
    res.send ('Goodbye! and Have a Great Day!'); // simply return a string to front end
  }).get('/food', function(req,res,next) {
    res.json({monday:"bread", tuesday:"sandwich"}); // return an object to front end
  }).get('/testPara', function(req, res, next) {
    //for (let p in req.query) console.log(p + " is " + req.query[p]); 
    for (let p in req.query) console.log(p + " is ", req.query[p]); // walk through unknown number of query objects
    res.send("done!!! All query now returned as String and can be seen at the background - Multiple queries with the same para are stored in an array.");
  }).post('/testForm', function(req, res, next) {
    // steps herein can be blocks of code, include but not limited to if/else statements.
    // res.send("username: " + req.body.username + ", password: " + req.body.password + ", age: " + req.body.age + ", district: " + req.body.district);
    let info = "";
    for (let q in req.body)  info += q + " ---> " + req.body[q] + "; ";
    res.send(info);  // res.send can be used ONLY once! for each api. Don't put it inside a loop.
  }).get('/testMultiplePara/:caseA/:case1/:b', function(req, res, next) { // in Chrome browser type localhost:3000/users/testMultiplePara/123/234
    console.log("caseA: ", req.params.caseA, "case1: ", req.params.case1, "b: ", req.params.b);
    res.send("done!!!"); // expect the number of parameters as stated in the .get function, and the syntax ':parameter/'
  }); */

module.exports = router;