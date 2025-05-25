import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import questionService from '../../../../service/questionService';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Restore } from '@mui/icons-material';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';

const Question = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [actionType, setActionType] = useState('');

  const handleCreate = () => {
    navigate('/admin/content/questions/create');
  };

  const handleEdit = (id) => {
    navigate(`${location.pathname}/edit?questionId=${id}`);
  };

  const handleActionClick = (id, type) => {
    setSelectedQuestionId(id);
    setActionType(type);
    setOpenModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      let res;
      if (actionType === 'delete') {
        res = await questionService.deleteQuestion(selectedQuestionId);
      } else if (actionType === 'restore') {
        res = await questionService.restoreQuestion(selectedQuestionId);
      }

      if (res.success) {
        toast.success(`Question ${actionType}d successfully!`);
        await fetchQuestions();
      } else {
        toast.error(res.msg || `Failed to ${actionType} question.`);
      }
    } catch (err) {
      toast.error(`Error while trying to ${actionType} question.`);
    } finally {
      setOpenModal(false);
      setSelectedQuestionId(null);
      setActionType('');
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedQuestionId(null);
    setActionType('');
  };

  const fetchQuestions = async () => {
    try {
      const res = await questionService.listQuestions();
      if (res.success) {
        setQuestions(res.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Error fetching questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Questions</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
        >
          + Add New
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
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
                <td colSpan={7} className="py-6 text-2xl text-center text-gray-500">
                  No questions available
                </td>
              </tr>
            ) : (
              questions.map((q, index) => (
                <tr key={q._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4 text-center">
                    {q.question.split(' ').slice(0, 4).join(' ')}...
                  </td>
                  <td className="py-3 px-4 text-center">{q.difficulty}</td>
                  <td className="py-3 px-4 text-center">{q.topicId?.name}</td>
                  <td className="py-3 px-4 text-center">{q.subjectId?.name}</td>
                  <td className="py-3 px-4 text-center">
                    {new Date(q.createdAt).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <IconButton color="primary" onClick={() => handleEdit(q._id)}>
                      <EditIcon />
                    </IconButton>

                    {!q.status ? (
                      <IconButton color="success" onClick={() => handleActionClick(q._id, 'restore')}>
                        <Restore />
                      </IconButton>
                    ) : (
                      <IconButton color="error" onClick={() => handleActionClick(q._id, 'delete')}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openModal && (
        <Modal open={openModal} onClose={handleCancel}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: { xs: 2, sm: 4 },
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              {`Are you sure you want to ${actionType} this question?`}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color={actionType === 'delete' ? 'error' : 'success'}
                onClick={handleConfirmAction}
                sx={{ minWidth: 100 }}
              >
                {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
              </Button>
              <Button variant="outlined" onClick={handleCancel} sx={{ minWidth: 100 }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Question;
