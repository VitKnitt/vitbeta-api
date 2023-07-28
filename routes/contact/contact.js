const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

router.post("/", (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(500).json("internal error");
  }

  fs.appendFile(
    path.join(__dirname, "records", "emails"),
    `\"${email}\",`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("email saved");
      }
    }
  );

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
    from: email,
    to: process.env.MYEMAIL,
    subject: subject,
    text: `message:\r ${message} \r\r\r send by:\r ${email}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.send("error" + err);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json("success");
    }
  });
});

module.exports = router;
