import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Order } from '@/types/orders';
import { OrderFilters, OrderSort } from '@/components/orders/OrderList';

interface UseOrdersParams {
  filters?: OrderFilters;
  searchQuery?: string;
  sort?: OrderSort;
}

interface UseOrdersResult {
  orders: Order[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrders = ({
  filters,
  searchQuery,
  sort,
}: UseOrdersParams = {}): UseOrdersResult => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      // Добавляем параметры фильтрации
      if (filters?.status?.length) {
        params.append('status', filters.status.join(','));
      }
      if (filters?.subject?.length) {
        params.append('subject', filters.subject.join(','));
      }
      if (filters?.priceRange) {
        params.append('price_min', filters.priceRange[0].toString());
        params.append('price_max', filters.priceRange[1].toString());
      }
      if (filters?.deadline) {
        params.append('deadline_start', filters.deadline[0].toISOString());
        params.append('deadline_end', filters.deadline[1].toISOString());
      }

      // Добавляем параметры поиска
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      // Добавляем параметры сортировки
      if (sort) {
        params.append('sort_by', sort.field);
        params.append('sort_order', sort.order);
      }

      const response = await api.get<Order[]>(`/api/orders?${params.toString()}`);
      setOrders(response.data);
    } catch (err) {
      setError('Не удалось загрузить список заказов');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters, searchQuery, sort]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
}; 