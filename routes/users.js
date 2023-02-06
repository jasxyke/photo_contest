var express = require('express');
const User = require('../models/User')
var router = express.Router();

router.get('/:username', (req, res)=>{
    var user = User.getByUsername(req.params.username)
    //res.render('profile', {user: user})
    res.send(user)
})


module.exports = router;
