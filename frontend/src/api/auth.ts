import api from '../utils/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  about?: string;
  education?: string;
  experience_years?: number;
  hourly_rate?: number;
  specializations?: string[];
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Преобразуем email в username для входа
  const username = credentials.email.split('@')[0];
  
  const { data } = await api.post('/users/token/', {
    username: username,
    password: credentials.password
  });
  // Сохраняем токены в localStorage
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  phone?: string;
  about?: string;
  education?: string;
  experience_years?: number;
  hourly_rate?: number;
  specializations?: string[];
}): Promise<AuthResponse> => {
  try {
    // Преобразуем данные в формат, ожидаемый бэкендом
    const [firstName, ...lastNameParts] = userData.name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || firstName;
    
    // Генерируем уникальный username
    let baseUsername = userData.email.split('@')[0];
    let username = baseUsername;
    let counter = 1;
    
    // Добавляем случайный суффикс для уникальности
    const randomSuffix = Math.floor(Math.random() * 1000);
    username = `${baseUsername}_${randomSuffix}`;
    
    const registerData: RegisterData = {
      username: username,
      email: userData.email,
      password: userData.password,
      password2: userData.confirmPassword,
      first_name: firstName,
      last_name: lastName,
      role: userData.role,
      phone: userData.phone,
      about: userData.about,
      education: userData.education,
      experience_years: userData.experience_years,
      hourly_rate: userData.hourly_rate,
      specializations: userData.specializations
    };

    const { data } = await api.post('/users/', registerData);
    
    // После успешной регистрации автоматически входим в систему
    const loginData = await login({
      email: userData.email,
      password: userData.password
    });
    
    return loginData;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw error;
  }
}; 