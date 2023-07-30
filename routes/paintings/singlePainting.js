const express = require('express')
const router = express.Router()
const PaintingsModel = require("../../models/PaintingsModel");

router.post("/", async (req, res) => {
    try {
      const { id } = req.body;
      const result = await PaintingsModel.findById(id);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router