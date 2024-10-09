import mongoose from 'mongoose'

const DuaSchema = new mongoose.Schema({
    userId: String,
    firstName: String,
    profileImageUrl: String,
    title: String,
    description: String,
    category: String,
    isAnonymous: Boolean,
    supporters: [String],
    supportCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Dua || mongoose.model('Dua', DuaSchema)