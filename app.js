var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const { body } = require('express-validator');
var nodemailer = require('nodemailer');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('/public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// Validating form info
if (body('name').isLength({ min: 2 })) {
  let name = req.body.name;
}
if (body('contactInfo').isEmail().normalizeEmail() || body('contactInfo').isMobilePhone()) {
  let contactMethod = req.body.contactInfo;
}
if (body('msg').not().isEmpty().trim().escape()) {
  let message = req.body.msg;
}


// Is 404 error because we need this?
//app.get('/contact');


// POST route from contact form
app.post('/contact', (req, res) => {

  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_PASS = process.env.GMAIL_PASS;

  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  })

  // Specify what the email will look like
  const mailOpts = {
    from: 'Your sender info here', // This is ignored by Gmail
    to: GMAIL_USER,
    subject: 'New message from contact form at chrisquintin.com',
    text: 'From: ' + name + '\n Contact: ' + contactMethod + '\n Message: ' + msg
    //text: `${req.body.name} (${req.body.contactinfo}) says: ${req.body.msg}`
  }

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      // Show a page indicating failure
      //res.render('contact-failure');
      console.log('Error Sending Message');
    }
    else {
      // Show a page indicating success
      //res.render('contact-success');
      console.log('Message Sent!');
    }
  });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;