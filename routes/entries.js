var express = require('express');
const { getFeaturedPhotos, createEntry, getLeaderboards} = require('../models/Entries');
var router = express.Router();
const multer = require('multer')
const Service = require('../services/EntryService')
const {voteEntry, unVoteEntry} = require('../models/Votes')
const path = require('path')
const upload = multer({dest: './public/entries'})

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

router.get('/upload', authenticateFirst, (req, res)=>{
  res.render('upload')
})

router.post('/add-entry', authenticateFirst, upload.single('img'), async (req, res) =>{
  try{
    var entry = {
      title: req.body.title,
      caption: req.body.desc,
      filePath: '',
      artist_id: req.user.id
    }
    var service = new Service(req.user, req.file.originalname)
    //check if the directory already exists for the current user with id
    service.checkDirectory()
    //get the designated file path for the entry
    let oldPath =  path.join(__dirname, '..', req.file.path);
    let imgDir = service.getImgDir();
    const newPath = path.join(__dirname,'..', imgDir, req.file.originalname)
    var photoSaved = await Service.savePhoto(oldPath,newPath)
    console.log('PHOTO SAVED: ', photoSaved);
    if(photoSaved){
      var relPath = service.getImgPath()
      entry.filePath = relPath;
      var result = await createEntry(entry)
      console.log('Entry saved to database....');
    }else{throw {msg:'Error saving photo'}}
    //after redirect should indicate that the photo was successfully uploaded
    res.redirect('/')
  }catch(e){
    console.log(e);
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

 function authenticateFirst(req, res, next){
  if(!req.isAuthenticated()){
    return res.redirect('../login')
  }
  next()
 }

module.exports = router;
