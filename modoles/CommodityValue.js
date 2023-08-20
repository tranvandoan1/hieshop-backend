import mongoose from "mongoose";

const CommodityValue = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    connection: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    linked: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("commodityvalues", CommodityValue);
