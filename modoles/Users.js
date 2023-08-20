const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    hashed_password: {
      type: String,
    },
    about: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    salt: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
    image_id: {
      type: String,
    },
    uid: {
      type: String,
      default:undefined
    }
  },
  { timestamps: true }
);

// vitual field

userSchema
  .virtual("password") // Tạo 1 field ảo
  .set(function (password) {
    this.salt = uuidv1(); //unique
    this.hashed_password = this.encrytPassword(password);
  });

userSchema.methods = {
  authenticate: function (plainText) {
    console.log(plainText, 'plainText')
    return this.encrytPassword(plainText) === this.hashed_password;
  },
  encrytPassword: function (password) {
    console.log(password, 'kt password')
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("user", userSchema);
