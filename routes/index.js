var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var app = express();



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



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
    text: `${req.body.name} (${req.body.contactinfo}) says: ${req.body.message}`
  }

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      res.render('contact-failure'); // Show a page indicating failure
    }
    else {
      res.render('contact-success');// Show a page indicating success
    }
  });
});


module.exports = router;