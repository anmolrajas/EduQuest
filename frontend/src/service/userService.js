import axios from 'axios';
import BackendServer from '../config/config'

const signUp = async (userData) => {
  try {
    console.log("In service:- ", userData);
    const response = await axios.post(`${BackendServer}/api/users/signup`, userData);
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
    const response = await axios.post(`${BackendServer}/api/users/login`, userData);
    console.log("Response in service file:- ", response);
    return response.data;
  } catch (error) {
    console.error('Error login user:', error.response?.data || error.message);
    throw error;
  }
};

export default { signUp, logIn };