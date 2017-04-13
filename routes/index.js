var express = require('express');
var router = express.Router();

const config = require('../config');
const rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (! req.session.apiKey )
      res.redirect('/login');

  const options = {
    method : 'GET',
    uri: config.api + '/tickets',
    qs  : { id : req.session.userId } ,
    json : true
  };

  rp(options).then(result=>{
      console.log(result);
    res.render('index', { tickets: result , username : req.session.username });
  }).catch(err=>{
    res.render('error', {err} );
  });

});

module.exports = router;
