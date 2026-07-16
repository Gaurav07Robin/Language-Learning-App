import axios from 'axios';
import { Platform } from 'react-native';

// Important: If you are testing on a physical device using Expo Go,
// replace "localhost" with your computer's local IP address (e.g. 192.168.1.5).
// For Android Emulators, use "10.0.2.2".
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/v1' : 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // LLMs can take a moment to generate content
  headers: {
    'Content-Type': 'application/json',
  },
});
