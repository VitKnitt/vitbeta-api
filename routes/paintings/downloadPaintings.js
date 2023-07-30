const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");
const path = require("path");

router.post("/", (req, res) => {
  try {
    const { token } = req.body;
    const verify = JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, info) => {
        if (err) return res.status(403).json("forbidden");
        res.status(200).json("success");
      }
    );
  } catch (err) {
    res.status(500).json("internal error");
  }
});

router.get("/", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "docs",
      "Vit.rar"
    );
    const fileName = "Vit.rar";
    res.download(filePath, fileName, (err) => {
      if (err) {
        return res.status(500).json("internal error");
      } else {
        console.log("file downloaded successfully");
      }
    });
  } catch (error) {
    res.status(500).json("internal error");
  }
});

module.exports = router;
