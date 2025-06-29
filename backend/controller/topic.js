const Topic = require('../model/topic');
const Subject = require('../model/subject');

// Create a new topic
const createTopic = async (req, res) => {
    try {
        const { name, desc, slug, subjectId } = req.body;
        console.log("Create topic request body:", req.body);

        if (!subjectId) {
            return res.status(400).json({ success: false, msg: "Subject ID is required." });
        }

        const existingSlug = await Topic.findOne({ slug });
        if (existingSlug) {
            return res.status(400).json({ success: false, msg: "Slug already exists!" });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ success: false, msg: "Subject not found." });
        }

        const newTopic = new Topic({
            name,
            desc,
            slug,
            subjectId
        });

        const saved = await newTopic.save();

        await Subject.findByIdAndUpdate(subjectId, {
            $inc: { topics_count: 1 }
        });

        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        console.error("Error creating topic:", err);

        if (err.code === 11000 && err.keyPattern?.slug) {
            return res.status(400).json({ success: false, msg: "Slug must be unique." });
        }

        res.status(500).json({ success: false, msg: "Something went wrong!" });
    }
};


// List all topics
const listTopics = async (req, res) => {
  try {
    const { subjectId } = req.query;

    const query = subjectId ? { subjectId } : {};

    const topics = await Topic.find(query)
      .sort({ createdAt: -1 })
      .populate('subjectId', 'name'); // optional: include only subject name

    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ success: false, msg: "Failed to fetch topics." });
  }
};


// Get details of a single topic
const topicDetails = async (req, res) => {
    try {
        const { topicId } = req.query;

        if (!topicId) {
            return res.status(400).json({ success: false, msg: "Topic ID is required." });
        }

        const topic = await Topic.findById(topicId).populate('subjectId', 'name');

        if (!topic) {
            return res.status(404).json({ success: false, msg: "Topic not found." });
        }

        res.status(200).json({ success: true, data: topic });
    } catch (err) {
        console.error("Error fetching topic details:", err);
        res.status(500).json({ success: false, msg: "Failed to fetch topic details." });
    }
};

// Edit a topic
const editTopic = async (req, res) => {
    try {
        const { topicId } = req.query;
        const { name, desc, slug, subjectId } = req.body;

        if (!topicId) {
            return res.status(400).json({ success: false, msg: "Topic ID is required." });
        }

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ success: false, msg: "Topic not found." });
        }

        const slugExists = await Topic.findOne({ slug, _id: { $ne: topicId } });
        if (slugExists) {
            return res.status(400).json({ success: false, msg: "Slug already exists." });
        }

        if (subjectId) {
            const subject = await Subject.findById(subjectId);
            if (!subject) {
                return res.status(404).json({ success: false, msg: "Subject not found." });
            }
            topic.subjectId = subjectId;
        }

        topic.name = name;
        topic.desc = desc;
        topic.slug = slug;

        const updated = await topic.save();

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error("Error updating topic:", err);
        res.status(500).json({ success: false, msg: "Failed to update topic." });
    }
};

// Soft delete a topic
const deleteTopic = async (req, res) => {
    try {
        const { topicId } = req.body;

        if (!topicId) {
            return res.status(400).json({ success: false, msg: "Topic ID is required." });
        }

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ success: false, msg: "Topic not found." });
        }

        topic.status = false;
        await topic.save();

        res.status(200).json({ success: true, msg: "Topic deleted successfully." });
    } catch (error) {
        console.error("Error deleting topic:", error);
        res.status(500).json({ success: false, msg: "Failed to delete topic." });
    }
};

// Restore a deleted topic
const restoreTopic = async (req, res) => {
    try {
        const { topicId } = req.body;

        if (!topicId) {
            return res.status(400).json({ success: false, msg: "Topic ID is required." });
        }

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ success: false, msg: "Topic not found." });
        }

        topic.status = true;
        await topic.save();

        res.status(200).json({ success: true, msg: "Topic restored successfully." });
    } catch (error) {
        console.error("Error restoring topic:", error);
        res.status(500).json({ success: false, msg: "Failed to restore topic." });
    }
};

const getTopicNames = async (req, res) => {
    try {
        const { subjectId } = req.query;

        const filter = subjectId ? { subjectId } : {};

        const topics = await Topic.find(filter, { _id: 1, name: 1 }).sort({ name: 1 });

        res.status(200).json({ success: true, data: topics });
    } catch (error) {
        console.error("Error fetching topic names:", error);
        res.status(500).json({ success: false, msg: "Failed to fetch topic names." });
    }
};

module.exports = {
    createTopic,
    listTopics,
    topicDetails,
    editTopic,
    deleteTopic,
    restoreTopic,
    getTopicNames
};
