import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const imageProSchema = new mongoose.Schema(
  {
    cate_id: {
      type: ObjectId,
      ref: "categories",
    },

    photo1: {
      type: String,
    },
    photo2: {
      type: String,
    },
    photo3: {
      type: String,
    },
    photo4: {
      type: String,
    },
    photo5: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("imagepro", imageProSchema);
