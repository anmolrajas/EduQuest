const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
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
        topics_count: {
            type: Number,
            default: 0,
        },
        template: {
            type: String,
            default: '',
        },
        status: {
            type: Boolean,
            default: true, // true = active, false = soft-deleted
        },
    },
    { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
