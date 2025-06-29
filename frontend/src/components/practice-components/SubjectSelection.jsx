import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Book,
  Calculator,
  Atom,
  Globe,
  Palette,
  Music,
  Code
} from 'lucide-react';
import subjectService from '../../service/subjectService'; // Adjust this import path
import { toast } from 'react-toastify'; // Optional for notifications

// Icon map based on subject name
const iconMap = {
  mathematics: Calculator,
  physics: Atom,
  chemistry: Book,
  history: Globe,
  art: Palette,
  music: Music,
  programming: Code,
  literature: Book
};

// Color pool for background colors
const colorPool = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-gray-700'
];

// Utility to get icon component
const getIconComponent = (name) => {
  return iconMap[name.toLowerCase()] || Book;
};

// Utility to get color based on index
const getColorByIndex = (index) => {
  return colorPool[index % colorPool.length];
};

const SubjectSelection = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.listSubjects();
      if (res.success) {
        setSubjects(res.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Error fetching subjects');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubjectClick = (subjectId) => {
    navigate(`/learn/practice/subject/${subjectId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Practice Hub</h1>
        <p className="text-gray-600 text-lg">
          Choose a subject to start practicing
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative max-w-md mx-auto mb-8"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
        />
      </motion.div>

      {/* Subject Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredSubjects.map((subject, index) => {
          const IconComponent = getIconComponent(subject.name);
          const bgColor = getColorByIndex(index);

          return (
            <motion.div
              key={subject.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSubjectClick(subject._id)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div
                className={`${bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {subject.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {subject.topics_count} topics available
              </p>
              <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                <span className="text-sm font-medium">Start Practice</span>
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  →
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* No results */}
      {filteredSubjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <p className="text-gray-600 text-lg">
            No subjects found matching your search.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SubjectSelection;
