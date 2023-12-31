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

    code_shop: {
      type: String,

    },
    photo: {
      type: String,
    },
    view: {
      type: Number,
      default: 0
    },
    review: {
      type: Number,
      default: 0
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
    // origin: {
    //   type: String,
    // },
    // trademark: {
    //   type: String,
    // },
    // warehouse: {
    //   type: String,
    // },
    // sent_from: {
    //   type: String,
    // },
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
      type: String || undefined,
      default: undefined
    },
    valueClassify: {
      type: String,

    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("products", productSchema);
