import api from '../utils/api';
import {
  ExpertStatistics,
  ExpertOrder,
  ExpertProfile,
  TakeOrderRequest,
  TakeOrderResponse
} from '../types/expert';

export const expertApi = {
  // Получение статистики специалиста
  getStatistics: async (): Promise<ExpertStatistics> => {
    console.log('expertApi.getStatistics: Starting request');
    const result = await api.get('/experts/dashboard/statistics/');
    console.log('expertApi.getStatistics: Request successful:', result);
    return result.data;
  },

  // Получение активных заказов
  getActiveOrders: async (): Promise<ExpertOrder[]> => {
    const result = await api.get('/experts/dashboard/active_orders/');
    return result.data;
  },

  // Получение доступных заказов
  getAvailableOrders: async (): Promise<ExpertOrder[]> => {
    const result = await api.get('/experts/dashboard/available_orders/');
    return result.data;
  },

  // Получение последних заказов
  getRecentOrders: async (): Promise<ExpertOrder[]> => {
    const result = await api.get('/experts/dashboard/recent_orders/');
    return result.data;
  },

  // Получение профиля специалиста
  getProfile: async (): Promise<ExpertProfile> => {
    const result = await api.get('/experts/dashboard/profile/');
    return result.data;
  },

  // Взять заказ в работу
  takeOrder: async (data: TakeOrderRequest): Promise<TakeOrderResponse> => {
    const result = await api.post('/experts/dashboard/take_order/', data);
    return result.data;
  }
};
