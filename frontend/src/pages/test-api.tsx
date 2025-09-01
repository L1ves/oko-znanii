import { useState } from 'react';
import { Button, Card, Typography, Space, Alert } from 'antd';
import api from '../utils/api';

const { Title, Text } = Typography;

export default function TestApi() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Проверяем токен
      const token = localStorage.getItem('access_token');
      console.log('Token:', token);

      // Тестируем API
      const response = await api.get('/experts/dashboard/statistics/');
      console.log('API Response:', response);
      setResult(response.data);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/users/token/', {
        username: 'expertuser',
        password: 'testpass123'
      });
      
      console.log('Login Response:', response);
      
      // Сохраняем токен
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      setResult(response.data);
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Тестирование API</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Действия">
          <Space>
            <Button type="primary" onClick={testLogin} loading={loading}>
              Войти как эксперт
            </Button>
            <Button onClick={testApi} loading={loading}>
              Тест API дашборда
            </Button>
          </Space>
        </Card>

        {error && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            showIcon
          />
        )}

        {result && (
          <Card title="Результат">
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}
      </Space>
    </div>
  );
} 