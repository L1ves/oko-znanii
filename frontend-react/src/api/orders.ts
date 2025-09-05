import apiClient from './client';

export interface CreateOrderRequest {
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  subject_id: number;
  topic_id: number;
  work_type_id: number;
  complexity_id: number;
}

export const ordersApi = {
  create: async (payload: CreateOrderRequest) => {
    const { data } = await apiClient.post('/orders/orders/', payload);
    return data;
  },
};


