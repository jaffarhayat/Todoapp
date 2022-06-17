const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/log')
  }
)

// @desc    Auth with facebook
// @route   GET /auth/facebook
router.get('/facebook', passport.authenticate('facebook', { scope : 'email,user_photos' }));


// @desc    facebook auth callback
// @route   GET /auth/facebook/callback
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/log' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
