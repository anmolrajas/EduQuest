const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
      question: { type: String, required: true },
      question_image: { type: String, default: '' },
  
      options: {
        type: [String],
        validate: v => Array.isArray(v) && v.length >= 2,
        default: []
      },
  
      correct_answer: { type: String, required: true },
      correct_answer_image: { type: String, default: '' },
  
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy'
      },
  
      topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
      },
  
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
      },
  
      hint: { type: String, default: '' },
      solution: { type: String, default: '' },
      solution_img: { type: String, default: '' },
  
      status: { type: Boolean, default: true }
    },
    { timestamps: true }
  );

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
