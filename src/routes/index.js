var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    console.log(req.session.user)
    res.render('chatroom', { userName: req.session.user.name, rank: req.session.user.rank } )
  }
  else{
    res.render('index');
  }
  
});

module.exports = router;
