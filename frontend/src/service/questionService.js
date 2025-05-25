import axios from 'axios';
import BackendServer from '../config/config';

const API = axios.create({
    baseURL: `${BackendServer}/api/questions`,
    withCredentials: true,
});

// Create a new question
const createQuestion = async (formData) => {
    try {
        const response = await API.post('/create', formData);
        return response.data;
    } catch (error) {
        console.error('Error creating question:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

// List questions with filters and pagination
const listQuestions = async (filters) => {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await API.get(`/list?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error listing questions:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

// Get question details
const getQuestionDetails = async (questionId) => {
    try {
        const response = await API.get(`/question-details?questionId=${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching question details:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

// Edit question
const editQuestion = async (questionId, updatedData) => {
    try {
        const response = await API.put(`/edit?questionId=${questionId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error editing question:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

// Soft delete question
const deleteQuestion = async (questionId) => {
    try {
        const response = await API.post(`/delete`, { questionId });
        return response.data;
    } catch (error) {
        console.error('Error deleting question:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

// Restore question
const restoreQuestion = async (questionId) => {
    try {
        const response = await API.post(`/restore`, { questionId });
        return response.data;
    } catch (error) {
        console.error('Error restoring question:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

export default {
    createQuestion,
    listQuestions,
    getQuestionDetails,
    editQuestion,
    deleteQuestion,
    restoreQuestion,
};
