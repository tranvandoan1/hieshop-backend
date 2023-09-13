import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const Comment = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: 'users',
        required: true
    },
    pro_id: {
        type: ObjectId,
        ref: 'products',
        required: true
    },
    comment: {
        type: String,
        trim: true,
        required: true
    },
    photo: {
        type: Array
    },
    code_shop:{
        type:String
    }
}, { timestamps: true });
module.exports = mongoose.model('comments', Comment);