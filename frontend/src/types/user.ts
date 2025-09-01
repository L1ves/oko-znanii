export type UserRole = 'client' | 'expert' | 'admin';

export enum DocumentType {
  PASSPORT = 'passport',
  DIPLOMA = 'diploma',
  CERTIFICATE = 'certificate',
  OTHER = 'other'
}

export interface Document {
  id: number;
  type: DocumentType;
  verified: boolean;
  url: string;
  uploadedAt: string;
  verifiedAt?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  telegramUsername?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  rating?: number;
  completedOrders: number;
  balance: number;
  specializations?: string[];
  education?: string;
  about?: string;
  languages?: string[];
  documents?: Document[];
  isOnline?: boolean;
  lastSeen?: string;
}

export interface ProfileUpdateData {
  email?: string;
  name?: string;
  phone?: string;
  telegramUsername?: string;
  about?: string;
  education?: string;
  languages?: string[];
  specializations?: string[];
}

export interface ApiError {
  message: string;
  field?: string;
  code?: string;
} 