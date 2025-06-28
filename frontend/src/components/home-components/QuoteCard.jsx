import { motion } from "framer-motion";
import { FormatQuote, Refresh } from "@mui/icons-material";
import { useState } from "react";

const quotes = [
  "Every expert was once a beginner.",
  "Small progress is still progress!",
  "The only way to learn mathematics is to do mathematics.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
];

const QuoteCard = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 rounded-2xl shadow-lg"
    >
      <div className="bg-white rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FormatQuote className="text-blue-500 text-3xl" />
          <motion.p
            key={currentQuote}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-gray-700 font-medium text-lg italic"
          >
            {quotes[currentQuote]}
          </motion.p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextQuote}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <Refresh className="text-blue-600" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuoteCard;