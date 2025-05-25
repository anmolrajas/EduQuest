import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import topicService from '../../../../service/topicService'; // You would need to create a similar service for topics
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Restore } from '@mui/icons-material';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';

const Topic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [topics, setTopics] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [actionType, setActionType] = useState('');

  const handleCreateTopic = () => {
    navigate('/admin/content/topics/create');
  };

  const handleEdit = (id) => {
    navigate(`${location.pathname}/edit?topicId=${id}`);
  };

  const handleActionClick = (id, type) => {
    setSelectedTopicId(id);
    setActionType(type);
    setOpenModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      let res;
      if (actionType === 'delete') {
        res = await topicService.deleteTopic(selectedTopicId);
      } else if (actionType === 'restore') {
        res = await topicService.restoreTopic(selectedTopicId);
      }

      if (res.success) {
        toast.success(`Topic ${actionType}d successfully!`);
        await fetchTopics();
      } else {
        toast.error(res.msg || `Failed to ${actionType} topic.`);
      }
    } catch (err) {
      toast.error(`Error while trying to ${actionType} topic.`);
    } finally {
      setOpenModal(false);
      setSelectedTopicId(null);
      setActionType('');
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedTopicId(null);
    setActionType('');
  };

  const fetchTopics = async () => {
    try {
      const res = await topicService.listTopics();
      if (res.success) {
        setTopics(res.data);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Error fetching topics");
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Topics</h2>
        <button
          onClick={handleCreateTopic}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
        >
          + Add New
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">#</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">Name</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">Slug</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">Description</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">Subject</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">Questions</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">Created At</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-2xl text-center text-gray-500">
                  No topics available
                </td>
              </tr>
            ) : (
              topics.map((topic, index) => (
                <tr key={topic.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4 text-center">{topic.name}</td>
                  <td className="py-3 px-4 text-center">{topic.slug}</td>
                  <td className="py-3 px-4 text-center">{topic.desc}</td>
                  <td className="py-3 px-4 text-center">{topic?.subjectId?.name}</td>
                  <td className="py-3 px-4 text-center">{topic?.questions_count}</td>
                  <td className="py-3 px-4 text-center">
                    {new Date(topic.createdAt).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(topic._id)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
  
                    {!topic.status ? (
                      <IconButton
                        color="success"
                        onClick={() => handleActionClick(topic._id, 'restore')}
                        aria-label="restore"
                      >
                        <Restore />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="error"
                        onClick={() => handleActionClick(topic._id, 'delete')}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </td>
                </tr>
              ))
            )
          }               
          </tbody>
        </table>
      </div>
      {openModal && (
        <Modal
          open={openModal}
          onClose={handleCancel}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: {
                xs: '90%',  // small screens
                sm: 400,    // tablets and up
              },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: {
                xs: 2,
                sm: 4
              },
              textAlign: 'center'
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
              {`Are you sure you want to ${actionType} this topic?`}
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
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Topic;
