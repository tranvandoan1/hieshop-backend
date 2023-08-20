import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;
const CateShopee = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    categorie_id: {
      type: ObjectId,
      ref: "categories",
    },

    shopowner_id: {
      type: ObjectId,
      ref: "shopowners",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("cateshopee", CateShopee);
