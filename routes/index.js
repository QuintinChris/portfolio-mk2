var express = require('express');
var router = express.Router();
var app = express();
const { body } = require('express-validator');
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', (req, res) => {

  let name = req.body.name;
  let contactMethod = req.body.contactInfo;
  let message = req.body.msg;

  // Validation
  /*
  if (name.not().isEmpty() &&
    (contactMethod.isEmail().normalizeEmail() || contactMethod.isMobilePhone()) &&
    message.not().isEmpty().trim().escape()) {
      */

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
      //$('#myToast').toast('show');
      res.redirect('/');
    }
  });
});

module.exports = router;