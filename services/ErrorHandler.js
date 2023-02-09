function handleError(req, res, error){
    req.flash('error', error)
    res.redirect('/sign-up')
    console.log(error);
}

module.exports = {
    handleError
}