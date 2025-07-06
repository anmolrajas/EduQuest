const mongoose = require('mongoose');

const questionEntrySchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  negativeMarks: {
    type: Number,
    default: 0
  }
}, { _id: false });

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  topicIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  }],
  duration: {
    type: Number, // In minutes
    required: true
  },
  type: {
    type: String,
    enum: ['practice', 'mock', 'assignment', 'quiz', 'exam'],
    default: 'practice'
  },
  allowNegativeMarking: {
    type: Boolean,
    default: false
  },
  totalMarks: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  questions: {
    type: [questionEntrySchema],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

const Test =  mongoose.model('Test', testSchema);

module.exports = Test;
