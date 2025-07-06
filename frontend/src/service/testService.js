// services/testService.js
import axios from 'axios';
import BackendServer from '../config/config';

const API = axios.create({
  baseURL: `${BackendServer}/api/tests`,
  withCredentials: true
});

export const createTest = async (formData) => {
  try {
    const response = await API.post('/create-test', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating test:', error?.response?.data || error.message);
    throw error;
  }
};

export const getTests = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/list-tests?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tests:', error?.response?.data || error.message);
    throw error;
  }
};

export const editTest = async (testId, formData) => {
  try {
    const response = await API.put(`/edit/${testId}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error editing test:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteTest = async (testId) => {
  try {
    const response = await API.patch(`/${testId}/soft-delete`);
    return response.data;
  } catch (error) {
    console.error('Error deleting test:', error?.response?.data || error.message);
    throw error;
  }
};

export const restoreTest = async (testId) => {
  try {
    const response = await API.patch(`/${testId}/restore`);
    return response.data;
  } catch (error) {
    console.error('Error restoring test:', error?.response?.data || error.message);
    throw error;
  }
};

export const getTestById = async (testId) => {
  try {
    const response = await API.get(`/get-test/${testId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test:', error?.response?.data || error.message);
    throw error;
  }
};

export const startTest = async (testId) => {
  try {
    const response = await API.get(`/start-test/${testId}`);
    return response.data;
  } catch (error) {
    console.error('Error starting test:', error?.response?.data || error.message);
    throw error;
  }
};

export const submitTest = async (submissionData) => {
  try {
    const response = await API.post('/submit-test', submissionData);
    return response.data;
  } catch (error) {
    console.error('Error submitting test:', error?.response?.data || error.message);
    throw error;
  }
};

export const checkIfAttempted = async (testId, userId) => {
  try {
    const res = await API.get(`/check-attempt?testId=${testId}&userId=${userId}`);
    return res.data;
  } catch (error) {
    console.error('Error checking if test is attempted:', error?.response?.data || error.message);
    return { success: false, message: 'Failed to check attempt status' };
  }
};

export const getLeaderboard = async (testId) => {
  const res = await API.get(`/get-leaderboard/${testId}`);
  return res.data;
};

export const getOverallLeaderboard = async () => {
  const res = await API.get(`/get-overall-leaderboard`);
  return res.data;
};

export const getTestLeaderboard = async (testId) => {
  try {
    const response = await API.get(`/get-test-leaderboard/${testId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test leaderboard:', error);
    throw error;
  }
};



export default {
  createTest,
  getTests,
  editTest,
  deleteTest,
  restoreTest,
  getTestById,
  startTest,
  submitTest,
  checkIfAttempted,
  getLeaderboard,
  getOverallLeaderboard,
  getTestLeaderboard
};
