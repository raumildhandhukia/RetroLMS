const mongoose = require("mongoose");


const itemModel = new mongoose.Schema(
    {
      itemName: {
        type: String,
        require: true,
      },
      itemDescription: {
        type: String,
        require: true,
      },
      itemPrice: {
        type: Number,
        require: true
      },
      itemExpiry:{
        type: Number
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        require: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  const ItemModel = mongoose.model("Item", itemModel);
  
  module.exports = ItemModel;
  