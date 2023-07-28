const express = require('express')
const router = express.Router()
const fs = require("fs");
const JWT = require("jsonwebtoken");
const Blog = require('../../models/Blog');

router.post("/", async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  
    //const { token } = req.cookies;
    const token = process.env.TOKEN
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, async (err, info) => {
      if (err) return res.status(500).json("internal error");
      const { title, text } = req.body;
      const postBlog = await Blog.create({
        title,
        text,
        picture: newPath,
        author: info.id,
      });
      res.json(postBlog.comments);
    });
  });


module.exports = router