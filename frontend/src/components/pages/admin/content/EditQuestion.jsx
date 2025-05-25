import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Paper, MenuItem, Select,
  InputLabel, FormControl, Grid, Tabs, Tab
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import subjectService from '../../../../service/subjectService';
import topicService from '../../../../service/topicService';
import questionService from '../../../../service/questionService';

const EditQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const questionId = queryParams.get('questionId');

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
    const fetchInitialData = async () => {
      try {
        const [subjectRes, topicRes, questionRes] = await Promise.all([
          subjectService.listSubjects(),
          topicService.listTopics(),
          questionService.getQuestionDetails(questionId)
        ]);
  
        if (subjectRes.success) setSubjects(subjectRes.data);
        if (topicRes.success) setTopics(topicRes.data);
  
        if (questionRes.success) {
          const q = questionRes.data;
          setFormData({
            ...q,
            subjectId: typeof q.subjectId === 'object' ? q.subjectId._id : q.subjectId,
            topicId: typeof q.topicId === 'object' ? q.topicId._id : q.topicId,
          });
        } else {
          toast.error('Failed to fetch question details');
        }
      } catch (err) {
        toast.error('Failed to load data');
      }
    };
  
    if (questionId) {
      fetchInitialData();
    }
  }, [questionId]);
  

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleOptionChange = (index) => (e) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = e.target.value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleSubmit = async () => {
    if (!formData.question || !formData.correct_answer || !formData.subjectId || !formData.topicId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const res = await questionService.editQuestion(questionId, formData);
      if (res.success) {
        toast.success('Question updated');
        setTimeout(() => navigate(-1), 1000);
      } else {
        toast.error(res.msg || 'Failed to update question');
      }
    } catch (err) {
      toast.error(err?.response?.data?.msg || 'Error occurred');
    }
  };

  return (
    <Box px={2} py={4}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" mb={3}>Edit Question</Typography>

        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
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

          {/* Tab 2: Additional Details */}
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
                rows={4}
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
              rows={6}
              value={formData.solution}
              onChange={handleChange('solution')}
              sx={{ mb: 3 }}
            />
          )}
        </Grid>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Update</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditQuestion;
