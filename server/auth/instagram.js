const passport = require('passport')
const router = require('express').Router()
const InstagramStrategy = require('passport-instagram').Strategy
const {User} = require('../db/models')
module.exports = router



passport.use(new InstagramStrategy({
   clientID: process.env.INSTAGRAM_CLIENT_ID,
   clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
   callbackURL: process.env.INSTAGRAM_CALLBACK
   //"http://localhost:8080/auth/instagram/callback"
 },
 function(accessToken, refreshToken, profile, done) {
   // User.findOrCreate({ where: { instagramId: profile.id }}, function (err, user) {
   //   return done(err, user);
   // });
   console.log("ACCESS TOKEN", accessToken)
   process.env.ACCESS_TOKEN = accessToken
   console.log("process env access", process.env.ACCESS_TOKEN)
   User.findOrCreate({
       where: {instagramId: profile.id, accessToken: accessToken}
     })
       .then(([user]) => done(null, user))
       .catch(done)
 }
))

router.get('/',
 passport.authenticate('instagram'));

router.get('/callback',
 passport.authenticate('instagram', { failureRedirect: '/login'}),
 function(req, res) {
   // Successful authentication, redirect home.
   console.log(req.user)
   res.redirect('/home');
 });

