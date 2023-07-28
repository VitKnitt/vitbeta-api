const express = require('express')
const router = express.Router()
const JWT = require("jsonwebtoken");

router.post('/',(req,res) => {
    //const { token } = req.cookies;
    const token = process.env.TOKEN
    if(!token) return res.status(401).json("unauthorized")
      const userDoc = JWT.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, info) => {
          if (err) return res.status(400).json(err.message);
       
            return res.status(200).json({name: info.name, role :info.role});      
        }
      );
    })

module.exports = router