import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
    },
    status: {
      type: Number,
    },
    ordinal_number: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("slides", sliderSchema);
