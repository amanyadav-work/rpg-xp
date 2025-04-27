import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
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
    message: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true, // adds createdAt & updatedAt
})

export const Comment =  mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
