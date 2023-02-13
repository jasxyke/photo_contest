var express = require('express');
const { getFeaturedPhotos, createEntry, getEntries} = require('../models/Entries');
const { getLeaderboards } = require('../models/Leaderboards')
var router = express.Router();
const multer = require('multer')
const flash = require('express-flash')
const Service = require('../services/EntryService')
const {voteEntry, unVoteEntry} = require('../models/Votes')
const path = require('path')
const upload = multer({dest: './public/entries'})
const { handleError } = require('../services/ErrorHandler')

//use flash
router.use(flash())

//get entries of the currennt month
router.get('/:orderby', async (req, res)=>{
  try{
    res.send(await getEntries({orderBy: req.params.orderby}))
  }catch(e){
    handleError(req, res, e);
  }
});

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
