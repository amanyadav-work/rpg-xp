import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
}, { _id: false }); // Prevent _id in subdocument

const collectibleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    requiredXp: { type: Number, default: 1000 },
    requiredCoins: { type: Number, default: 3000 },
    type: { type: String, enum: ['chest', 'common'], default: 'common' },
    task: {
        type: taskSchema,
        required: function () {
            return this.type === 'chest';
        }
    }
})

export const Collectible = mongoose.models.Collectible || mongoose.model("Collectible", collectibleSchema)