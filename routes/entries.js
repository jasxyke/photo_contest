var express = require('express');
const { getFeaturedPhotos, createEntry, getLeaderboards} = require('../models/Entries');
var router = express.Router();
const multer = require('multer')
const service = require('../services/EntryService')
const {voteEntry, unVoteEntry} = require('../models/Votes')

const upload = multer({dest: './entries'})

//get featured entries
router.get('/featured', async (req, res) =>{
  try{
    res.send( await getFeaturedPhotos())
  }catch(err){
    res.send(err)
  }
})

router.get('/leaderboards', (req, res)=>{
  //get leaderboards of entries by month and current year
  //month is in numerical format
  res.send(getLeaderboards())
})

router.post('/add-entry', upload.single('photo'), async (req, res) =>{
  try{
    var entry = {
      title: req.body.title,
      caption: req.body.caption,
      filePath: '',
      artist_id: req.user.id || 1
    }
    //check if the directory already exists for the current user with id
    service.checkDirectory(req.user.id || 1)
    //get the designated file path for the entry
    service.getFilePath(req.user.id, req.photo.filename)
    const oldPath =  path.join(__dirname, '..', req.photo.path);
    var photoSaved = await service.savePhoto(oldPath,newPath)
    if(photoSaved){
      entry.filePath = newPath;
      var result = await createEntry(entry)
    }else{throw {msg:'Error saving photo'}}
    res.send(result.message)
  }catch(e){
    res.send(e)
  }
})

router.post('vote/:id', checkAuthenticated, (req, res)=>{
  voteEntry(req.params.id, req.user.id,(err, result)=>{
    if(err){
      res.send(false)
      return;
    }
    //TODO: figure out what to send after succesful like
  })
})

router.delete('/unvote/:id', checkAuthenticated, (req, res)=>{
  unVoteEntry(req.user.id, req.params)
})

//middleware to check if user is  authenticated
//FOR: must be authenticated routes
function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
   return next()
  }
  res.redirect('/sign-up')
 }
 
 //middleware to check if user is not authenticated
 //FOR: for if already in session, redirect user to home page
 function checkNotAuthenticated(req, res, next){
   if(req.isAuthenticated()){
     return res.redirect('/')
   }
   next()
 }

module.exports = router;
