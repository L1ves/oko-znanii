import axios from 'axios';
import { Subject, Expert } from '../types/catalog';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
});

export const fetchSubjects = async (): Promise<Subject[]> => {
  const { data } = await api.get('/catalog/subjects/');
  return data.results || data;
};

export const fetchFeaturedExperts = async (): Promise<Expert[]> => {
  const { data } = await api.get('/experts/featured/');
  return data;
};

export interface Topic {
  id: number;
  name: string;
  subject: number;
}

export interface WorkType {
  id: number;
  name: string;
}

export interface Complexity {
  id: number;
  name: string;
}

export const fetchTopics = async (): Promise<Topic[]> => {
  const { data } = await api.get('/catalog/topics/');
  return data.results || data;
};

export const fetchWorkTypes = async (): Promise<WorkType[]> => {
  const { data } = await api.get('/catalog/work-types/');
  return data.results || data;
};

export const fetchComplexities = async (): Promise<Complexity[]> => {
  const { data } = await api.get('/catalog/complexity-levels/');
  return data.results || data;
};