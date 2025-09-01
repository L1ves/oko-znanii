export interface Order {
  id: number;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'review' | 'completed';
  budget: number;
  subject: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  author_id: number;
  executor_id?: number;
  requirements?: string;
  attachments?: Array<{
    id: number;
    filename: string;
    url: string;
  }>;
  original_price?: number;
  discount_amount?: number;
  final_price?: number;
  discount?: {
    id: number;
    name: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    value: number;
    discount_display: string;
  };
} 