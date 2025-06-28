import { motion } from "framer-motion";
import { Avatar, IconButton } from "@mui/material";
import { Settings, Star } from "@mui/icons-material";

const UserProfileCard = ({user}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-1 rounded-3xl shadow-xl"
    >
      <div className="bg-white rounded-3xl p-6 h-full">
              <div className="flex flex-col items-center mb-6">
                  <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                  >
                      <Avatar
                          src="https://cdn.vectorstock.com/i/1000v/51/87/student-avatar-user-profile-icon-vector-47025187.jpg"
                          sx={{ width: 80, height: 80 }}
                          className="border-4 border-white shadow-lg"
                      />
                  </motion.div>

                  {/* Optional: Settings button below avatar, still centered */}
                  {/* <IconButton 
    className="text-gray-600 hover:text-purple-600 transition-colors mt-2"
    size="small"
  >
    <Settings />
  </IconButton> */}
              </div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
                  <div className="flex flex-col items-center space-y-2">
                      {/* User Name & Email */}
                      <div className="text-center">
                          <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                      </div>

                      {/* Role Badge */}
                      <div className="flex items-center gap-2">
                          <Star className="text-yellow-500 text-sm" />
                          <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                              {user.role === "user" ? 'Student' : ''}
                          </span>
                      </div>
                  </div>


          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="text-2xl font-bold text-purple-600"
              >
                245
              </motion.div>
              <p className="text-xs text-gray-500">Tests Completed</p>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="text-2xl font-bold text-orange-500"
              >
                87%
              </motion.div>
              <p className="text-xs text-gray-500">Average Score</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfileCard;