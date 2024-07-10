const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const helmet = require('helmet');

const port = 4000
const session = require('express-session')


app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", 'http://localhost:4000/css/fonts/'], 
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com',  "'unsafe-eval'"],
    },
  })
)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ^ allowed to access infomation passed on from forms 
// app.use(express.json)
// ^ allows to access info via json request, when calling API
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))

const loginRouter = require('./routes/login')
app.use('/login', loginRouter) 

const studentRouter = require('./routes/student')
app.use('/studentHome', studentRouter) 

const managerRouter = require('./routes/manager')
app.use('/managerHome', managerRouter)

const quizRouter = require('./routes/quiz')
app.use('/quiz', quizRouter)

const resultsRouter = require ('./routes/result')
app.use('/result', resultsRouter)

const passwordResetRouter = require ('./routes/passwordReset')
app.use('/passwordReset', passwordResetRouter)

const confirm = require ('./routes/confirm')
app.use('/confirm', confirm)

app.listen(port, () => {
    console.log("this port is working")
})



