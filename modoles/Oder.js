import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const Oder = new mongoose.Schema(
  {
    user_id: {
      type: String,
      trim: true,
    },
    code_shop: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      trim: true,
    },
    info_user_id: {
      type: ObjectId,
      ref: "InfoUser",
    },
    values: {
      type: String,
    },
    status: {
      type: String,
      default: 1,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Oder", Oder);
