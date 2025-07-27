import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, BookOpen, Play, ArrowRight, ArrowLeft, Lightbulb, X, Trophy, User, Calendar, Target, Goal } from 'lucide-react';
import testService from '../../service/testService';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from "../../contextData/AuthContextData";
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

const TestScreen = () => {
  const [currentScreen, setCurrentScreen] = useState('instructions'); // 'instructions' or 'test'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testData, setTestData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { testId } = useParams();
  const { user } = useContext(AuthContext);
  const COLORS = ['#10B981', '#EF4444', '#E5E7EB'];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await testService.startTest(testId); // ensure it returns { success, data }
        if (response?.success && response.data) {
          setTestData(response.data);
        } else {
          throw new Error(response?.message || 'Failed to start test');
        }
      } catch (err) {
        console.error('Error starting test:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, []);


  // Timer effect
  useEffect(() => {
    if (currentScreen === 'test' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentScreen, timeLeft]);

  const startTest = () => {
    setCurrentScreen('test');
    setTimeLeft(testData?.duration * 60); // duration in minutes
  };

  const handleAnswerSelect = (optionIndex) => {
    const selectedOptionText = testData.questions[currentQuestion].options[optionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: selectedOptionText
    }));
  };


  const handleSubmitTest = async () => {
    if (!user || !user._id) {
      toast.error('User not found. Please login again.');
      return;
    }

    const formattedAnswers = Object.entries(selectedAnswers).map(([index, selectedText]) => {
      const question = testData.questions[index];
      return {
        questionId: question._id,
        selectedOption: selectedText,
      };
    });

    const payload = {
      testId,
      userId: user._id,
      answers: formattedAnswers,
    };

    try {
      const response = await testService.submitTest(payload);
      if (response.success) {
        setIsSubmitted(true);
        console.log('Submitted test result:', response.data);
        setResponseData(response.data);
      } else {
        toast.error(response.message || 'Submission failed.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Error submitting test. Please try again.');
    }
  };


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'text-green-500 bg-green-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      case 'hard': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const goToLeaderboard = () => {
    navigate(`/tests/leaderboard/${testId}`)
  }

  const getAnsweredCount = () => {
    return Object.keys(selectedAnswers).length;
  };

  if (currentScreen === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"
              >
                <BookOpen className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{testData?.title}</h1>
              <p className="text-lg text-gray-600">{testData?.description}</p>
            </div>

            {/* Test Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <Clock className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Duration</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">{testData?.duration} min</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <Target className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">{testData?.questions.length}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <Trophy className="w-6 h-6 text-purple-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Total Marks</h3>
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  {testData?.questions.reduce((sum, q) => sum + q.marks, 0)}
                </p>
              </motion.div>
            </div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="w-6 h-6 text-amber-500 mr-3" />
                Test Instructions
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <p className="text-gray-700">Read each question carefully before selecting your answer.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <p className="text-gray-700">You can navigate between questions using the navigation buttons.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <p className="text-gray-700">Use the hint button if you need help with a question.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <p className="text-gray-700">The test will auto-submit when time runs out.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">5</span>
                  </div>
                  <p className="text-gray-700">Make sure to answer all questions before submitting.</p>
                </div>
              </div>
            </motion.div>

            {/* Start Test Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <button
                onClick={startTest}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Test
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderResultScreen = () => {
    const { score, correct, wrong, total, maxMarks, stored } = responseData || {};

    const percentage = Math.round((score / maxMarks) * 100);
    const data = [
      { name: 'Correct', value: correct },
      { name: 'Wrong', value: wrong },
      { name: 'Unanswered', value: total - correct - wrong },
    ];

    const emoji = percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '📚';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-green-50 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-10 shadow-xl max-w-xl w-full text-center"
        >
          <div className="mb-6">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-extrabold text-gray-900"
            >
              Your Result {emoji}
            </motion.h2>
            <p className="text-gray-600 mt-2">
              {stored
                ? "Well done! Your score is saved 🎯"
                : "You've already submitted this test 📝"}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <PieChart width={220} height={220}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-2 gap-4 text-left mb-6"
          >
            <div>
              <p className="text-gray-500">Score</p>
              <p className="text-xl font-bold text-blue-600">{score} / {maxMarks}</p>
            </div>
            <div>
              <p className="text-gray-500">Accuracy</p>
              <p className="text-xl font-bold text-indigo-600">{percentage}%</p>
            </div>
            <div>
              <p className="text-gray-500">Correct</p>
              <p className="text-xl font-bold text-green-600">{correct}</p>
            </div>
            <div>
              <p className="text-gray-500">Wrong</p>
              <p className="text-xl font-bold text-red-500">{wrong}</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg"
            onClick={goToLeaderboard}
          >
            🏆 View Leaderboard
          </motion.button>
        </motion.div>
      </div>
    );
  };

  if (isSubmitted && responseData) {
    return renderResultScreen();
  }


  const currentQ = testData?.questions[currentQuestion];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading test...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!testData) {
    return null; // edge case: data not loaded yet
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left side: Test title and question info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
              <h1 className="text-2xl font-bold text-gray-900">{testData?.title}</h1>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {testData?.questions.length}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQ.difficulty)}`}>
                  {currentQ.difficulty}
                </span>
              </div>
            </div>

            {/* Right side: Timer + Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <div className="flex items-center text-lg font-semibold">
                <Clock className="w-5 h-5 text-red-500 mr-2" />
                <span className={timeLeft <= 60 ? 'text-red-500' : 'text-gray-700'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={handleSubmitTest}
                className="mt-2 sm:mt-0 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Submit Test
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / testData?.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Question {currentQuestion + 1}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">+{currentQ.marks} marks</span>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Show hint"
                    >
                      <Lightbulb className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-lg text-gray-800 leading-relaxed">{currentQ.question}</p>
                  {currentQ.question_image && (
                    <img src={currentQ.question_image} alt="Question" className="mt-4 rounded-lg max-w-full" />
                  )}
                </div>

                <div
                  className={`transition-all duration-300 overflow-hidden mb-6 ${showHint ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'
                    }`}
                >
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
                        <span className="font-medium text-amber-800">Hint</span>
                      </div>
                      <button
                        onClick={() => setShowHint(false)}
                        className="text-amber-500 hover:text-amber-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-amber-700 mt-2">{currentQ.hint}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left border-2 rounded-xl transition-all ${selectedAnswers[currentQuestion] === option
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${selectedAnswers[currentQuestion] === option
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                          }`}>
                          {selectedAnswers[currentQuestion] === option && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-base">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              <button
                onClick={() => setCurrentQuestion(Math.min(testData?.questions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === testData?.questions.length - 1}
                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {testData?.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    title={selectedAnswers[index] || ''}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${currentQuestion === index
                        ? 'bg-blue-500 text-white'
                        : selectedAnswers[index]
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium text-green-600">{getAnsweredCount()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-gray-600">{testData?.questions.length - getAnsweredCount()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestScreen;