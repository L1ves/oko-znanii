import api from '../utils/api';
import { UserProfile, ProfileUpdateData, ApiError, Document, DocumentType } from '../types/user';

// Конфигурация повторных попыток
const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error.response && error.response.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

export const fetchProfile = async (): Promise<UserProfile> => {
  try {
    const { data } = await withRetry(() => api.get('/users/me/'));
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData: ProfileUpdateData): Promise<UserProfile> => {
  try {
    const { data } = await api.patch('/users/me/', profileData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  try {
    // Проверка размера файла (не более 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Файл слишком большой. Максимальный размер 5MB');
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      throw new Error('Неверный формат файла. Загрузите изображение');
    }

    const formData = new FormData();
    formData.append('avatar', file);
    
    const { data } = await api.post('/users/profile/avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const uploadDocument = async (
  file: File, 
  type: DocumentType
): Promise<Document> => {
  try {
    // Проверка размера файла (не более 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Файл слишком большой. Максимальный размер 10MB');
    }

    // Проверка типа файла
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Неверный формат файла. Разрешены PDF, JPEG, PNG');
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    
    const { data } = await api.post('/users/profile/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}; 