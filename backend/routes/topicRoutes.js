const express = require("express");
const { createTopic, listTopics, topicDetails, editTopic, deleteTopic, restoreTopic, getTopicNames } = require("../controller/topic");
const router = express.Router();

router.get("/list", listTopics);
router.post("/create", createTopic);
router.get("/topic-details", topicDetails);
router.put("/edit", editTopic);
router.post("/delete", deleteTopic);
router.post("/restore", restoreTopic);
router.get('/get-topic-names', getTopicNames);


module.exports = router;