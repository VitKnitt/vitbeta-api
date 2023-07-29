const express = require('express')
const router = express.Router()
const JWT = require("jsonwebtoken");
const path = require("path");

router.get("/", (req, res) => {
    const { token } = req.cookies;
    //const token = process.env.TOKEN
    const verify = JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, info) => {
        if (err) return res.status(403).json("forbidden");
  
        const filePath = path.join(__dirname,"..","..", "public", "docs", "Vit.rar");
        const fileName = "Vit.rar";
        res.download(filePath, fileName, (err) => {
          if (err) {
            return res.status(500).json("internal error");
          } else {
            console.log("file downloaded successfully");
          }
        });
      }
    );
  });


module.exports = router