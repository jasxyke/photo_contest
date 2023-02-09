var express = require('express');
var router = express.Router();
const passport = require('passport');
const initializePassport = require('../config/passport-config');
const flash = require('express-flash')
const UserDao = require('../models/User');
const { getFeaturedPhotos } = require('../models/Entries');
const { checkAuthenticated, checkNotAuthenticated, validateSignUpForm} = require('../services/middlewares/authentication');
const { handleError } = require('../services/ErrorHandler');

//initialize passport for the index route
initializePassport(passport)
router.use(passport.initialize())
router.use(passport.session())
router.use(flash())

/* GET home page. */
router.get('/', checkAuthenticated, async function(req, res) {
  let entries = await getFeaturedPhotos()
  res.render('index', {entries: entries, signedIn: req.signedIn});
});

router.get('/login', checkNotAuthenticated, (req, res) =>{
  res.render('login')
})

router.get('/sign-up', checkNotAuthenticated, (req, res) =>{
  res.render('sign-up', {user: false})
})

router.get('/photo-entries', checkAuthenticated, (req, res)=>{
  res.render('entry', {signedIn: req.signedIn})
})

router.get('/leaderboards', checkAuthenticated, (req, res)=>{
  res.render('leaderboards', {signedIn: req.signedIn})
})

//TODO: changes this to a post request in the future, for security reasons
router.get('/logout', (req, res)=>{
  req.logout((err)=>{
    if(err){
      req.flash('logout-err', err)
      res.redirect('/')
    }
    res.redirect('/')
  });
})

router.post('/auth', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


router.post('/add-user', validateSignUpForm, async (req, res) =>{
  //TODO: add a validate user middle ware that will capitalize automatically the first letter for the names and other shits
  try{
    var user = req.userForm;
    let isExist = await UserDao.usernameExists(user.username)
    if(!isExist){
      let id = await UserDao.addUser(user)
      if(id){
        user.id = id;
        req.login(user, (err)=>{
          if(err){
            req.flash('error', 'Login error')
            res.redirect('/sign-up')
            return;
          }
          console.log('user logged in');
          return res.send(req.user.username)
          //TODO: 
        })
      }
    }else{
      //send error message where username already exists
      handleError(req, res, 'Username already exists');
    }
  }catch(e){
    handleError(req, res, e);
  }
})

module.exports = router;
