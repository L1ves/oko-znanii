import { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Alert, Input } from 'antd';
import api from '../utils/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function DebugApi() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('/experts/dashboard/statistics/');
  const [hasToken, setHasToken] = useState(false);

  // Проверяем токен только на клиенте
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasToken(!!localStorage.getItem('access_token'));
    }
  }, []);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing API with URL:', url);
      console.log('API base URL:', api.defaults.baseURL);
      
      // Проверяем токен
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      console.log('Token from localStorage:', token);

      // Тестируем API
      const response = await api.get(url);
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setHasToken(true);
      }
      
      setResult(response.data);
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const clearToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setHasToken(false);
    }
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Отладка API</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Информация">
          <Text>Base URL: {api.defaults.baseURL}</Text><br />
          <Text>Token: {hasToken ? 'Есть' : 'Нет'}</Text>
        </Card>

        <Card title="Действия">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Button type="primary" onClick={testLogin} loading={loading}>
                Войти как эксперт
              </Button>
              <Button onClick={clearToken}>
                Очистить токен
              </Button>
            </Space>
            
            <Space>
              <Text>URL:</Text>
              <Input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                style={{ width: '300px' }}
                placeholder="/experts/dashboard/statistics/"
              />
              <Button onClick={testApi} loading={loading}>
                Тест API
              </Button>
            </Space>
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
            <TextArea
              value={JSON.stringify(result, null, 2)}
              rows={10}
              readOnly
            />
          </Card>
        )}
      </Space>
    </div>
  );
} 