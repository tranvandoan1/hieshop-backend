import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    photo: {
        type: String
    },
    image_id:{
        type: String

    }
}, { timestamps: true });
module.exports = mongoose.model('categoris', categorySchema);