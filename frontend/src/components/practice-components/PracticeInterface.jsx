import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, Check, X, ChevronDown, Filter } from 'lucide-react';
import subjectService from '../../service/subjectService';
import topicService from '../../service/topicService';
import questionService from '../../service/questionService';

const PracticeInterface = ({ subjectId, topicId }) => {
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [topicDetails, setTopicDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const subjectRes = await subjectService.getSubjectDetails(subjectId);
        const topicRes = await topicService.getTopicDetails(topicId);
        const questionRes = await questionService.listQuestions({ topicId });

        setSubjectDetails(subjectRes.data);
        setTopicDetails(topicRes.data);
        setQuestions(questionRes.data);
      } catch (error) {
        console.error('Error loading practice data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId, topicId]);

  const filteredQuestions = selectedDifficulty === 'All'
    ? questions
    : questions.filter(q => q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());

  const question = filteredQuestions[currentQuestion];

  useEffect(() => {
    const attempt = attempts[currentQuestion];
    if (attempt) {
      setSelectedAnswer(attempt.selectedAnswer);
      setAnswered(true);
      setShowSolution(true);
    } else {
      setSelectedAnswer(null);
      setAnswered(false);
      setShowSolution(false);
    }
    setShowHint(false);
  }, [currentQuestion, attempts]);

  const handleAnswerSelect = (answerIndex) => {
    if (answered || attempts[currentQuestion]) return;

    const isCorrect = question.options[answerIndex] === question.correct_answer;

    setAttempts(prev => ({
      ...prev,
      [currentQuestion]: { selectedAnswer: answerIndex, isCorrect }
    }));

    setSelectedAnswer(answerIndex);
    setAnswered(true);
    setShowSolution(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleBackClick = () => {
    navigate(`/learn/practice/subject/${subjectId}`);
  };

  const getOptionColor = (index) => {
    if (!answered) return 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';

    if (question.options[index] === question.correct_answer) {
      return 'border-green-500 bg-green-50 text-green-800';
    }

    if (index === selectedAnswer && question.options[index] !== question.correct_answer) {
      return 'border-red-500 bg-red-50 text-red-800';
    }

    return 'border-gray-200 text-gray-600';
  };

  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="h-2 bg-gray-200 rounded-full w-full mb-8"></div>
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded w-full"></div>
          ))}
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
        </div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600">
        <p className="text-lg">No questions found for selected difficulty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between mb-6">
        <button onClick={handleBackClick} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Topics
        </button>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">Score: {score}/{filteredQuestions.length}</div>
          <div className="relative">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <Filter className="w-4 h-4" />
              <span className="text-sm">{selectedDifficulty}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => {
                        setSelectedDifficulty(difficulty);
                        setShowFilters(false);
                        setCurrentQuestion(0);
                        setSelectedAnswer(null);
                        setAnswered(false);
                        setShowHint(false);
                        setShowSolution(false);
                        setAttempts({});
                        setScore(0);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {difficulty}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{subjectDetails?.name} - {topicDetails?.name}</h1>
          <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {filteredQuestions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div className="bg-blue-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            {/* Question Text */}
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {question.question}
            </h2>

            {/* Hint Button aligned right */}
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm">Hint</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden transition-all duration-300" style={{ height: showHint ? 'auto' : 0, opacity: showHint ? 1 : 0 }}>
            <motion.div
              initial={false}
              animate={{ opacity: showHint ? 1 : 0 }}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg"
            >
              <p className="text-yellow-800 text-sm">💡 {question.hint}</p>
            </motion.div>
          </div>

          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={answered}
                whileHover={!answered ? { scale: 1.02 } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${getOptionColor(index)}`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {answered && option === question.correct_answer && (
                    <Check className="w-5 h-5 ml-auto text-green-600" />
                  )}
                  {answered && index === selectedAnswer && option !== question.correct_answer && (
                    <X className="w-5 h-5 ml-auto text-red-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showSolution && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
                <h4 className="font-medium text-blue-800 mb-2">Solution:</h4>
                <p className="text-blue-700 text-sm">{question.solution}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between">
            <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              Previous
            </button>
            <button onClick={handleNextQuestion} disabled={currentQuestion === filteredQuestions.length - 1} className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              {currentQuestion === filteredQuestions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PracticeInterface;
