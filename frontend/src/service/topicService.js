import axios from 'axios';
import BackendServer from '../config/config';

// Create an Axios instance with default settings
const API = axios.create({
    baseURL: `${BackendServer}/api/topics`,
    withCredentials: true, // Ensures cookies are sent & received
});

const listTopics = async (subjectId='') => {
    try {
        const response = await API.get(`/list?subjectId=${subjectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching topics list:', error.response?.data || error.message);
        throw error;
    }
};

const createTopic = async (formData) => {
    try {
        console.log("In topic service:- ", formData);
        const data = {
            name: formData.name,
            desc: formData.description,
            slug: formData.topicId,
            subjectId: formData.subjectId
        };
        const response = await API.post('/create', data);
        return response.data;
    } catch (error) {
        console.error('Error creating topic:', error?.response?.data || error.message);
        throw error;
    }
};

const getTopicDetails = async (id) => {
    try {
        const response = await API.get(`/topic-details?topicId=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching topic details:', error?.response?.data || error.message);
        throw error;
    }
};

const editTopic = async (topicId, formData) => {
    try {
        const data = {
            name: formData.name,
            desc: formData.description,
            slug: formData.topicId,
            subjectId: formData.subjectId
        };

        const response = await API.put(`/edit?topicId=${topicId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error editing topic:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

const deleteTopic = async (topicId) => {
    try {
        console.log("Topic ID:- ", topicId);
        const response = await API.post(`/delete`, { topicId });
        return response.data;
    } catch (error) {
        console.error('Error deleting topic:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

const restoreTopic = async (topicId) => {
    try {
        console.log("Topic ID:- ", topicId);
        const response = await API.post(`/restore`, { topicId });
        return response.data;
    } catch (error) {
        console.error('Error restoring topic:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

const getTopicNames = async (subjectId = '') => {
    try {
        const query = subjectId ? `?subjectId=${subjectId}` : '';
        const response = await API.get(`/get-topic-names${query}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching topic names:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};


export default {
    listTopics,
    createTopic,
    getTopicDetails,
    editTopic,
    deleteTopic,
    restoreTopic,
    getTopicNames
};