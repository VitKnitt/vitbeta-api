const express = require ('express')
const router = express.Router()
const Blog = require('../../models/Blog');

router.get("/", async (req, res) => {
    const result = await Blog.find();
    res.json(result);
  });

module.exports = router