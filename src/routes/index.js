var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    if(req.session.user){
      console.log(req.session.user)
      res.render('userPage', { userName: req.session.user.name, rank: req.session.user.rank } )
    }
    else{
      res.render('index');
    }
  }
  catch (error) {
    console.log(error)
  }
  
});

module.exports = router;
