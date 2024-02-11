const express = require("express");
const ejs = require("ejs");
const nodemailer = require('nodemailer');
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD  // generated ethereal password
  },
  tls:{
    rejectUnauthorized:false
  }
});


module.exports = async function sendmailWel(email) {

  const data = await ejs.renderFile('./views/welcome.ejs');
  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Vaccine Checker" <checkervaccine@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Welcome to our email', // Subject line
      html: data // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      } else {
        console.log("Welcome Email Sent.");
      }
      // console.log('Message sent: %s', info.messageId);
      // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}
