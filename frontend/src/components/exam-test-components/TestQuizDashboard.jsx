import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, BookOpen, Trophy, ChevronRight, Target, Award, Zap } from 'lucide-react';
import testService from '../../service/testService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contextData/AuthContextData';

const TestQuizDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const testTypes = ['all', 'practice', 'assessment', 'exam'];
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const { user } = useContext(AuthContext); // Assuming userContext gives you userId

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const params = {};

        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        if (selectedFilter !== 'all') {
          params.type = selectedFilter;
        }

        const res = await testService.getTests(params);

        if (res.success) {
          setTests(res.data); // or res.tests depending on your API
        } else {
          setTests([]);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [searchTerm, selectedFilter]);

  const handleCardClick = async (testId) => {
    try {
      const res = await testService.checkIfAttempted(testId, user._id);
      if (res.success && res.alreadyAttempted) {
        setSelectedTestId(testId);
        setShowConfirmModal(true);
      } else {
        navigate(`/tests/test-dashboard/start-test/${testId}`);
      }
    } catch (error) {
      console.error('Error checking attempt status:', error);
      navigate(`/tests/test-dashboard/start-test/${testId}`);
    }
  };


  const getTypeColor = (type) => {
    switch (type) {
      case 'practice': return 'bg-green-100 text-green-700 border-green-200';
      case 'assessment': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'exam': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'practice': return <Zap className="h-4 w-4" />;
      case 'assessment': return <Target className="h-4 w-4" />;
      case 'exam': return <Award className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const ConfirmModal = ({ open, onClose, onConfirm }) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Test Already Attempted</h2>
          <p className="text-gray-600 mb-6">
            You have already given this test. Reattempting will not affect your score.
            Do you still want to continue?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reattempt
            </button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Test Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Challenge yourself with our comprehensive test collection and boost your skills
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4"
        >
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tests by title, subject, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-12 pr-8 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm min-w-[160px]"
            >
              {testTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-gray-600 text-lg">
            Found <span className="font-semibold text-indigo-600">{tests.length}</span> tests
          </p>
        </motion.div>

        {/* Tests Grid */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {tests.map((test, index) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="relative group cursor-pointer"
                onClick={() => handleCardClick(test._id)}
                onMouseEnter={() => setHoveredCard(test._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100/50 group-hover:border-indigo-200">
                  {/* Header Section */}
                  <div className="p-8 pb-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-sm font-medium ${getTypeColor(test.type)}`}>
                        {getTypeIcon(test.type)}
                        <span className="capitalize">{test.type}</span>
                      </div>
                      <motion.div
                        animate={{ x: hoveredCard === test._id ? 6 : 0, rotate: hoveredCard === test._id ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                      </motion.div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 mb-3">
                      {test.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {test.description}
                    </p>

                    {/* Subject and Topics */}
                    <div className="mb-6">
                      <div className="text-sm text-gray-500 mb-2">Subject</div>
                      <div className="text-indigo-600 font-semibold mb-3">{test.subjectId.name}</div>
                      
                      <div className="text-sm text-gray-500 mb-2">Topics</div>
                      <div className="flex flex-wrap gap-2">
                        {test.topicIds.map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100"
                          >
                            {topic.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="px-8 pb-8">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-blue-600">{test.duration}</div>
                        <div className="text-xs text-blue-500 font-medium">Minutes</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                        <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-green-600">{test.totalQuestions}</div>
                        <div className="text-xs text-green-500 font-medium">Questions</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                        <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-purple-600">{test.totalMarks}</div>
                        <div className="text-xs text-purple-500 font-medium">Marks</div>
                      </div>
                    </div>

                    {/* Negative Marking Indicator */}
                    {/* {test.allowNegativeMarking && (
                      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-700 text-sm font-medium">Negative marking enabled</span>
                        </div>
                      </div>
                    )} */}
                  </div>

                  {/* Hover Effect Gradient */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === test._id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none rounded-3xl"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {tests.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Trophy className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No tests found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search terms or filters</p>
          </motion.div>
        )}
      </div>
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          navigate(`/tests/test-dashboard/start-test/${selectedTestId}`);
        }}
      />
    </div>
  );
};

export default TestQuizDashboard;