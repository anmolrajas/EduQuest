const express = require("express");
const { 
    createQuestion,
    listQuestions,
    questionDetails,
    editQuestion,
    deleteQuestion,
    restoreQuestion
} = require("../controller/question");
const router = express.Router();

router.get("/list", listQuestions);
router.post("/create", createQuestion);
router.get("/question-details", questionDetails);
router.put("/edit", editQuestion);
router.post("/delete", deleteQuestion);
router.post("/restore", restoreQuestion);

module.exports = router;