import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Target,
  TrendingUp,
  BarChart3,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import testService from '../../service/testService';

const ComprehensiveLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState('overall');
  const [testOptions, setTestOptions] = useState([{ value: 'overall', label: 'Overall Leaderboard' }]);
  const [expandedUser, setExpandedUser] = useState(null);

  const fetchLeaderboardData = async (testId) => {
    setLoading(true);
    try {
      const res = testId === 'overall'
        ? await testService.getOverallLeaderboard()
        : await testService.getTestLeaderboard(testId);
      setLeaderboardData(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await testService.getTests();
      const testDropdowns = res?.data?.map(test => ({
        value: test._id,
        label: test.title
      })) || [];
      setTestOptions([{ value: 'overall', label: 'Overall Leaderboard' }, ...testDropdowns]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    fetchLeaderboardData(selectedTest);
  }, [selectedTest]);

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
      1: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      2: 'bg-gradient-to-r from-gray-300 to-gray-500',
      3: 'bg-gradient-to-r from-amber-400 to-amber-600'
    };
    return badges[rank] || 'bg-gradient-to-r from-blue-400 to-blue-600';
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return '#10B981';
    if (accuracy >= 80) return '#3B82F6';
    if (accuracy >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const CircularProgress = ({ value, size = 64, strokeWidth = 6, className = "" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getAccuracyColor(value)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color: getAccuracyColor(value) }}>
            {Math.round(value)}%
          </span>
        </div>
      </div>
    );
  };

  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="text-right space-y-2">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const chartData = leaderboardData.map((user, idx) => ({
    name: user.name.split(' ')[0],
    accuracy: user.accuracy,
    rank: idx + 1
  }));

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-xl">
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Performance Leaderboard
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl mb-6">
            Track your progress and compete with others
          </p>
          <div className="max-w-sm mx-auto">
            <div className="relative">
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                {testOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Rankings */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                  Rankings
                </h2>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {leaderboardData.length} participants
                </div>
              </div>
              {loading ? (
                <SkeletonLoader />
              ) : (
                <div className="space-y-4">
                  {leaderboardData.map((user, idx) => (
                    <div
                      key={user.id}
                      className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-purple-200 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                      onClick={() => setExpandedUser(expandedUser === idx ? null : idx)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${getRankBadge(idx + 1)}`}>
                            {idx + 1}
                          </div>
                          <div className="hidden sm:block">{getRankIcon(idx + 1)}</div>
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-gray-900 text-lg truncate">{user.name}</p>
                              <p className="text-gray-500 text-sm truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="hidden sm:block">
                            <CircularProgress value={user.accuracy} size={64} />
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600">{user.totalScore}</p>
                            <p className="text-sm text-gray-500">{user.totalTests} tests</p>
                            <p className="text-sm text-gray-500 sm:hidden">{user.accuracy}% accuracy</p>
                          </div>
                        </div>
                      </div>
                      {expandedUser === idx && (
                        <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Recent Tests
                              </h4>
                              <div className="space-y-2">
                                {user.recentTests.map((test, testIdx) => (
                                  <div key={testIdx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                      <p className="font-medium text-sm">{test.name}</p>
                                      <p className="text-xs text-gray-500">{test.date}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-blue-600">{test.score}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <Target className="w-4 h-4 mr-2" />
                                Performance Stats
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-purple-50 p-3 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-purple-600">{user.totalScore}</p>
                                  <p className="text-xs text-gray-600">Total Score</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-blue-600">{user.accuracy}%</p>
                                  <p className="text-xs text-gray-600">Accuracy</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-green-600">{user.testsTaken}</p>
                                  <p className="text-xs text-gray-600">Tests</p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-yellow-600">
                                    {Math.round(user.totalScore / user.testsTaken)}
                                  </p>
                                  <p className="text-xs text-gray-600">Avg Score</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Accuracy Overview */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Accuracy Overview
              </h3>
              {loading ? (
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getAccuracyColor(entry.accuracy)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveLeaderboard;
