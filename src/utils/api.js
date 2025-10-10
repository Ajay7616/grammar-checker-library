import axios from 'axios';

const API_URL = 'http://127.0.0.1:5555/api/check';

export const checkGrammar = async (text) => {
  try {
    const response = await axios.post(API_URL, { text });
    return response.data;
  } catch (error) {
    console.error('Error checking grammar:', error);
    throw error;
  }
};