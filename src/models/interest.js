import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imgUrl: { type: String, default: '' },
    description: { type: String, default: '' },
});

export const Interest = mongoose.models.Interest || mongoose.model("Interest", interestSchema);
