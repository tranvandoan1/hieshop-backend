import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const Saveoder = new mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    linked: {
      type: String,
    },
    amount: {
      type: Number,
      trim: true,
      required: true,
    },
    commodity_value: {
      type: String || undefined,
      trim: true,
    },
    classification: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    name_pro: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    sale: {
      type: Number,
      trim: true,
    },

    shop_id: {
      type: ObjectId,
      ref: "shopowner",
      required: true,
    },
    classification_id: {
      type: ObjectId,
      ref: "classification",
      required: true,
    },
    commodity_value_id: {
      type: ObjectId || undefined,
      ref: "classification",
    },
    pro_id: {
      type: ObjectId,
      ref: "product",
      required: true,
    },
    check: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("saveoders", Saveoder);
