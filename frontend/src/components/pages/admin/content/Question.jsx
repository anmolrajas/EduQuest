// Question.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import questionService from '../../../../service/questionService';
import subjectService from '../../../../service/subjectService';
import topicService from '../../../../service/topicService';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Restore } from '@mui/icons-material';
import { Modal, Box, Typography, Button, IconButton, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { RotateCcw } from 'lucide-react';

const Question = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [filters, setFilters] = useState({ difficulty: '', subjectId: '', topicId: '' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [actionType, setActionType] = useState('');

  const [loading, setLoading] = useState(true);

  const handleCreate = () => navigate('/admin/content/questions/create');
  const handleEdit = (id) => navigate(`${location.pathname}/edit?questionId=${id}`);

  const handleActionClick = (id, type) => {
    setSelectedQuestionId(id);
    setActionType(type);
    setOpenModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      let res;
      if (actionType === 'delete') res = await questionService.deleteQuestion(selectedQuestionId);
      else if (actionType === 'restore') res = await questionService.restoreQuestion(selectedQuestionId);

      if (res.success) {
        toast.success(`Question ${actionType}d successfully!`);
        await fetchQuestions();
      } else toast.error(res.msg || `Failed to ${actionType} question.`);
    } catch {
      toast.error(`Error while trying to ${actionType} question.`);
    } finally {
      setOpenModal(false);
      setSelectedQuestionId(null);
      setActionType('');
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await questionService.listQuestions({ ...filters, page, limit });
      if (res.success) {
        setQuestions(res.data);
        setTotalPages(res.meta.pages);
      }
    } catch (error) {
      toast.error('Error fetching questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getSubjectNames();
      setSubjects(res.data || []);
    } catch {
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchTopics = async (subjectId = '') => {
    try {
      const res = await topicService.getTopicNames(subjectId);
      setTopics(res.data || []);
    } catch {
      toast.error('Failed to fetch topics');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchSubjects();
      await fetchTopics();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [filters, page]);

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    setPage(1);

    if (name === 'subjectId') {
      await fetchTopics(value);
      updatedFilters.topicId = '';
      setFilters(updatedFilters);
    }
  };

  const handleResetFilters = () => {
    setFilters({ difficulty: '', subjectId: '', topicId: '' });
    fetchTopics();
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Questions</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          + Add New
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select name="difficulty" value={filters.difficulty} label="Difficulty" onChange={handleFilterChange}>
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='easy'>Easy</MenuItem>
            <MenuItem value='medium'>Medium</MenuItem>
            <MenuItem value='hard'>Hard</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Subject</InputLabel>
          <Select name="subjectId" value={filters.subjectId} label="Subject" onChange={handleFilterChange}>
            <MenuItem value=''>All</MenuItem>
            {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Topic</InputLabel>
          <Select name="topicId" value={filters.topicId} label="Topic" onChange={handleFilterChange}>
            <MenuItem value=''>All</MenuItem>
            {topics.map(t => <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>)}
          </Select>
        </FormControl>

        <Button variant="outlined" startIcon={<RotateCcw size={16} />} onClick={handleResetFilters}>Reset</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center">#</th>
                <th className="py-3 px-4 text-center">Question</th>
                <th className="py-3 px-4 text-center">Difficulty</th>
                <th className="py-3 px-4 text-center">Topic</th>
                <th className="py-3 px-4 text-center">Subject</th>
                <th className="py-3 px-4 text-center">Created At</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">No questions available</td>
                </tr>
              ) : (
                questions.map((q, index) => (
                  <tr key={q._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-center">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3 px-4 text-center">{q.question.split(' ').slice(0, 4).join(' ')}...</td>
                    <td className="py-3 px-4 text-center">{q.difficulty}</td>
                    <td className="py-3 px-4 text-center">{q.topicId?.name}</td>
                    <td className="py-3 px-4 text-center">{q.subjectId?.name}</td>
                    <td className="py-3 px-4 text-center">{new Date(q.createdAt).toLocaleString('en-GB')}</td>
                    <td className="py-3 px-4 text-center">
                      <IconButton color="primary" onClick={() => handleEdit(q._id)}><EditIcon /></IconButton>
                      {!q.status ? (
                        <IconButton color="success" onClick={() => handleActionClick(q._id, 'restore')}><Restore /></IconButton>
                      ) : (
                        <IconButton color="error" onClick={() => handleActionClick(q._id, 'delete')}><DeleteIcon /></IconButton>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span>Page {page} of {totalPages}</span>
        <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      {/* Confirm Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Are you sure you want to {actionType} this question?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button variant="contained" color={actionType === 'delete' ? 'error' : 'success'} onClick={handleConfirmAction}>{actionType.charAt(0).toUpperCase() + actionType.slice(1)}</Button>
            <Button variant="outlined" onClick={() => setOpenModal(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Question;