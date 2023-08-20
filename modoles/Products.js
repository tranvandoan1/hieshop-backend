import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    cate_id: {
      type: ObjectId,
      ref: "categories",
    },

    user_id: {
      type: ObjectId,
      ref: "user",
    },
    photo: {
      type: String,
    },
    view: {
      type: Number,
    },
    review: {
      type: Number,
    },

    sold: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
    },
    sale: {
      type: Number,
      default: 0
    },
    origin: {
      type: String,
    },
    trademark: {
      type: String,
    },
    warehouse: {
      type: String,
    },
    sent_from: {
      type: String,
    },
    linked: {
      type: String,
    },
    image_id: {
      type: String,
    },
    name_classification: {
      type: String,
    },
    name_commodityvalue: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("products", productSchema);
