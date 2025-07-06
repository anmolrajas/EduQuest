import { motion } from "framer-motion";
import UserProfileCard from "../home-components/UserProfileCard"
import PerformanceCard from "../home-components/PerformanceCard";
import ActivityOverviewCard from "../home-components/ActivityOverviewCard";
import QuoteCard from "../home-components/QuoteCard";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contextData/AuthContextData";
import userService from "../../service/userService";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (user?._id) {
      userService.getDashboardStats(user._id).then((res) => {
        if (res?.success) setDashboardData(res.data);
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <QuoteCard />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Row */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <UserProfileCard user={user} dashboardData={dashboardData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <ActivityOverviewCard dashboardData={dashboardData} />
          </motion.div>

          {/* Second Row - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-3"
          >
            <PerformanceCard dashboardData={dashboardData} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;