import mongoose from 'mongoose';
const OderDetail = new mongoose.Schema({
    pro_id: {
        type: String,
        trim: true,
        required: true,
    },
    amount: {
        type: String,
        trim: true,
        required: true,
    },
    commodity_value: {
        type: String,
        required: true,
        trim: true

    },
    classification: {
        type: String,
        required: true,
        trim: true
    },
    connection: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        trim: true,
        required: true

    },
    name_pro: {
        type: String,
        trim: true
    },
    cover_image: {
        type: String
    },
    sale: {
        type: String,
        trim: true
    },
}, { timestamps: true });
module.exports = mongoose.model('oderdetail', OderDetail);