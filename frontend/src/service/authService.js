import axios from 'axios';
import BackendServer from '../config/config';

// Create an Axios instance with default settings
const API = axios.create({
  baseURL: `${BackendServer}/api/auth`,
  withCredentials: true, // Ensures cookies are sent & received
});

const check = async () => {
    try {
      console.log("In service...")
      const response = await API.get('/check');
      console.log("Response in service file:- ", response);
      return response.data;
    } catch (error) {
      console.error('Error login user:', error.response?.data || error.message);
      throw error;
    }
  };

  export default { check };