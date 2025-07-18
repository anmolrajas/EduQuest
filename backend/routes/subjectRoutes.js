const express = require("express");
const { createSubject, listSubjects, subjectDetails, editSubject, deleteSubject, restoreSubject, getSubjectNames } = require("../controller/subject");
const router = express.Router();

router.get("/list", listSubjects);
router.post("/create", createSubject);
router.get("/subject-details", subjectDetails);
router.put("/edit", editSubject);
router.post("/delete", deleteSubject);
router.post("/restore", restoreSubject);
router.get('/get-subject-names', getSubjectNames);

module.exports = router;