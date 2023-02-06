var express = require('express');
var router = express.Router();
const ROLES = require('../config/roles')

//get the list of contest web page
router.get('/', function(req, res) {
  res.send('list of contests')
});

//get the create a contest web page
router.get('/create', (req, res) => {
  res.send('create contest page')
})

function checkAuthenticatedAdmin(req, res, next){
  if(req.isAuthenticated() && req.user.role === ROLES.ADMIN){
    return next()
  }
  res.redirect(req.baseUrl + '/login')
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/')
  }
  next()
}

module.exports = router;
