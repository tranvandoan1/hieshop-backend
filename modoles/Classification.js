import mongoose from "mongoose";

const Classification = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    values:
      [
        {
          quantity: {
            type: Number,
          },
          price: {
            type: Number,
          },
          name: {
            type: String,
          },
          indexNumber: {
            type: String,

          },

        },
      ] | undefined,
    linked: {
      type: String,
    },
    photo: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    indexNumber: {
      type: String,

    },
    image_id: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("classify", Classification);
