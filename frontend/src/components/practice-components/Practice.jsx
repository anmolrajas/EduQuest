import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SubjectSelection from './SubjectSelection';
import TopicSelection from './TopicSelection';
import PracticeInterface from './PracticeInterface';

const Practice = () => {
  const { subjectId, topicId } = useParams();
  
  const getCurrentView = () => {
    if (topicId) return 'practice';
    if (subjectId) return 'topics';
    return 'subjects';
  };

  const currentView = getCurrentView();

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AnimatePresence mode="wait">
        {currentView === 'subjects' && (
          <motion.div
            key="subjects"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <SubjectSelection />
          </motion.div>
        )}
        {currentView === 'topics' && (
          <motion.div
            key="topics"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <TopicSelection subjectId={subjectId} />
          </motion.div>
        )}
        {currentView === 'practice' && (
          <motion.div
            key="practice"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <PracticeInterface subjectId={subjectId} topicId={topicId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Practice;