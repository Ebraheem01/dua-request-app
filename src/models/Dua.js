import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
    userId: String,
    comment: String,
    userIdentifier: String,
    isAnonymous: Boolean,
    profileImageUrl: String,
}, { timestamps: true })

const DuaSchema = new mongoose.Schema({
    userId: String,
    userIdentifier: String,
    profileImageUrl: String,
    title: String,
    description: String,
    category: String,
    isAnonymous: Boolean,
    supporters: [String],
    supportCount: { type: Number, default: 0 },
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Dua || mongoose.model('Dua', DuaSchema)