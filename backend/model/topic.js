const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        desc: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        questions_count: {
            type: Number,
            default: 0,
        },
        template: {
            type: String,
            default: '',
        },
        status: {
            type: Boolean,
            default: true,
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true, // Optional: If every topic must be linked to a subject
        },
    },
    { timestamps: true }
);

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
