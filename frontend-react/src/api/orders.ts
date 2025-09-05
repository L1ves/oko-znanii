import { apiClient } from './client';

export interface Order {
  id: number;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  status: string;
  subject: {
    id: number;
    name: string;
  };
  topic: {
    id: number;
    name: string;
  };
  work_type: {
    id: number;
    name: string;
  };
  complexity: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  title: string;
  description: string;
  deadline: string;
  subject_id: number;
  custom_topic: string;
  work_type_id: number;
  additional_requirements?: any;
}

export const ordersApi = {
  // Получить заказы клиента
  getClientOrders: async (params?: { status?: string; ordering?: string }) => {
    const response = await apiClient.get('/users/client_orders/', { params });
    return response.data;
  },

  // Создать заказ
  createOrder: async (data: CreateOrderRequest) => {
    const response = await apiClient.post('/orders/orders/', data);
    return response.data;
  },

  // Получить заказ по ID
  getOrder: async (id: number) => {
    const response = await apiClient.get(`/orders/${id}/`);
    return response.data;
  },

  // Обновить заказ
  updateOrder: async (id: number, data: Partial<CreateOrderRequest>) => {
    const response = await apiClient.patch(`/orders/${id}/`, data);
    return response.data;
  },

  // Взять заказ в работу (для экспертов)
  takeOrder: async (id: number) => {
    const response = await apiClient.post(`/orders/${id}/take/`);
    return response.data;
  },

  // Завершить заказ (для экспертов)
  completeOrder: async (id: number) => {
    const response = await apiClient.post(`/orders/${id}/complete/`);
    return response.data;
  },
};