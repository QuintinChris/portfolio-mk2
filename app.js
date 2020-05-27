var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { body } = require('express-validator');
var nodemailer = require('nodemailer');

require('dotenv').config();

var indexRouter = require('./routes/index');

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


/*
fetch('/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({

  })
});
*/

// POST route from contact form
app.post('/contact', (req, res) => {

  let name = req.body.name;
  let contactMethod = req.body.contactInfo;
  let message = req.body.msg;

  // Validation
  if (name.isLength({ min: 2 }) &&
    (contactMethod.isEmail().normalizeEmail() || contactMethod.isMobilePhone()) &&
    message.not().isEmpty().trim().escape()) {

    // Instantiate the SMTP server
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    })

    // Specify what the email will look like
    const mailOpts = {
      from: 'form@chrisquintin.com',
      to: 'cwq23drexel@gmail.com',
      subject: 'New message from chrisquintin.com',
      text: 'From: ' + name + '\nContact Method: ' + contactMethod + '\nMessage: ' + message
    }

    // Attempt to send the email
    transporter.sendMail(mailOpts, (error, info) => {
      if (error) {
        // Show a page indicating failure
        console.log(error);
      }
      else {
        // Show a page indicating success
        console.log('Email Sent: ' + info.response);
      }
    });

    res.render('index');
  }

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