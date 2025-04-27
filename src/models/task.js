import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    longDescription: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Health',
        'Fitness',
        'Education',
        'Adventure',
        'Technology',
        'Creativity',
        'Finance',
        'Mindfulness',
      ],
      required: true,
    },
    xp: {
      type: Number,
      required: true,
    },
    coins: {
      type: Number,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
