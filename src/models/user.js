import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    image: { type: String, default: '' },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest',
    }],
    assignedTasks: [{
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task', 
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    collectibles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collectible',
    }],
    createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
