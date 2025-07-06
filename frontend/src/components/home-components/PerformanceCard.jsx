import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "@mui/icons-material";

// Utility to convert date to day abbreviation (e.g., "Mon", "Tue")
const getDayAbbreviation = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue, ...
};

const PerformanceCard = ({ dashboardData }) => {
  const data =
    dashboardData?.weeklyPerformance?.map((entry) => ({
      name: getDayAbbreviation(entry.date),
      score: entry.score,
    })) || [];

  const currentWeek = dashboardData?.weeklyPerformance || [];
  const firstHalf = currentWeek.slice(0, 3);  // Mon-Tue-Wed
  const secondHalf = currentWeek.slice(4, 7); // Fri-Sat-Sun

  const firstHalfScore = firstHalf.reduce((sum, item) => sum + item.score, 0);
  const secondHalfScore = secondHalf.reduce((sum, item) => sum + item.score, 0);

  const growthPercentage = firstHalfScore === 0
    ? secondHalfScore > 0 ? 100 : 0
    : ((secondHalfScore - firstHalfScore) / firstHalfScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-green-500" />
            Weekly Performance
          </h3>
          <p className="text-gray-600 text-sm">Your progress this week</p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className={`px-3 py-1 rounded-full text-sm font-medium
          ${growthPercentage >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
        >
          {growthPercentage >= 0 ? '+' : ''}
          {growthPercentage.toFixed(1)}% {growthPercentage >= 0 ? '↗' : '↘'}
        </motion.div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#gradient)"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: "#8b5cf6" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PerformanceCard;
