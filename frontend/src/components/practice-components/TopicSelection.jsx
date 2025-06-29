import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, BookOpen, FileText } from 'lucide-react';
import subjectService from '../../service/subjectService';
import topicService from '../../service/topicService';

const TopicSelection = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subjectDetails, setSubjectDetails] = useState(null);
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subject = await subjectService.getSubjectDetails(subjectId);
        const topicList = await topicService.listTopics(subjectId);
        setSubjectDetails(subject.data || subjectId);
        setTopics(topicList.data || []);
      } catch (error) {
        console.error('Error fetching subject or topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTopicClick = (topicId) => {
    navigate(`/learn/practice/${subjectId}/${topicId}`);
  };

  const handleBackClick = () => {
    navigate('/learn/practice');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-gray-500">Loading topics...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-6"
      >
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Subjects
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2 capitalize">{subjectDetails?.name || subjectId} Topics</h1>
        <p className="text-gray-600 text-lg">Select a topic to start practicing</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative max-w-md mx-auto mb-8"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredTopics.map((topic) => (
          <motion.div
            key={topic._id}
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTopicClick(topic._id)}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-l-4 border-blue-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">{topic.name}</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{topic.questions_count} questions</span>
              </div>

              <div className="flex items-start text-gray-600 text-sm">
                <FileText className="w-4 h-4 mt-0.5 mr-2 text-gray-500" />
                <span className="line-clamp-2">{topic.desc || 'No description available.'}</span>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-200">
                    Start Practice
                  </span>
                  <motion.div
                    className="text-blue-600"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    →
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredTopics.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <p className="text-gray-600 text-lg">No topics found matching your search.</p>
        </motion.div>
      )}
    </div>
  );
};

export default TopicSelection;
