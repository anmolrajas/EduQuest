const express = require('express');
const router = express.Router();
const emailController = require('../controller/emailController');

router.post('/portfolio-contact-me', emailController.contactMePortfolioEmail);

module.exports = router;