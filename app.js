const express = require('express')
const mongoose=require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)


var app=express()

dotenv.config()

// Connect to mongodb
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})

// Passport config
require('./config/passport')(passport)



// Middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))


 __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.set('view engine','ejs');

app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )

  // Passport middleware

app.use(passport.initialize())
app.use(passport.session())


app.use(require("./routes/index"))
app.use('/auth', require('./routes/auth'))
app.use(require("./routes/todo"))



//Server Configuration
app.listen(process.env.PORT,console.log(`listening at ${process.env.PORT}`))
