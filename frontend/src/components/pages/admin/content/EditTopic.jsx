import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    MenuItem
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import topicService from '../../../../service/topicService';
import subjectService from '../../../../service/subjectService';

const EditTopic = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topicId = searchParams.get('topicId');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        topicId: '',
        subjectId: ''
    });

    const [subjects, setSubjects] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [topicRes, subjectRes] = await Promise.all([
                    topicService.getTopicDetails(topicId),
                    subjectService.listSubjects()
                ]);

                if (topicRes?.success && subjectRes?.success) {
                    const { name, desc, slug, subjectId } = topicRes.data;
                    setFormData({
                        name: name || '',
                        description: desc || '',
                        topicId: slug || '',
                        subjectId: subjectId?._id || ''
                    });
                    setSubjects(subjectRes.data);
                } else {
                    toast.error('Failed to fetch topic or subjects');
                    navigate(-1);
                }
            } catch (err) {
                console.error("Error fetching topic details:", err);
                toast.error("Something went wrong!");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [topicId, navigate]);

    useEffect(() => {
        const slug = formData.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        setFormData((prev) => ({ ...prev, topicId: slug }));
    }, [formData.name]);

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = true;
        if (!formData.subjectId) tempErrors.subjectId = true;
        return tempErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fill all required fields!');
            return;
        }
        try {
            const response = await topicService.editTopic(topicId, formData);
            if (response?.success) {
                toast.success("Topic updated successfully!");
                setTimeout(() => navigate(-1), 1500);
            } else {
                toast.error(response?.msg || "Failed to update topic.");
            }
        } catch (error) {
            console.error("Error while updating topic:", error);
            toast.error("Something went wrong!");
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box px={2} py={4} width="100%">
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Edit Topic
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                    <TextField
                        label="Topic Name"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange('name')}
                        error={errors.name}
                        helperText={errors.name && 'Topic name is required'}
                        autoComplete="off"
                    />

                    <TextField
                        label="Topic Slug (Auto)"
                        variant="outlined"
                        fullWidth
                        value={formData.topicId}
                        disabled
                    />

<TextField
                        select
                        label="Subject"
                        fullWidth
                        value={formData.subjectId}
                        onChange={handleChange('subjectId')}
                        error={errors.subjectId}
                        helperText={errors.subjectId && 'Subject is required'}
                    >
                        {subjects.map((subj) => (
                            <MenuItem key={subj._id} value={subj._id}>
                                {subj.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={3}
                        autoComplete="off"
                        fullWidth
                        value={formData.description}
                        onChange={handleChange('description')}
                    />

                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default EditTopic;
