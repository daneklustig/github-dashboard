const mongoose = require("mongoose");

const Review = mongoose.Review;

const reviewSchema = new Schema({
  content: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
