const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");

router.post("/", (req, res) => {
  try {
    const { token } = req.body;
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
  } catch (err) {
    res.status(500).json("internal error");
  }
});

module.exports = router;
