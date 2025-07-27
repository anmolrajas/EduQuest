const express = require('express');
const router = express.Router();
const inviteController = require('../controller/inviteController');

// Send invite (protected: only current admins can invite)
router.post('/invite-admin', inviteController.inviteAdmin);

// Verify invite (used by frontend when user clicks the link)
router.get('/verify-invite', inviteController.verifyInvite);

// Accept invite if user already has an account
router.post('/accept-invite', inviteController.acceptInvite);

// Signup with invite (if user does not exist)
router.post('/signup-with-invite', inviteController.signupWithInvite);

module.exports = router;
