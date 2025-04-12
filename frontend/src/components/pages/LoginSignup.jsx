import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const templateOptions = [
  { label: 'Abstract Blue', value: 'template-blue.jpg' },
  { label: 'Geometric Purple', value: 'template-purple.jpg' },
  { label: 'Chalkboard', value: 'template-chalk.jpg' },
  { label: 'Modern Grid', value: 'template-grid.jpg' },
];

const CreateSubject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const generateSlug = (name) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    const { name, description, template } = formData;
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Subject name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!template) newErrors.template = 'Please select a template';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      ...formData,
      subjectId: generateSlug(name),
      topicCount: 0,
    };

    console.log('Submitting:', payload);

    toast.success('Subject created successfully!');
    navigate('/subject');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Add New Subject
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subject Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Select Template"
              name="template"
              value={formData.template}
              onChange={handleChange}
              error={!!errors.template}
              helperText={errors.template}
            >
              {templateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIos />}
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
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CreateSubject;
