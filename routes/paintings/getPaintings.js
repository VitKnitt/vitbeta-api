const express = require('express')
const router = express.Router()
const PaintingsModel = require("../../models/PaintingsModel");

router.get("/", async (req, res) => {
    const result = await PaintingsModel.find();
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: "nic tam neni" });
    }
  });

module.exports = router