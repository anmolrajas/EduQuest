import axios from 'axios';
import BackendServer from '../config/config';

// Create an Axios instance with default settings
const API = axios.create({
  baseURL: `${BackendServer}/api/users`,
  withCredentials: true, // Ensures cookies are sent & received
});

const signUp = async (userData) => {
  try {
    console.log("In service:- ", userData);
    const response = await API.post('/signup', userData);
    console.log("Response in service file:- ", response);
    return response.data;
  } catch (error) {
    console.error('Error creating User:', error.response?.data || error.message);
    throw error;
  }
};

const logIn = async (userData) => {
  try {
    console.log("In service:- ", userData);
    const response = await API.post('/login', userData);
    console.log("Response in service file:- ", response);
    return response.data;
  } catch (error) {
    console.error('Error login user:', error.response?.data || error.message);
    throw error;
  }
};


const getDashboardStats = async (userId) => {
  const response = await API.get(`/dashboard-stats?userId=${userId}`);
  return response.data;
};

const getAllUsers = async ({ page = 1, limit = 10, search = "", role = "" } = {}) => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("page", page);
    queryParams.append("limit", limit);
    if (search) queryParams.append("search", search);
    if (role) queryParams.append("role", role);

    const response = await API.get(`/users-list?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error;
  }
};


export default { signUp, logIn, getDashboardStats, getAllUsers };
