const express = require ('express')
const router = express.Router()
const Blog = require('../../models/Blog');

router.get("/", async (req, res) => {
  try{
    const result = await Blog.find();
    res.status(200).json(result);
  }catch (error){
    res.json(error)
  }
  });

module.exports = router