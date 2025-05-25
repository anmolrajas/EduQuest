const Question = require('../model/question');
const Topic = require('../model/topic');
const Subject = require('../model/subject');

// Create a new question
const createQuestion = async (req, res) => {
    try {
        const {
            question,
            question_image,
            options,
            correct_answer,
            correct_answer_image,
            difficulty,
            topicId,
            subjectId,
            hint,
            solution,
            solution_image
        } = req.body;

        if (!question || !options || !correct_answer || !difficulty || !topicId || !subjectId) {
            return res.status(400).json({ success: false, msg: "Required fields are missing." });
        }

        const newQuestion = new Question({
            question,
            question_image,
            options,
            correct_answer,
            correct_answer_image,
            difficulty,
            topicId,
            subjectId,
            hint,
            solution,
            solution_image
        });

        const saved = await newQuestion.save();

        // Increment questions_count on the related topic
        await Topic.findByIdAndUpdate(topicId, { $inc: { questions_count: 1 } });

        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        console.error("Error creating question:", err);
        res.status(500).json({ success: false, msg: "Something went wrong!" });
    }
};


// List questions with filters and pagination
const listQuestions = async (req, res) => {
    try {
        const {
            difficulty,
            subjectId,
            topicId,
            search,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (difficulty) filter.difficulty = difficulty;
        if (subjectId) filter.subjectId = subjectId;
        if (topicId) filter.topicId = topicId;
        if (search) filter.question = { $regex: search, $options: 'i' };

        const questions = await Question.find(filter)
            .populate('subjectId', 'name')
            .populate('topicId', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Question.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: questions,
            meta: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error("Error listing questions:", err);
        res.status(500).json({ success: false, msg: "Failed to fetch questions." });
    }
};

// Get single question detail
const questionDetails = async (req, res) => {
    try {
        const { questionId } = req.query;

        if (!questionId) {
            return res.status(400).json({ success: false, msg: "Question ID is required." });
        }

        const question = await Question.findById(questionId)
            .populate('subjectId', 'name')
            .populate('topicId', 'name');

        if (!question) {
            return res.status(404).json({ success: false, msg: "Question not found." });
        }

        res.status(200).json({ success: true, data: question });
    } catch (err) {
        console.error("Error fetching question details:", err);
        res.status(500).json({ success: false, msg: "Failed to fetch question details." });
    }
};

// Edit a question
const editQuestion = async (req, res) => {
    try {
        const { questionId } = req.query;
        const updateData = req.body;

        if (!questionId) {
            return res.status(400).json({ success: false, msg: "Question ID is required." });
        }

        const existing = await Question.findById(questionId);
        if (!existing) {
            return res.status(404).json({ success: false, msg: "Question not found." });
        }

        Object.assign(existing, updateData);
        const updated = await existing.save();

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error("Error updating question:", err);
        res.status(500).json({ success: false, msg: "Failed to update question." });
    }
};

// Soft delete a question
const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.body;

        if (!questionId) {
            return res.status(400).json({ success: false, msg: "Question ID is required." });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, msg: "Question not found." });
        }

        question.status = false;
        await question.save();

        res.status(200).json({ success: true, msg: "Question deleted successfully." });
    } catch (err) {
        console.error("Error deleting question:", err);
        res.status(500).json({ success: false, msg: "Failed to delete question." });
    }
};


// Restore a question
const restoreQuestion = async (req, res) => {
    try {
        const { questionId } = req.body;

        if (!questionId) {
            return res.status(400).json({ success: false, msg: "Question ID is required." });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, msg: "Question not found." });
        }

        question.status = true;
        await question.save();

        await Topic.findByIdAndUpdate(question.topicId, { $inc: { questions_count: 1 } });

        res.status(200).json({ success: true, msg: "Question restored successfully." });
    } catch (error) {
        console.error("Error restoring question:", error);
        res.status(500).json({ success: false, msg: "Failed to restore question." });
    }
};

module.exports = {
    createQuestion,
    listQuestions,
    questionDetails,
    editQuestion,
    deleteQuestion,
    restoreQuestion
};
