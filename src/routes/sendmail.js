

var express = require('express');
var router = express.Router();
var mailer = require('nodemailer');



router.post('/send/', function(req, res, next) {

    var smtpTransport = mailer.createTransport( {
        host: process.env.AWS_SMS_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.AWS_SMS_USER,
            pass: process.env.AWS_SMS_PASS
        }
    });

    var body = JSON.stringify(req.body, null, 4);

    var mail = {
        from: process.env.AWS_SMS_FROM,
        to: process.env.AWS_SMS_TO,
        subject: process.env.AWS_SMS_SUBJECT,
        text: body
    };

    smtpTransport.sendMail (mail, function (error, response) {
        if (error) {
            res.status(error.statusCode).json(error);
        }
        else {
            res.json({status: 'success'});
        }
        smtpTransport.close();
    });
});

module.exports = router;
