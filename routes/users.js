var db = require('../inc/bd');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM tb_users ORDER BY name', function(err,results) {
    if(err){
      res.send(err);
    }else{

      res.send(results);

    }
  })
});

module.exports = router;
