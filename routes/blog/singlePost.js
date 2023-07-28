const express = require('express')
const router = express.Router()
const Blog = require('../../models/Blog');

router.post('/', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(500).json("internal error");
    const result = await Blog.findById(id);
    if (!result) return res.status(500).json("internal error");
    res.status(200).json(result);
  });

module.exports = router