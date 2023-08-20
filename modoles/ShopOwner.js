import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;
const ShopOwner = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    user_id: {
        type: ObjectId,
        ref: 'users',
    },
    photo: {
        type: String
    },
    image_id: {
        type: String,
      },
    followers: {
        type: Number,
        trim: true,
        default: 0
    },
    product_reviews: {
        type: Number,
        trim: true,
        default: 0

    }
}, { timestamps: true });
module.exports = mongoose.model('shopowner', ShopOwner);