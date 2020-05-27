var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var app = express();
const { body } = require('express-validator');


if (body('name').isLength({ min: 2 })) {
    let name = req.body.name;
}
if (body('contactInfo').isEmail().normalizeEmail() || body('contactInfo').isMobilePhone()) {
    let contactMethod = req.body.contactInfo;
}
if (body('msg').not().isEmpty().trim().escape()) {
    let message = req.body.msg;
}

/*
body('name').isLength({ min: 2 }),
body('contactInfo').isEmail().normalizeEmail() || body('contact').isMobilePhone(),
body('msg').not().isEmpty().trim().escape()
*/


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

/* contact form handler
app.post('/contact', [
    body('name').isLength({ min: 2 }),
    body('contact').isEmail().normalizeEmail() || body('contact').isMobilePhone(),
    body('msg').not().isEmpty().trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let name = body('name');
    let contact = body('contact');
    let msg = body('msg');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    let mailOptions = {
        from: 'chrisquintin.com',
        to: 'cwq23drexel@gmail.com',
        subject: 'New Message From ' + name + '- ChrisQuintin.com',
        text: msg
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Sending Message');
        } else {
            console.log('Message Sent!');
        }
    });
});
*/

module.exports = router;