import {jwtDecode} from 'jwt-decode';
import { api } from '../API/api';
// Create an instance of Axios to manage API requests

// Existing function to get user data using a token
export const getUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    const response = await api.get(`/auth/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return response.data.user;
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// New function to handle Google login session
export const handleGoogleLoginSession = async () => {
  try {
    // Fetch the session data from your backend for Google login
    const sessionResponse = await api.get('/auth/google/session');
    console.log(sessionResponse)

    const { email } = sessionResponse.data.user;

    // Fetch the user data from your backend using the email
    const userResponse = await api.get(`auth/user/email/${email}`);
    if (userResponse.data.success) {
      const user = userResponse.data.user;
      
      // Assume token is stored in the user document
      const token = user.token;
      
      if (token) {
        // Store the token in localStorage
        localStorage.setItem('token', token);
        return user;
      } else {
        throw new Error('Token not found in the user data');
      }
    } else {
      throw new Error('Failed to fetch user data from the server');
    }
  } catch (error) {
    console.error('Error handling Google login session:', error);
    throw error;
  }
};