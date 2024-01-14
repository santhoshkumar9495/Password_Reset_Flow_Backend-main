const nodemailer=require('nodemailer');
const Mailgen =require('mailgen');
const dotenv = require("dotenv");
dotenv.config();


// https://ethereal.email/create
let nodeConfig = {
    service: 'gmail', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_ACCOUNT, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

/** POST: http://localhost:8000/api/registerMail 
 * @param: {
 "username" : "admin",
  "userEmail" : "admin@gmail.com",
  "text" : "",
  "subject" : "",
}
*/
const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // body of the email
    var email = {
        body : {
            name: username,
            intro : text || 'Welcome to Password-reset-flow session! We\'re very excited to have you on board.',
            outro: 'Need assisst, or have any questions? Just reply to this email, we\'d love to help you at any time.'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from :  process.env.EMAIL_ACCOUNT,
        to: userEmail,
        subject : subject || "Signup Successful",
        html : emailBody
    }

    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ message: "Email has to your registered Email account."})
        })
        .catch(error => res.status(500).send({ error }))

}

module.exports = {registerMail};