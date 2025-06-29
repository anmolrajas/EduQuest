import axios from 'axios';
import BackendServer from '../config/config';

// Create an Axios instance with default settings
const API = axios.create({
    baseURL: `${BackendServer}/api/subjects`,
    withCredentials: true, // Ensures cookies are sent & received
});

const listSubjects = async () => {
    try {
        const response = await API.get('/list');
        return response.data;
    } catch (error) {
        console.error('Error fetching list:', error.response?.data || error.message);
        throw error;
    }
};

const createSubject = async (formData) => {
    try {
        console.log("In service:- ", formData);
        const data = {
            name: formData.name,
            desc: formData.description,
            slug: formData.subjectId
        }
        const response = await API.post('/create', data);
        return response.data;
    } catch (error) {
        console.error('Error creating subject:', error?.response?.data || error.message);
        throw error;
    }
};


const getSubjectDetails = async (id) => {
    try {
        const response = await API.get(`/subject-details?subjectId=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subject details:', error?.response?.data || error.message);
        throw error;
    }
};


const editSubject = async (subjectId, formData) => {
    try {
        const data = {
            name: formData.name,
            desc: formData.description,
            slug: formData.subjectId
        };

        const response = await API.put(`/edit?subjectId=${subjectId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error editing subject:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

const deleteSubject = async(subjectId) => {
    try {
        console.log("Subject ID:- ", subjectId);
        const response = await API.post(`/delete`, {subjectId});
        return response.data;
    } catch (error) {
        console.error('Error deleting subject:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

const restoreSubject = async(subjectId) => {
    try {
        console.log("Subject ID:- ", subjectId);
        const response = await API.post(`/restore`, {subjectId});
        return response.data;
    } catch (error) {
        console.error('Error restoring subject:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};

const getSubjectNames = async () => {
    try {
        const response = await API.get('/get-subject-names');
        return response.data;
    } catch (error) {
        console.error('Error fetching subject names:', error?.response?.data || error.message);
        throw error?.response?.data;
    }
};


export default {
    listSubjects,
    createSubject,
    getSubjectDetails,
    editSubject,
    deleteSubject,
    restoreSubject,
    getSubjectNames
};
