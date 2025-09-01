import axios from 'axios';
import { Subject, Expert } from '../types/catalog';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
});

export const fetchSubjects = async (): Promise<Subject[]> => {
  const { data } = await api.get('/catalog/subjects/');
  return data;
};

export const fetchFeaturedExperts = async (): Promise<Expert[]> => {
  const { data } = await api.get('/experts/featured/');
  return data;
}; 