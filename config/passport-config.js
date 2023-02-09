const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
//initialize the authentication functions for passport js
function initialize(passport){
    const authenticateUser = async (username, password, done) =>{
        const user = await User.getByUsername(username)
        console.log('password from form: ',password);
        if(!user){
            return done(null, false, 
                {message:"Incorrect username or password"});
        }
        try{
            console.log(user);
            if (await bcrypt.compare(password, user.password)){
                return done(null, user, )
            } else{
                return done(null, false, 'Incorrect username or password')
            }
        } catch (e){
            return done(e, )
        }

    }
    passport.use(new LocalStrategy({usernameField: 'username'},
    authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        return done(null, await User.getById(id))
    })
}

module.exports = initialize;