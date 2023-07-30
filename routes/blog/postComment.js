const express = require('express')
const router = express.Router()
const JWT = require("jsonwebtoken");
const Blog = require('../../models/Blog');


router.post("/", async (req, res) => {
    const newComment = req.body[0].newComment;
    const id = req.body[1].id;
    const token  = req.body[2]
    //const token = process.env.TOKEN   
    try {
      // Verify the token and get the user information
      const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const name = decodedToken.name;
  
      const result = await Blog.findById(id);
      const numberOfComments = result.comments.filter((comment) => comment.name === name);
      const maxNumber = numberOfComments.length;
  
      if (maxNumber >= 5) {
        return res.status(403).json("limit exceeded");
      }
  
      result.comments.push({ name, comment: newComment });
      await result.save();
  
      res.status(201).json("comment saved");
    } catch (err) {
      return res.status(401).json(`unauthorized ${err}  ${token}`);
    }   
  });

module.exports = router