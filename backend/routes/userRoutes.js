const express = require("express");
const { userSignUp, userLogin, getUserDashboardStats, getAllUsers } = require("../controller/user");
const router = express.Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get('/dashboard-stats', getUserDashboardStats);
router.get('/users-list', getAllUsers);

module.exports = router;