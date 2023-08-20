import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const Oder = new mongoose.Schema({

    user_id: {
        type: String,
        trim: true
    },
    shop_id: {
        type: String,
        trim: true
    },
    connection: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    nameUser: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    day: {
        type: String
    }
}, { timestamps: true });
module.exports = mongoose.model('Oder', Oder);