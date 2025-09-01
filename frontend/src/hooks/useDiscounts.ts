import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import api from '@/utils/api';
import { UserDiscounts } from '@/types/discounts';

export const useDiscounts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<UserDiscounts | null>(null);

  const fetchDiscounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<UserDiscounts>('/api/catalog/discounts/available/');
      setDiscounts(response.data);
    } catch (err) {
      setError('Не удалось загрузить скидки. Пожалуйста, попробуйте позже.');
      console.error('Error fetching discounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyDiscount = useCallback(async (orderId: number, discountId: number) => {
    try {
      await api.post(`/api/orders/${orderId}/apply_discount/`, { discount_id: discountId });
      message.success('Скидка успешно применена');
      return true;
    } catch (err) {
      message.error('Не удалось применить скидку');
      console.error('Error applying discount:', err);
      return false;
    }
  }, []);

  const removeDiscount = useCallback(async (orderId: number) => {
    try {
      await api.post(`/api/orders/${orderId}/remove_discount/`);
      message.success('Скидка успешно удалена');
      return true;
    } catch (err) {
      message.error('Не удалось удалить скидку');
      console.error('Error removing discount:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  return {
    loading,
    error,
    discounts,
    fetchDiscounts,
    applyDiscount,
    removeDiscount,
  };
}; 