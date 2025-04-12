const Subject = require('../model/subject');

const createSubject = async (req, res) => {
    try {
        const { name, desc, slug } = req.body;
        console.log("req body", req.body);
        const exists = await Subject.findOne({ slug });
        if (exists) {
            return res.status(400).json({ success: false, msg: "Slug already exists!" });
        }

        const newSubject = new Subject({
            name,
            desc,
            slug,
            topics_count: 0
        });

        const saved = await newSubject.save();

        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        console.error(err);

        if (err.code === 11000 && err.keyPattern.slug) {
            return res.status(400).json({ success: false, msg: "Slug must be unique." });
        }

        res.status(500).json({ success: false, msg: "Something went wrong!" });
    }
};

const listSubjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const query = search
            ? { name: { $regex: search, $options: 'i' } } // case-insensitive search
            : {};

        const total = await Subject.countDocuments(query);

        const subjects = await Subject.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: subjects,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Failed to fetch subjects." });
    }
};

const subjectDetails = async (req, res) => {
    try {
        const { subjectId } = req.query;

        if (!subjectId) {
            return res.status(400).json({ success: false, msg: "Subject ID is required." });
        }

        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return res.status(404).json({ success: false, msg: "Subject not found." });
        }

        res.status(200).json({ success: true, data: subject });
    } catch (err) {
        console.error("Error fetching subject details:", err);
        res.status(500).json({ success: false, msg: "Failed to fetch subject details." });
    }
};

const editSubject = async (req, res) => {
    try {
        const { subjectId } = req.query;
        const { name, desc, slug } = req.body;

        if (!subjectId) {
            return res.status(400).json({ success: false, msg: "Subject ID is required." });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ success: false, msg: "Subject not found." });
        }

        // Check for slug duplication (excluding current subject)
        const slugExists = await Subject.findOne({ slug, _id: { $ne: subjectId } });
        if (slugExists) {
            return res.status(400).json({ success: false, msg: "Slug already exists." });
        }

        // Update fields
        subject.name = name;
        subject.desc = desc;
        subject.slug = slug;

        const updated = await subject.save();

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error("Error updating subject:", err);
        res.status(500).json({ success: false, msg: "Failed to update subject." });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const { subjectId } = req.body;

        if (!subjectId) {
            return res.status(400).json({ success: false, msg: "Subject ID is required." });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ success: false, msg: "Subject not found." });
        }

        subject.status = false; // marking as deleted
        await subject.save();

        res.status(200).json({ success: true, msg: "Subject deleted successfully." });
    } catch (error) {
        console.error("Error deleting subject:", error);
        res.status(500).json({ success: false, msg: "Failed to delete subject." });
    }
};

const restoreSubject = async (req, res) => {
    try {
        const { subjectId } = req.body;

        if (!subjectId) {
            return res.status(400).json({ success: false, msg: "Subject ID is required." });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ success: false, msg: "Subject not found." });
        }

        subject.status = true; // marking as restored
        await subject.save();

        res.status(200).json({ success: true, msg: "Subject restored successfully." });
    } catch (error) {
        console.error("Error restoring subject:", error);
        res.status(500).json({ success: false, msg: "Failed to restore subject." });
    }
};

module.exports = {
    createSubject,
    listSubjects,
    subjectDetails,
    editSubject,
    deleteSubject,
    restoreSubject
}
