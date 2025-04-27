import mongoose from 'mongoose';

const ShareSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
})

export const Share = mongoose.models.Share || mongoose.model('Share', ShareSchema);
