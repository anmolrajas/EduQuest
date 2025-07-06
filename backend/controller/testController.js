// controller/testController.js
const Test = require('../model/test.js');
const Question = require('../model/question.js');
const mongoose = require('mongoose');
const USER = require('../model/user.js');

const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      type,
      subjectId,
      topicId,
      allowNegativeMarking,
      negativeMarks,
      marks,
      questionCounts,
      totalMarks,
      totalQuestions
    } = req.body;

    if (!title || !duration || !subjectId || !topicId || !totalMarks || !totalQuestions) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const topicIds = [topicId];
    const questions = [];

    for (const level of ['easy', 'medium', 'hard']) {
      const count = questionCounts[level];
      if (count > 0) {
          const levelQuestions = await Question.aggregate([
              {
                  $match: {
                      topicId: new mongoose.Types.ObjectId(topicId),
                      difficulty: level,
                      status: true  // ✅ Replace isDeleted with status
                  }
              },
              { $sample: { size: count } }
          ]);


        if (levelQuestions.length < count) {
          return res.status(400).json({
            success: false,
            message: `Not enough ${level} questions available. Requested: ${count}, Available: ${levelQuestions.length}`
          });
        }

        for (const q of levelQuestions) {
          questions.push({
            questionId: q._id,
            difficulty: level,
            marks: marks[level],
            negativeMarks: allowNegativeMarking ? negativeMarks[level] : 0
          });
        }
      }
    }

    const newTest = new Test({
      title,
      description,
      duration,
      type,
      subjectId,
      topicIds,
      allowNegativeMarking,
      totalMarks,
      totalQuestions,
      questions
    });

    await newTest.save();
    res.status(201).json({ success: true, message: 'Test created successfully.', data: newTest });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getTests = async (req, res) => {
  try {
    const { search = '', type = 'all' } = req.query;

    const filter = {
      isActive: true,
    };

    if (search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' }; // case-insensitive search
    }

    if (type !== 'all') {
      filter.type = type;
    }

    const tests = await Test.find(filter)
      .populate('subjectId', 'name')
      .populate('topicIds', 'name')
      .populate('questions.questionId', 'text')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


const softDeleteTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findByIdAndUpdate(
      testId,
      { isDeleted: true },
      { new: true }
    );

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    res.status(200).json({ success: true, message: 'Test soft deleted successfully.', data: test });
  } catch (error) {
    console.error('Error soft deleting test:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const restoreTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findByIdAndUpdate(
      testId,
      { isDeleted: false },
      { new: true }
    );

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    res.status(200).json({ success: true, message: 'Test restored successfully.', data: test });
  } catch (error) {
    console.error('Error restoring test:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const editTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const {
      title,
      description,
      duration,
      type,
      subjectId,
      topicId,
      allowNegativeMarking,
      negativeMarks,
      marks,
      questionCounts,
      totalMarks,
      totalQuestions,
    } = req.body;

    if (!title || !duration || !subjectId || !topicId || !totalMarks || !totalQuestions) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const topicIds = [topicId];
    const questions = [];

    for (const level of ['easy', 'medium', 'hard']) {
      const count = questionCounts[level];
      if (count > 0) {
        const levelQuestions = await Question.aggregate([
          { $match: { topicId: new mongoose.Types.ObjectId(topicId), difficulty: level, status: true } },
          { $sample: { size: count } }
        ]);

        if (levelQuestions.length < count) {
          return res.status(400).json({
            success: false,
            message: `Not enough ${level} questions available. Requested: ${count}, Available: ${levelQuestions.length}`
          });
        }

        for (const q of levelQuestions) {
          questions.push({
            questionId: q._id,
            difficulty: level,
            marks: marks[level],
            negativeMarks: allowNegativeMarking ? negativeMarks[level] : 0
          });
        }
      }
    }

    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      {
        title,
        description,
        duration,
        type,
        subjectId,
        topicIds,
        allowNegativeMarking,
        totalMarks,
        totalQuestions,
        questions,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    res.status(200).json({ success: true, message: 'Test updated successfully.', data: updatedTest });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const startTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findOne({ _id: testId, isDeleted: false })
      .select('title description duration questions')
      .populate({
        path: 'questions.questionId',
        select: 'question question_image options hint difficulty' // exclude correct_answer
      });

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    // Remove `correct_answer` for security (in case it was accidentally included)
    const sanitizedQuestions = test.questions.map(q => {
      const { correct_answer, ...rest } = q.questionId._doc;
      return {
        ...rest,
        _id: q.questionId._id,
        difficulty: q.difficulty,
        marks: q.marks,
        negativeMarks: q.negativeMarks
      };
    });

    res.status(200).json({ success: true, data: { ...test._doc, questions: sanitizedQuestions } });
  } catch (error) {
    console.error('Error starting test:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const submitTest = async (req, res) => {
  try {
    const { testId, answers, userId } = req.body;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found.' });

    const user = await USER.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const questionIds = test.questions.map(q => q.questionId.toString());
    const dbQuestions = await Question.find({ _id: { $in: questionIds } }).select('correct_answer');

    let score = 0;
    let correct = 0, wrong = 0;

    answers.forEach(userAnswer => {
      const dbQuestion = dbQuestions.find(q => q._id.toString() === userAnswer.questionId);
      const meta = test.questions.find(q => q.questionId.toString() === userAnswer.questionId);

      if (!dbQuestion || !meta) return;

      if (dbQuestion.correct_answer === userAnswer.selectedOption) {
        score += meta.marks;
        correct++;
      } else {
        score -= meta.negativeMarks;
        wrong++;
      }
    });

    const alreadySubmitted = user.testHistory.some(entry => entry.testId.toString() === testId);

    // Only store in DB if first attempt
    if (!alreadySubmitted) {
      user.testHistory.push({
        testId,
        score,
        correct,
        wrong,
        total: test.totalQuestions,
        maxMarks: test.totalMarks,
        submittedAt: new Date()
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: alreadySubmitted
        ? 'Test was already submitted. Showing result from current attempt.'
        : 'Test submitted and stored successfully.',
      data: {
        score,
        correct,
        wrong,
        total: test.totalQuestions,
        maxMarks: test.totalMarks,
        stored: !alreadySubmitted
      }
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const getTestById = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId)
      .populate('subjectId', 'name')
      .populate('topicIds', 'name')
      .populate('questions.questionId', 'question');

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Process marks, counts, and negativeMarks grouped by difficulty
    const marks = { easy: 0, medium: 0, hard: 0 };
    const questionCounts = { easy: 0, medium: 0, hard: 0 };
    const negativeMarks = { easy: 0, medium: 0, hard: 0 };

    test.questions.forEach(q => {
      const level = q.difficulty;
      questionCounts[level] += 1;
      marks[level] = q.marks; // Assuming consistent marks for same difficulty
      negativeMarks[level] = q.negativeMarks;
    });

    // Convert test document to plain object so we can add fields
    const testData = test.toObject();

    testData.marks = marks;
    testData.questionCounts = questionCounts;
    testData.negativeMarks = negativeMarks;

    res.status(200).json({ success: true, data: testData });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const checkIfAttempted = async (req, res) => {
  try {
    const { testId, userId } = req.query;

    if (!testId || !userId) {
      return res.status(400).json({ success: false, message: 'Missing testId or userId' });
    }

    const user = await USER.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const alreadyAttempted = user.testHistory.some(entry => entry.testId.toString() === testId);

    return res.status(200).json({
      success: true,
      alreadyAttempted,
    });
  } catch (error) {
    console.error('Error in checkIfAttempted:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const getLeaderboardByTestId = async (req, res) => {
  try {
    const { testId } = req.params;

    const users = await USER.find({ 'testHistory.testId': testId })
      .select('name email profilePicture testHistory')
      .lean();

    // Flatten user scores for the testId
    const leaderboard = users.map(user => {
      const record = user.testHistory.find(hist => hist.testId.toString() === testId);
      return {
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || '',
        score: record?.score || 0,
        correct: record?.correct || 0,
        wrong: record?.wrong || 0,
        submittedAt: record?.submittedAt || null,
      };
    });

    // Sort by score descending, then earliest submitted
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    });

    res.json({ success: true, data: leaderboard });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
  }
};


const getOverallLeaderboard = async (req, res) => {
  try {
    const users = await USER.find({ testHistory: { $exists: true, $ne: [] } })
      .select('name profilePicture testHistory')
      .lean();

    const leaderboard = users.map(user => {
      const totalTests = user.testHistory.length;
      const totalScore = user.testHistory.reduce((acc, t) => acc + t.score, 0);
      const totalCorrect = user.testHistory.reduce((acc, t) => acc + t.correct, 0);
      const totalWrong = user.testHistory.reduce((acc, t) => acc + t.wrong, 0);
      const totalMarks = user.testHistory.reduce((acc, t) => acc + t.maxMarks, 0);

      const accuracy = totalCorrect + totalWrong === 0 ? 0 :
        (totalCorrect / (totalCorrect + totalWrong)) * 100;
      const averageScore = totalTests === 0 ? 0 : totalScore / totalTests;

      return {
        userId: user._id,
        name: user.name,
        profilePicture: user.profilePicture,
        totalTests,
        totalScore,
        averageScore: averageScore.toFixed(2),
        totalMarks,
        accuracy: accuracy.toFixed(2),
      };
    });

    leaderboard.sort((a, b) => b.accuracy - a.accuracy || b.totalScore - a.totalScore);

    res.json({ success: true, data: leaderboard });
  } catch (err) {
    console.error('Error in leaderboard:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const getTestLeaderboard = async (req, res) => {
  try {
    const { testId } = req.params;

    const users = await USER.find({ 'testHistory.testId': testId })
      .select('name profilePicture testHistory')
      .lean();

    const leaderboard = users.map(user => {
      const totalTests = user.testHistory.length;
      const testRecord = user.testHistory.find(t => t.testId.toString() === testId);

      if (!testRecord) return null;

      const accuracy = testRecord.correct + testRecord.wrong === 0
        ? 0
        : (testRecord.correct / (testRecord.correct + testRecord.wrong)) * 100;

      const averageScore = totalTests === 0 ? 0 : user.testHistory.reduce((sum, t) => sum + t.score, 0) / totalTests;

      return {
        userId: user._id,
        name: user.name,
        profilePicture: user.profilePicture,
        totalTests: totalTests,
        totalScore: testRecord.score,
        averageScore: averageScore.toFixed(2),
        correct: testRecord.correct,
        wrong: testRecord.wrong,
        total: testRecord.total,
        maxMarks: testRecord.maxMarks,
        submittedAt: testRecord.submittedAt,
        accuracy: accuracy.toFixed(2),
        recentTests: user.testHistory
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 3)
          .map(t => ({
            name: t.testName || 'Unnamed Test',
            score: t.score,
            date: new Date(t.submittedAt).toLocaleDateString('en-IN')
          }))
      };
    }).filter(Boolean); // Remove nulls if testRecord was missing

    leaderboard.sort((a, b) => b.totalScore - a.totalScore || b.accuracy - a.accuracy);

    res.json({ success: true, data: leaderboard });
  } catch (err) {
    console.error('Error fetching test leaderboard:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




module.exports = {
  createTest,
  getTests,
  softDeleteTest,
  restoreTest,
  editTest,
  startTest,
  submitTest,
  getTestById,
  checkIfAttempted,
  getLeaderboardByTestId,
  getOverallLeaderboard,
  getTestLeaderboard
};

