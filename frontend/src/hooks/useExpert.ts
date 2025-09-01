import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expertApi } from '../api/expert';
import { message } from 'antd';

// Хук для получения статистики специалиста
export const useExpertStatistics = () => {
  return useQuery({
    queryKey: ['expert', 'statistics'],
    queryFn: async () => {
      console.log('useExpertStatistics: Starting API call');
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      console.log('useExpertStatistics: Token exists:', !!token);
      
      if (!token) {
        throw new Error('Токен не найден. Пожалуйста, войдите в систему.');
      }
      
      try {
        const result = await expertApi.getStatistics();
        console.log('useExpertStatistics: API call successful:', result);
        return result;
      } catch (error) {
        console.error('useExpertStatistics: API call failed:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 1,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'), // Запрос только если есть токен
  });
};

// Хук для получения активных заказов
export const useActiveOrders = () => {
  return useQuery({
    queryKey: ['expert', 'active-orders'],
    queryFn: async () => {
      try {
        const result = await expertApi.getActiveOrders();
        return result || [];
      } catch (error) {
        console.error('useActiveOrders: API call failed:', error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 минуты
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
  });
};

// Хук для получения доступных заказов
export const useAvailableOrders = () => {
  return useQuery({
    queryKey: ['expert', 'available-orders'],
    queryFn: async () => {
      try {
        const result = await expertApi.getAvailableOrders();
        return result || [];
      } catch (error) {
        console.error('useAvailableOrders: API call failed:', error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 минута
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
  });
};

// Хук для получения последних заказов
export const useRecentOrders = () => {
  return useQuery({
    queryKey: ['expert', 'recent-orders'],
    queryFn: async () => {
      try {
        const result = await expertApi.getRecentOrders();
        return result || [];
      } catch (error) {
        console.error('useRecentOrders: API call failed:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
  });
};

// Хук для получения профиля специалиста
export const useExpertProfile = () => {
  return useQuery({
    queryKey: ['expert', 'profile'],
    queryFn: expertApi.getProfile,
    staleTime: 10 * 60 * 1000, // 10 минут
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
  });
};

// Хук для взятия заказа в работу
export const useTakeOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expertApi.takeOrder,
    onSuccess: () => {
      message.success('Заказ успешно взят в работу!');
      // Инвалидируем кеши для обновления данных
      queryClient.invalidateQueries({ queryKey: ['expert', 'active-orders'] });
      queryClient.invalidateQueries({ queryKey: ['expert', 'available-orders'] });
      queryClient.invalidateQueries({ queryKey: ['expert', 'statistics'] });
    },
    onError: (error) => {
      message.error('Ошибка при взятии заказа в работу');
      console.error('Take order error:', error);
    },
  });
}; 