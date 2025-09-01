export interface ExpertStatistics {
  total_earnings: number | null;
  monthly_earnings: number | null;
  active_orders: number | null;
  completed_orders: number | null;
  average_rating: number | null;
  verified_specializations: number | null;
  success_rate: number | null;
  total_orders: number | null;
  response_time_avg?: number | null;
}

export interface ExpertOrder {
  id: number;
  title: string;
  description?: string;
  status: string;
  budget: number;
  deadline: string;
  created_at: string;
  client: {
    id: number;
    username: string;
    email?: string;
  };
  subject?: {
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
}

export interface ExpertSpecialization {
  id: number;
  subject: {
    id: number;
    name: string;
  };
  experience_years: number;
  hourly_rate: number;
  description: string;
  is_verified: boolean;
  created_at: string;
}

export interface ExpertDocument {
  id: number;
  document_type: string;
  title: string;
  description: string;
  is_verified: boolean;
  created_at: string;
}

export interface ExpertReview {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  client: {
    id: number;
    username: string;
  };
  order: {
    id: number;
    title: string;
  };
}

export interface ExpertProfile {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    rating: number;
  };
  specializations: ExpertSpecialization[];
  documents: ExpertDocument[];
  reviews: ExpertReview[];
}

export interface TakeOrderRequest {
  order_id: number;
}

export interface TakeOrderResponse {
  detail: string;
  order_id: number;
} 