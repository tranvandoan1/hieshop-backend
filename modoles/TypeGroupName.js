import mongoose from 'mongoose';

const TypeGroupName = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    pro_id: {
        type: String,
        trim: true,
        required: true,
    }
}, { timestamps: true });
module.exports = mongoose.model('TypeGroupName', TypeGroupName);