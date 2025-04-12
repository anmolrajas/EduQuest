import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import subjectService from '../../../../service/subjectService';

const EditSubject = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const subjectId = searchParams.get('subjectId');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subjectId: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await subjectService.getSubjectDetails(subjectId);
                if (res?.success) {
                    const { name, desc, slug } = res.data;
                    setFormData({
                        name: name || '',
                        description: desc || '',
                        subjectId: slug || '',
                    });
                } else {
                    toast.error(res?.msg || 'Failed to fetch subject details');
                    navigate(-1);
                }
            } catch (err) {
                console.error("Error fetching subject details:", err);
                toast.error("Something went wrong!");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subjectId, navigate]);

    useEffect(() => {
        const slug = formData.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        setFormData((prev) => ({ ...prev, subjectId: slug }));
    }, [formData.name]);

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = true;
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
            const response = await subjectService.editSubject(subjectId, formData);
            console.log("Updated subject:", response);
            if (response?.success) {
                toast.success("Subject updated successfully!");
                setTimeout(() => navigate(-1), 1500);
            } else {
                toast.error(response?.msg || "Failed to update subject.");
            }
        } catch (error) {
            console.error("Error while updating subject:", error);
            toast.error(error.msg);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box px={2} py={4} width="100%">
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Edit Subject
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                    <TextField
                        label="Subject Name"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange('name')}
                        error={errors.name}
                        helperText={errors.name && 'Subject name is required'}
                        autoComplete="off"
                    />

                    <TextField
                        label="Subject ID (Auto)"
                        variant="outlined"
                        fullWidth
                        value={formData.subjectId}
                        disabled
                    />

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

export default EditSubject;
