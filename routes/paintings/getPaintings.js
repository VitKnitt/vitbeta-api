const express = require("express");
const router = express.Router();
const PaintingsModel = require("../../models/PaintingsModel");

router.get("/", async (req, res) => {
  try{
  const result = await PaintingsModel.find(); 
    res.status(200).json(result);
  }   catch(err){
    res.status(500).json({ message: "internal error" });
  }
});

module.exports = router;
