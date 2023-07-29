const express = require('express')
const router = express.Router()

router.post("/", (req, res) => {
    /*
    req.session.destroy((err) => {
      if(err) console.log(err)
    })
    */
    res.cookie("token", "").json("logout success")
    //const token = null
   // res.json("logout success");
  });

module.exports = router