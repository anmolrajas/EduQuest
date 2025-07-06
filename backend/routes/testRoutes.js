const express = require('express');
const {
  createTest,
  getTests,
  softDeleteTest,
  restoreTest,
  startTest,
  submitTest,
  getTestById,
  editTest,
  checkIfAttempted,
  getLeaderboardByTestId,
  getOverallLeaderboard,
  getTestLeaderboard
} = require('../controller/testController');
const router = express.Router();

router.post('/create-test', createTest);
router.get('/list-tests', getTests);
router.patch('/:testId/soft-delete', softDeleteTest);
router.patch('/:testId/restore', restoreTest);
router.put('/edit/:testId', editTest);
router.get('/start-test/:testId', startTest);
router.post('/submit-test', submitTest);
router.get('/get-test/:testId', getTestById);
router.get('/check-attempt', checkIfAttempted);
router.get('/get-leaderboard/:testId', getLeaderboardByTestId);
router.get('/get-overall-leaderboard', getOverallLeaderboard);
router.get('/get-test-leaderboard/:testId', getTestLeaderboard);


module.exports = router;
