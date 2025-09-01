export interface WorkType {
  id: number;
  name: string;
}

export interface DiscountRule {
  id: number;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  discount_display: string;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  work_types: WorkType[];
  min_orders: number;
  min_total_spent: number;
}

export interface DiscountProgress {
  orders_remaining?: number;
  spent_remaining?: number;
  min_orders?: number;
  min_total_spent?: number;
}

export interface UserDiscounts {
  available_discounts: DiscountRule[];
  nearly_available: {
    discount: DiscountRule;
    orders_remaining: number;
    spent_remaining: number;
  }[];
  user_stats: {
    total_orders: number;
    total_spent: number;
  };
}

export interface DiscountStatistics {
  discounts: {
    id: number;
    name: string;
    users_count: number;
    orders_count: number;
    total_discount_amount: number;
    avg_discount_amount: number;
  }[];
  periods: {
    week: {
      orders_count: number;
      total_discount: number;
      avg_discount: number;
    };
    month: {
      orders_count: number;
      total_discount: number;
      avg_discount: number;
    };
  };
} 