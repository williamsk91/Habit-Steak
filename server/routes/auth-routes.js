const router = require('express').Router();
const express = require('express');
const passport = require('passport');


//auth login page
router.get('/login', (req, res)=>{
    res.render('login');
})

//auth logout
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/auth/login');
})

//auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['email']
}));

//callback route for google redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res)=>{
    res.redirect('/main')
})

module.exports = router;