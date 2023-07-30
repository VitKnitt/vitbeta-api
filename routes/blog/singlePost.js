const express = require('express')
const router = express.Router()
const Blog = require('../../models/Blog');

router.post('/', async (req, res) => {
    const { id } = req.body;
    try{    
    const result = await Blog.findById(id);
    res.status(200).json(result);
  }
  catch(err){
    if (!result) return res.status(500).json("internal error");
  }
  });

module.exports = router