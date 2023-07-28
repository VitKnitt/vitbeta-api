const express = require ('express')
const router = express.Router()

router.get("/", (req, res) => {
  const cookies = req.cookies; 
  res.json({cookies, message: "jedu" }); 
});

module.exports = router