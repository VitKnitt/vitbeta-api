const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");


const CommentSchema = new Schema({
  name: String,
  comment: String
})

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      require: true,
    },
    picture: {
      type: String,
      require: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments:[
      {
        name: String,
        comment: String
      }
    ]
  },
  { timestamps: true }
);

const BlogModel = model("Blogs",BlogSchema);

module.exports = BlogModel;

