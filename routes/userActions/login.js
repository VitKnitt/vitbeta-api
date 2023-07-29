const express = require('express')
const router = express.Router()
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");


router.post("/", async (req, res) => {
    const { name, password } = req.body;
    const userDoc = await User.findOne({ name });
  
    if (!userDoc) return res.status(404).json("user doesnt exist");
  
    const legitPassword = bcrypt.compareSync(password, userDoc.password);
  
    if (legitPassword) {
      JWT.sign(
        { name, id: userDoc._id, role: userDoc.role },
        process.env.ACCESS_TOKEN_SECRET,
        { },
        (err, token) => {
          if (err) return res.status(500).json("internal error");
         console.log(token + " jwt in back-end")
          //res.cookie("token", token, { maxAge: 10 * 24 * 60 * 60 * 1000}).status(200).json({ name, id: userDoc._id});
          res.status(200).json({token,name,id: userDoc._id})
        }
      );
    } else {
      res.status(400).json("wrong credentials");
    }
  });

module.exports = router