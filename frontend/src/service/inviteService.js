import axios from 'axios';
import BackendServer from '../config/config';

// Create an Axios instance with default settings
const API = axios.create({
  baseURL: `${BackendServer}/api/invites`,
  withCredentials: true, // Ensures cookies are sent & received
});

// Send admin invite
const sendInvite = async (data) => {
  try {
    console.log('In invite service (sendInvite):- ', data);
    const response = await API.post('/invite-admin', data);
    console.log('Response in invite service:- ', response);
    return response.data;
  } catch (error) {
    console.error(
      'Error sending invite:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// Verify invite token
const verifyInvite = async (token) => {
  try {
    const response = await API.get(`/verify-invite?token=${token}`);
    return response.data;
  } catch (error) {
    console.error(
      'Error verifying invite:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// Accept invite for existing users
const acceptInvite = async (data) => {
  try {
    const response = await API.post('/accept-invite', data);
    return response.data;
  } catch (error) {
    console.error(
      'Error accepting invite:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// Signup with invite (for new users)
const signupWithInvite = async (data) => {
  try {
    const response = await API.post('/signup-with-invite', data);
    return response.data;
  } catch (error) {
    console.error(
      'Error signup with invite:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export default { sendInvite, verifyInvite, acceptInvite, signupWithInvite };