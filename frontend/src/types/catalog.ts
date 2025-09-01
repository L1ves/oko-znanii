export interface Subject {
  id: number;
  name: string;
  ordersCount: number;
  description?: string;
}

export interface Expert {
  id: number;
  name: string;
  rating: number;
  completedOrders: number;
  specialization: string;
  avatar?: string;
} 