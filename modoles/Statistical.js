import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const Statistical = new mongoose.Schema({

    price: {
        type: Number,
        trim: true
    },
    shop_id: {
        type: ObjectId,
        ref: "shopowners",
        required: true
    },
    date: {
        type: String,
    },
    day: {
        type: String,
    }
}, { timestamps: true });
module.exports = mongoose.model('statisticals', Statistical);