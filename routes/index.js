var express = require('express');
var router = express.Router();
const passport = require('passport');
const initializePassport = require('../config/passport-config');
const flash = require('express-flash')
const UserDao = require('../models/User')

//initialize passport for the index route
initializePassport(passport)
router.use(passport.initialize())
router.use(passport.session())
router.use(flash())

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  res.send(`USER: ${req.user.firstname}`)
});

router.get('/login', checkNotAuthenticated, (req, res) =>{
  res.render('login')
})

router.get('/sign-up', checkNotAuthenticated, (req, res) =>{
  res.render('sign-up')
})

router.post('/auth', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/add-user',async (req, res) =>{
  //TODO: add a validate user middle ware that will capitalize automatically the first letter for the names and other shits
  try{
    var user = {
      id: null,
      username: req.body.username,
      password: req.body.password,
      lastname: req.body.lastname,
      firstname: req.body.firstname
    }
    let isExist = await UserDao.usernameExists(user.username)
    if(!isExist){
      let id = await UserDao.addUser(user)
      if(id){
        user.id = id;
        req.login(user, (err)=>{
          if(err){
            res.send('error on logging in')
            return;
          }
          console.log('user logged in');
          return res.send(req.user.username)
          //TODO: 
        })
      }
    }else{
      //send error message where username already exists
      res.send('username already exists')
    }
  }catch(e){
    res.send(e)
  }
})

//middleware to check if user is  authenticated
//FOR: LOGIN OR SIGNUP OR ANY VISITOR PAGE ROUTE
function checkAuthenticated(req, res, next){
 if(req.isAuthenticated()){
  return next()
 }
 res.redirect('/login')
}

//middleware to check if user is not authenticated
//FOR: MUST BE AUTHENTICATED ROUTES
function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/')
  }
  next()
}




module.exports = router;
