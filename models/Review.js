const mongoose = require("mongoose");

const Review = mongoose.Review;

const reviewSchema = new Schema({
  content: String,
  rating: {
    type: Number,
    min: 1,
    max: 12
  }
});
