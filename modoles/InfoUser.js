import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const InfoUser = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
      required: true,
    },
    user_id: {
      type: ObjectId,
      ref: "users", //
      required: true,
    },

    city: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },

    ward: {
      type: String,
      trim: true,
    },
    specific_address: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("InfoUser", InfoUser);
