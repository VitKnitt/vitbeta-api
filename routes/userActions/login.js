const express = require('express')
const router = express.Router()
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");


router.post("/", async (req, res) => {
  try{
    const { name, password } = req.body;
    const userDoc = await User.findOne({ name });
    if (!userDoc) return res.status(404).json("user doesnt exist");
  
    const legitPassword = bcrypt.compareSync(password, userDoc.password);
    
    if (legitPassword) {
      JWT.sign(
        { name, id: userDoc._id, role : userDoc.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30d' },
        (err, token) => {
          if (err) return res.status(500).json("internal error");
          res.status(200).json({token,name,id: userDoc._id, role: userDoc.role})
        }
      );
    } else {
      res.status(400).json("wrong credentials");
    }
  }catch(err){
    res.status(500).json("internal error");  
  }
  });

module.exports = router