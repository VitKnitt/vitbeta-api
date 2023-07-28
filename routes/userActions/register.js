const express = require('express')
const router = express.Router()
const User = require("../../models/User");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    const { name, password, email } = req.body;
    try {
      const duplicateName = await User.findOne({ name });
      if (duplicateName)
        return res.status(409).json({ message: "duplicate name" });
  
      const duplicateEmail = await User.findOne({ email });
      if (duplicateEmail)
        return res.status(409).json({ message: "duplicate email" });
  
      await User.create({
        name,
        password: bcrypt.hashSync(password, 10),
        email,
      });
  
      res.status(201).json({ message: "user created" });
    } catch (err) {
      return res.status(400).json({ message: "bad request" });
    }
  });

module.exports = router