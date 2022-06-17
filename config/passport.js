const dotenv = require('dotenv')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')


dotenv.config()



module.exports = function (passport) {
  passport.use(
    new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  async(token, refreshToken, profile, done)=>{
    
    /* console.log(profile.id,)
    console.log(profile.displayName)
    console.log(profile.photos[0].value)
    console.log(profile.emails[0].value) */

    const name =profile.displayName.split(" ")
    const firstName = name[0]
    const lastName = name[1]
    
    const newUser = {
      socialId: profile.id,
      displayName: profile.displayName,
      firstName: firstName,
      lastName:lastName,
      image: profile.photos[0].value,
      email: profile.emails[0].value
    }

    try {
      let user = await User.findOne({ socialId: profile.id })

      if (user) {
        done(null, user)
      } else {
        user = await User.create(newUser)
        done(null, user)
      }
    } catch (err) {
      console.error(err)
    }
    //return done(null,profile)
  
}

  
   
))

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile.emails[0].value)
        // window.value=profile.emails[0].value; 
        const newUser = {
          socialId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value
        }

        try {
          let user = await User.findOne({ socialId: profile.id })

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
