import axios from 'axios';
import { Student } from '../types/Student';

const API_BASE_URL = 'http://localhost:3001'; // Adjust this to match your backend URL

export const fetchCodeforcesData = async (handle: string): Promise<Partial<Student>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/codeforces/${handle}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Codeforces data:', error);
    throw error;
  }
};

export const updateStudentCodeforcesData = async (studentId: string): Promise<Student> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/students/${studentId}/sync-codeforces`);
    return response.data;
  } catch (error) {
    console.error('Error updating Codeforces data:', error);
    throw error;
  }
}; 