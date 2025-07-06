const express = require("express");
const { userSignUp, userLogin, getUserDashboardStats } = require("../controller/user");
const router = express.Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get('/dashboard-stats', getUserDashboardStats);

module.exports = router;