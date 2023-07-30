const express = require('express')
const router = express.Router()
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post("/", async (req, res) => {
    const { newPassword, id, token} = req.body;
    //const { id, token} = req.params;
    const verify = JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, verified) => {
        if (err) return res.status(401).json(err.message);
  
        const user = await User.findById(id);
  
        if (!user) {
          return res.status(404).json({ message: "user not found" });
        }
  
        const hashedPWD = bcrypt.hashSync(newPassword, 10);
        await user.updateOne({ password: hashedPWD });
        res.status(200).json({ message: "success", password: newPassword, user });
      }
    );
  });



module.exports = router