import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import topicService from '../../../../service/topicService';
import subjectService from '../../../../service/subjectService';

const CreateTopic = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        topicId: '',
        subjectId: '',
    });

    const [subjects, setSubjects] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const slug = formData.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        setFormData((prev) => ({ ...prev, topicId: slug }));
    }, [formData.name]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await subjectService.listSubjects();
                if (res?.success) {
                    setSubjects(res.data);
                } else {
                    toast.error('Failed to fetch subjects');
                }
            } catch (err) {
                console.error('Error fetching subjects:', err);
                toast.error('Error fetching subjects');
            }
        };
        fetchSubjects();
    }, []);

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
            const response = await topicService.createTopic(formData);
            if (response?.success) {
                toast.success("New Topic Created!");
                setTimeout(() => navigate(-1), 1500);
            } else {
                toast.error(response?.msg || 'Failed to create topic');
            }
        } catch (error) {
            console.error("Error while creating topic:", error);
            toast.error(error?.response?.data?.msg || 'Error creating topic');
        }
    };

    return (
        <Box px={2} py={4} width="100%">
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Add New Topic
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
                        autoComplete='off'
                    />

                    <TextField
                        label="Topic ID"
                        variant="outlined"
                        fullWidth
                        value={formData.topicId}
                        disabled
                    />

                    <FormControl fullWidth error={errors.subjectId}>
                        <InputLabel>Select Subject</InputLabel>
                        <Select
                            value={formData.subjectId}
                            label="Select Subject"
                            onChange={handleChange('subjectId')}
                        >
                            {subjects.map((subject) => (
                                <MenuItem key={subject._id} value={subject._id}>
                                    {subject.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.subjectId && (
                            <Typography variant="caption" color="error">
                                Subject selection is required
                            </Typography>
                        )}
                    </FormControl>

                    <TextField
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={3}
                        autoComplete='off'
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
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Create
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateTopic;