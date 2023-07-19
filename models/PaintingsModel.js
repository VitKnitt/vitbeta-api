const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const PaintingsSchema = new Schema(
  {
    title: String,
    body: String,
    serie: {
      type: String,
      default: "noSerie"
    },
    year: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    bigCover: {
      type: String,
     required:true
    },
    additionalCover: String,
    additionalInfo: String,
    author: {
        type:Schema.Types.ObjectId,
        ref:'User'
    } 
  },
  {timestamps : true}
);

const PaintingsModel = model("Paintings", PaintingsSchema);

module.exports = PaintingsModel;

