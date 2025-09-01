import { useEffect, useState } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { login, register } from '../api/auth';

const { Title, Text } = Typography;

export default function TestAuthPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    setToken(storedToken);
  }, []);

  const handleTestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await login({
        email: 'test@example.com',
        password: 'testpass123'
      });
      setToken(response.access);
      alert('Вход успешен!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await register({
        name: 'Тестовый Пользователь',
        email: 'test@example.com',
        password: 'testpass123',
        confirmPassword: 'testpass123',
        role: 'expert',
        phone: '+79991234567',
        about: 'Тестовый специалист',
        education: 'Высшее образование',
        experience_years: 5,
        hourly_rate: 1000,
        specializations: ['математика', 'программирование']
      });
      setToken(response.access);
      alert('Регистрация успешна!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    alert('Выход выполнен!');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Тест авторизации</Title>
      
      <Card style={{ marginBottom: '16px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>Текущий токен: </Text>
            <Text code>{token ? 'Есть' : 'Нет'}</Text>
          </div>
          
          {token && (
            <div>
              <Text strong>Токен: </Text>
              <Text code style={{ wordBreak: 'break-all' }}>
                {token.substring(0, 50)}...
              </Text>
            </div>
          )}
          
          <Space>
            <Button 
              type="primary" 
              onClick={handleTestRegister}
              loading={loading}
            >
              Тест регистрации
            </Button>
            
            <Button 
              onClick={handleTestLogin}
              loading={loading}
            >
              Тест входа
            </Button>
            
            {token && (
              <Button 
                danger
                onClick={handleLogout}
              >
                Выйти
              </Button>
            )}
          </Space>
          
          {error && (
            <Alert
              message="Ошибка"
              description={error}
              type="error"
              showIcon
            />
          )}
        </Space>
      </Card>
      
      <Card>
        <Title level={4}>Инструкции:</Title>
        <ol>
          <li>Нажмите "Тест регистрации" для создания нового пользователя</li>
          <li>Или нажмите "Тест входа" если пользователь уже существует</li>
          <li>После успешной авторизации токен сохранится в localStorage</li>
          <li>Теперь можно перейти на <a href="/expert/dashboard">дашборд специалиста</a></li>
        </ol>
      </Card>
    </div>
  );
} 