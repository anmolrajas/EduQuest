import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import subjectService from '../../../../service/subjectService';

const CreateSubject = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subjectId: '',
    });

    const [errors, setErrors] = useState({});

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

    const handleSubmit = async() => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fill all required fields!');
            return;
        }
        try {
            const response = await subjectService.createSubject(formData);
            console.log("created subject:- ", response);
            if(response?.success){
                toast.success("New Subject Created!");
                setTimeout(() => navigate(-1), 1500);
            }
            else{
                toast.error(response?.msg);
            }
        } catch (error) {
            console.error("Error while creating new subject:- ", error);
            if(!error?.response?.data?.success){
                toast.error(error?.response?.data?.msg);
            }
            toast.error("Failed to create subject!"); 
        }
    };

    return (
        <Box px={2} py={4} width="100%">
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Add New Subject
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
                        autoComplete='off'
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

export default CreateSubject;
