const validator = require('../FormValidator')

//middleware to check if user is  authenticated
//FOR: LOGIN OR SIGNUP OR ANY VISITOR PAGE ROUTE
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      req.signedIn = {
        label: 'Logout',
        path: 'logout'
      }
    }else{
      req.signedIn = {
        label: 'Login',
        path: 'login'
      }
    }
    next()
  }
  
  //middleware to check if user is not authenticated
  //FOR: MUST BE AUTHENTICATED ROUTES
  function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return res.redirect('/')
    }
    next()
}

function validateSignUpForm(req, res, next){
    try{
    var user = {
        id: null,
        username: validator.validateUsername(req.body.username,6,15),
        password: validator.validatePassword(req.body.password),
        lastname: validator.validateName(req.body.lastname, 'Last name'),
        firstname: validator.validateName(req.body.firstname, 'First name')
      }
      req.userForm = user;
      next();
    }catch(e){
        req.flash('error', e);
        var user = {
            username: req.body.username,
            lastname: req.body.lastname,
            firstname: req.body.firstname
          }
        res.render('sign-up', {user: user})
    }
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    validateSignUpForm
}