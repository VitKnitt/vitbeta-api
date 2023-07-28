const express = require('express')
const router = express.Router()
const fs = require("fs");
const JWT = require("jsonwebtoken");
const PaintingsModel = require("../../models/PaintingsModel");


router.post("/", async (req, res) => {
    const Items = [];
  
    req.files.map((file) => {
      const { originalname, path } = file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      Items.push(path + "." + ext);
    });
  
    //const { token } = req.cookies;
    const token = process.env.TOKEN
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { title, body, year, serie, additionalInfo } = req.body;
      const postPics = await PaintingsModel.create({
        title,
        body,
        serie,
        year,
        cover: Items[0],
        bigCover: Items[1],
        additionalCover: Items[2] ? Items[2] : null,
        additionalInfo,
        author: info.id,
      });
      res.json(postPics);
    });
  });


module.exports = router