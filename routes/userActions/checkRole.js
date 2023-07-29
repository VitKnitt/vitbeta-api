const express = require('express')
const router = express.Router()
const JWT = require("jsonwebtoken");


router.post("/", (req, res) => {
    const { token } = req.cookies;
    //const token = process.env.TOKEN
    const userDoc = JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, info) => {
        if (err) return res.status(400).json(err.message);
        if (info.role === "admin") {
          return res.status(200).json("ok");
        }
        return res.status(403).json("forbidden");
      }
    );
  });

module.exports = router