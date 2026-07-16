import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL = 'https://language-learning-app-xldn.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // LLMs can take a moment to generate content
  headers: {
    'Content-Type': 'application/json',
  },
});
