import React, { useState, useEffect } from 'react';
import {
    Box, Button, TextField, Typography, Paper, MenuItem, Select, InputLabel, FormControl, Grid, Tabs, Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import subjectService from '../../../../service/subjectService';
import topicService from '../../../../service/topicService';
import questionService from '../../../../service/questionService';

const CreateQuestion = () => {
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correct_answer: '',
        difficulty: 'easy',
        subjectId: '',
        topicId: '',
        hint: '',
        solution: '',
        question_image: '',
        correct_answer_image: '',
        solution_img: ''
    });

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectRes = await subjectService.listSubjects();
                if (subjectRes.success) setSubjects(subjectRes.data);
                fetchTopics();
            } catch (err) {
                toast.error('Failed to load subjects or topics');
            }
        };
        fetchData();
    }, []);

    const fetchTopics = async (subjectId = '') => {
        try {
          const res = await topicService.getTopicNames(subjectId);
          setTopics(res.data || []);
        } catch {
          toast.error('Failed to fetch topics');
        }
      };

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        if(field === 'subjectId') {
            fetchTopics(e.target.value);
        }
    };

    const handleOptionChange = (index) => (e) => {
        const updated = [...formData.options];
        updated[index] = e.target.value;
        setFormData({ ...formData, options: updated });
    };

    const handleSubmit = async () => {
        if (!formData.question || !formData.correct_answer || !formData.subjectId || !formData.topicId) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const res = await questionService.createQuestion(formData);
            if (res.success) {
                toast.success('Question Created');
                setTimeout(() => navigate(-1), 1000);
            } else {
                toast.error(res.msg || 'Failed to create question');
            }
        } catch (err) {
            toast.error(err?.response?.data?.msg || 'Error occurred');
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box px={2} py={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" mb={3}>Add New Question</Typography>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        mb: 3,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 'bold',
                            color: 'black',
                        },
                        '& .Mui-selected': {
                            backgroundColor: 'black',
                            color: '#ffffff',
                        }
                    }}
                >
                    <Tab label="Basic" />
                    <Tab label="Additional Details" />
                    <Tab label="Solution" />
                </Tabs>
                <Grid container spacing={3}>
                    {/* Tab 1: Question & Options */}
                    {activeTab === 0 && (
                        <Grid item xs={12}>
                            <TextField
                                label="Question"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.question}
                                onChange={handleChange('question')}
                                sx={{ mb: 2 }}
                            />

                            {formData.options.map((opt, i) => (
                                <TextField
                                    key={i}
                                    label={`Option ${i + 1}`}
                                    fullWidth
                                    value={opt}
                                    onChange={handleOptionChange(i)}
                                    sx={{ mb: 2 }}
                                />
                            ))}

                            <TextField
                                label="Correct Answer"
                                fullWidth
                                value={formData.correct_answer}
                                onChange={handleChange('correct_answer')}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    )}

                    {/* Tab 2: Additional Details (Subject, Topic, Difficulty, Hint) */}
                    {activeTab === 1 && (
                        <>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Difficulty</InputLabel>
                                <Select value={formData.difficulty} onChange={handleChange('difficulty')} label="Difficulty">
                                    <MenuItem value="easy">Easy</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="hard">Hard</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Subject</InputLabel>
                                <Select value={formData.subjectId} onChange={handleChange('subjectId')} label="Subject">
                                    {subjects.map((sub) => (
                                        <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Topic</InputLabel>
                                <Select value={formData.topicId} onChange={handleChange('topicId')} label="Topic">
                                    {topics.map((top) => (
                                        <MenuItem key={top._id} value={top._id}>{top.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Hint"
                                fullWidth
                                multiline
                                rows={4}  // Increased row count for a larger area
                                value={formData.hint}
                                onChange={handleChange('hint')}
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}

                    {/* Tab 3: Solution */}
                    {activeTab === 2 && (

                        <TextField
                            label="Solution"
                            fullWidth
                            multiline
                            rows={6}  // Increased row count for a larger area
                            value={formData.solution}
                            onChange={handleChange('solution')}
                            sx={{ mb: 3 }}
                        />
                    )}
                </Grid>

                {/* Action buttons */}
                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                    <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Create</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateQuestion;
