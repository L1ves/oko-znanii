import api from '../utils/api';

export interface ClientStatistics {
  total_orders: number;
  completed_orders: number;
  active_orders: number;
  total_spent: number;
  average_order_price: number;
  balance: number;
  frozen_balance: number;
}

export interface ClientDashboard {
  statistics: ClientStatistics;
  recent_orders: Order[];
  active_orders: Order[];
}

export interface Order {
  id: number;
  title: string;
  description: string;
  subject_id?: number;
  topic_id?: number;
  work_type_id?: number;
  complexity_id?: number;
  status: 'new' | 'waiting_payment' | 'in_progress' | 'review' | 'revision' | 'completed' | 'cancelled';
  budget: number;
  final_price?: number;
  original_price?: number;
  discount_amount?: number;
  deadline: string;
  created_at: string;
  updated_at: string;
  subject?: {
    id: number;
    name: string;
  };
  topic?: {
    id: number;
    name: string;
  };
  work_type?: {
    id: number;
    name: string;
  };
  complexity?: {
    id: number;
    name: string;
  };
  expert?: {
    id: number;
    name: string;
    rating?: number;
  };
  discount?: {
    id: number;
    name: string;
    discount_type: 'percentage' | 'fixed';
    value: number;
  };
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'hold' | 'release' | 'payout' | 'commission' | 'refund';
  timestamp: string;
  order?: {
    id: number;
    title: string;
  };
}

// Получение данных клиентского кабинета
export const fetchClientDashboard = async (): Promise<ClientDashboard> => {
  const { data } = await api.get('/users/client_dashboard/');
  return data;
};

// Получение всех заказов клиента
export const fetchClientOrders = async (params?: {
  status?: string;
  ordering?: string;
  page?: number;
}): Promise<{ results: Order[]; count: number; next?: string; previous?: string }> => {
  const { data } = await api.get('/users/client_orders/', { params });
  return data;
};

// Получение истории транзакций
export const fetchClientTransactions = async (params?: {
  page?: number;
}): Promise<{ results: Transaction[]; count: number; next?: string; previous?: string }> => {
  const { data } = await api.get('/users/client_transactions/', { params });
  return data;
};

// Получение статистики клиента
export const fetchClientStatistics = async (): Promise<ClientStatistics> => {
  const { data } = await api.get('/users/client_dashboard/');
  return data.statistics;
}; 

// Создание заказа (минимальная форма)
export async function createOrderMinimal(payload: {
  title: string;
  description: string;
  deadline: string; // ISO string
  subject_id: number;
  topic_id: number;
  work_type_id: number;
  complexity_id: number;
  additional_requirements?: Record<string, unknown>;
}) {
  const { data } = await api.post('/orders/', payload);
  return data as Order;
}