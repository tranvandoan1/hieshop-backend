import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const Contact = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },

    id_user: {
        type: ObjectId,
        ref: 'user', //
        required: true
    },

    content: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: Number,
        maxlength: 11
    }
}, { timestamps: true });
module.exports = mongoose.model('contacts', Contact);