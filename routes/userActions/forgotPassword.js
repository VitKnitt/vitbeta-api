const express = require('express')
const router = express.Router()
const User = require("../../models/User");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");


router.post("/", async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user) {
      const { name, password, _id } = user;
      const payload = {
        name,
        password,
      };
  
      const token = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "900s",
      });  
   
      const result = `${_id}/${token}`;
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MYEMAIL,
          pass: process.env.APPPASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.MYEMAIL,
        to: email,
        subject: "password reset",
        text: `click on the link below to reser your password:\r\r https://www.edgetale.com/#/passwordreset/${result}`,
      };
      
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          res.send("error" + err);
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json("email sent");
        }
      });
    } else {
      res.status(404).json("email not found");
    }
  });

module.exports = router