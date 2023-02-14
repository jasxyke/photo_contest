var express = require('express');
const { getFeaturedPhotos, createEntry, getEntries, getEntryById} = require('../models/Entries');
const { getLeaderboards } = require('../models/Leaderboards')
var router = express.Router();
const multer = require('multer')
const flash = require('express-flash')
const Service = require('../services/EntryService')
const {voteEntry, unVoteEntry, getVotes} = require('../models/Votes')
const path = require('path')
const upload = multer({dest: './public/entries'})
const { handleError } = require('../services/ErrorHandler')
const { checkAuthenticated, checkNotAuthenticated, validateSignUpForm} = require('../services/middlewares/authentication');

//use flash
router.use(flash())

//get entries of the currennt month
router.get('/all', async (req, res)=>{
  try{
    res.send(await getEntries({orderBy: null}))
  }catch(e){
    handleError(req, res, e);
  }
});

router.get('/view/:id', checkAuthenticated, async (req, res)=>{
  try{
    let entry = await getEntryById(req.params.id);
   res.render('preview', {entry: entry, signedIn: req.signedIn}) 
  }catch(e){
    res.send(e);
  }
})

router.get('/likes', authenticateFirst, async (req, res)=>{
  try{
    var userLikes = await getVotes(req.user.id)
    var likes = []
    userLikes.forEach(like => {
      likes.push(like.entry_id)
    });
    res.send(likes)
  }catch(e){
    res.send(e)
  }
})

//get featured entries
router.get('/featured', async (req, res) =>{
  try{
    res.send( await getFeaturedPhotos())
  }catch(err){
    handleError(req, res, e)
  }
})

router.get('/leaderboards/:month', async (req, res)=>{
  try{
    res.send( await getLeaderboards(req.params.month))
  }catch(e){
    console.log(e);
    //handleError(req, res, e)
  }
})

router.get('/upload', authenticateFirst, (req, res)=>{
  console.log('upload page');
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

router.post('/vote/:id', authenticateFirst, async (req, res)=>{
  let affectedRows = await voteEntry(req.user.id, req.params.id);
    if(affectedRows !== 1){
      res.send(false)
      return;
    }
    res.send(true);
    //TODO: figure out what to send after succesful like
})


router.delete('/unvote/:id', authenticateFirst, async (req, res)=>{
  let affectedRows = await unVoteEntry(req.user.id, req.params.id)
    if(affectedRows !== 1){
      res.send(false)
      return;
    }
    res.send(true);
    //TODO: figure out what to send after succesful like
  });
 
 //middleware to check if user is not authenticated
 //FOR: for if already in session, redirect user to home page
//  function checkNotAuthenticated(req, res, next){
//    if(req.isAuthenticated()){
//      return res.redirect('/')
//    }
//    next()
//  }

 function authenticateFirst(req, res, next){
  if(!req.isAuthenticated()){
    console.log('redirecting to login...');
    return res.redirect('../login')
  }
  next()
 }

module.exports = router;
