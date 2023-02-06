const { getByUsername, getUserById } = require('../models/User');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
//initialize the authentication functions for passport js
function initialize(passport){
    const authenticateUser = async (username, password, done) =>{
        const user = await getByUsername(username)
        console.log('password from form: ',password);
        if(user.length == 0){
            return done(null, false, 
                {message:"No username found"});
        }
        try{
            console.log(user);
            if (await bcrypt.compare(password, user.password)){
                return done(null, user, )
            } else{
                return done(null, false, 'Password incorrect')
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
        return done(null, await getUserById(id))
    })
}

module.exports = initialize;