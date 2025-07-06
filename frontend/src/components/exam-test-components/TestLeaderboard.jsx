import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import testService from '../../service/testService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Target, 
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const TestLeaderboard = () => {
  const { testId } = useParams();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await testService.getLeaderboard(testId);
        if (res.success) {
          // Sort by score for proper ranking
          const sortedLeaders = res.data.sort((a, b) => b.score - a.score);
          setLeaders(sortedLeaders);
        }
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [testId]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRankBadge = (rank) => {
    const badges = {
      1: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      2: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
      3: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
    };
    return badges[rank] || 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
  };

  const getPerformanceColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-emerald-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-500';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const podiumVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        delay: 0.2
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-purple-200 border-t-purple-600"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-lg font-medium"
          >
            Loading Leaderboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const topThree = leaders.slice(0, 3);
  const remainingLeaders = leaders.slice(3);
  const maxScore = Math.max(...leaders.map(l => l.score));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 sm:py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 sm:mb-6 shadow-lg"
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3"
          >
            <span className="hidden sm:inline">Champions Leaderboard</span>
            <span className="sm:hidden">Leaderboard</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 text-lg sm:text-xl"
          >
            <span className="hidden sm:inline">Celebrating our top performers</span>
            <span className="sm:hidden">Top performers</span>
          </motion.p>
        </div>

        {/* Podium for Top 3 */}
        {topThree.length > 0 && (
          <motion.div
            variants={podiumVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <div className="flex items-end justify-center space-x-2 sm:space-x-4 mb-6 max-w-2xl mx-auto">
              {/* Second Place */}
              {topThree[1] && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center flex-1 max-w-[140px]"
                >
                  <div className="bg-gradient-to-r from-gray-300 to-gray-500 rounded-t-xl p-3 sm:p-4 shadow-xl">
                    <img
                      src={topThree[1].profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${topThree[1].name}`}
                      alt="avatar"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2 ring-2 ring-white shadow-lg"
                    />
                    <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1" />
                    <h3 className="text-white font-bold text-sm sm:text-base truncate">{topThree[1].name}</h3>
                    <p className="text-gray-100 text-lg sm:text-xl font-bold">{topThree[1].score}</p>
                  </div>
                  <div className="bg-gray-400 h-12 sm:h-16 rounded-b-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-lg">2nd</span>
                  </div>
                </motion.div>
              )}

              {/* First Place */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center flex-1 max-w-[160px]"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-xl p-4 sm:p-5 shadow-xl relative">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5"
                  >
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </motion.div>
                  <img
                    src={topThree[0].profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${topThree[0].name}`}
                    alt="avatar"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-2 ring-2 ring-white shadow-lg"
                  />
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto mb-1" />
                  <h3 className="text-white font-bold text-sm sm:text-lg truncate">{topThree[0].name}</h3>
                  <p className="text-yellow-100 text-xl sm:text-2xl font-bold">{topThree[0].score}</p>
                </div>
                <div className="bg-yellow-500 h-16 sm:h-20 rounded-b-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl">1st</span>
                </div>
              </motion.div>

              {/* Third Place */}
              {topThree[2] && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center flex-1 max-w-[140px]"
                >
                  <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-t-xl p-3 sm:p-4 shadow-xl">
                    <img
                      src={topThree[2].profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${topThree[2].name}`}
                      alt="avatar"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2 ring-2 ring-white shadow-lg"
                    />
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1" />
                    <h3 className="text-white font-bold text-sm sm:text-base truncate">{topThree[2].name}</h3>
                    <p className="text-amber-100 text-lg sm:text-xl font-bold">{topThree[2].score}</p>
                  </div>
                  <div className="bg-amber-500 h-10 sm:h-12 rounded-b-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-lg">3rd</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Remaining Leaders */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                <span className="hidden sm:inline">Full Rankings</span>
                <span className="sm:hidden">Rankings</span>
              </h2>
              <div className="text-xs sm:text-sm text-gray-500">
                {leaders.length} participants
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {leaders.map((user, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    layout
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                    }}
                    onClick={() => setSelectedUser(selectedUser === idx ? null : idx)}
                    className="bg-gradient-to-r from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 border border-gray-100 hover:border-purple-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                        {/* Rank Badge */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${getRankBadge(idx + 1)} shadow-lg flex-shrink-0`}>
                          <span className="font-bold text-sm sm:text-lg">{idx + 1}</span>
                        </div>

                        {/* Rank Icon */}
                        <div className="hidden sm:block flex-shrink-0">
                          {getRankIcon(idx + 1)}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <img
                            src={user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                            alt="avatar"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-gray-200 shadow-md flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900 text-sm sm:text-lg truncate">{user.name}</p>
                            <p className="text-gray-500 text-xs sm:text-sm truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        {/* Score */}
                        <div className="text-right">
                          <p className={`text-lg sm:text-2xl font-bold ${getPerformanceColor(user.score, maxScore)}`}>
                            {user.score}
                          </p>
                          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 justify-end">
                            <Target className="w-4 h-4" />
                            <span>{user.correct || 0} correct</span>
                          </div>
                          <div className="sm:hidden text-xs text-gray-500">
                            {user.correct || 0} correct
                          </div>
                        </div>

                        {/* Expand Arrow */}
                        <motion.div
                          animate={{ rotate: selectedUser === idx ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedUser === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                            <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                              <p className="text-lg sm:text-2xl font-bold text-green-600">{user.correct || 0}</p>
                              <p className="text-xs sm:text-sm text-gray-600">Correct</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-2 sm:p-3">
                              <p className="text-lg sm:text-2xl font-bold text-red-600">{user.wrong || 0}</p>
                              <p className="text-xs sm:text-sm text-gray-600">Wrong</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                              <p className="text-lg sm:text-2xl font-bold text-blue-600">
                                {user.correct && user.wrong ? 
                                  Math.round((user.correct / (user.correct + user.wrong)) * 100) : 0}%
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">Accuracy</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
                              <p className="text-lg sm:text-2xl font-bold text-purple-600">{user.score}</p>
                              <p className="text-xs sm:text-sm text-gray-600">Score</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Statistics Footer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {leaders.length}
            </div>
            <div className="text-gray-600">Total Participants</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {maxScore}
            </div>
            <div className="text-gray-600">Highest Score</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {leaders.length > 0 ? Math.round(leaders.reduce((acc, user) => acc + user.score, 0) / leaders.length) : 0}
            </div>
            <div className="text-gray-600">Average Score</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TestLeaderboard;