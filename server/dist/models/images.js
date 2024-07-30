import mongoose from 'mongoose';
const ImageSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
export default mongoose.model('Image', ImageSchema);
