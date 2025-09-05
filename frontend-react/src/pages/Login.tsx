import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Tabs, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi, type LoginRequest, type RegisterRequest } from '../api/auth';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      await authApi.login(values);
      message.success('Успешный вход!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: RegisterRequest) => {
    setLoading(true);
    try {
      await authApi.register(values);
      message.success('Регистрация успешна! Теперь войдите в систему.');
    } catch (error: any) {
      const errorData = error.response?.data;
      if (typeof errorData === 'object') {
        Object.values(errorData).forEach((errorMessages: any) => {
          if (Array.isArray(errorMessages)) {
            errorMessages.forEach((msg: string) => message.error(msg));
          }
        });
      } else {
        message.error('Ошибка регистрации');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <Form onFinish={onLogin} layout="vertical">
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Введите имя пользователя' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );

  const registerForm = (
    <Form onFinish={onRegister} layout="vertical">
      <Form.Item name="email" rules={[{ type: 'email', message: 'Некорректный email' }]}> 
        <Input prefix={<MailOutlined />} placeholder="Email (или оставьте пустым)" />
      </Form.Item>
      <Form.Item name="phone">
        <Input prefix={<PhoneOutlined />} placeholder="Телефон (или оставьте пустым)" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
      </Form.Item>
      <Form.Item
        name="password2"
        rules={[
          { required: true, message: 'Подтвердите пароль' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Пароли не совпадают'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
      </Form.Item>
      <Form.Item
        name="role"
        rules={[{ required: true, message: 'Выберите роль' }]}
        initialValue="client"
      >
        <Select placeholder="Выберите роль">
          <Select.Option value="client">Клиент</Select.Option>
          <Select.Option value="expert">Эксперт</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>Око Знаний</Title>
          <Text type="secondary">Войдите в систему или зарегистрируйтесь</Text>
        </div>
        
        <Tabs
          defaultActiveKey="login"
          items={[
            {
              key: 'login',
              label: 'Вход',
              children: loginForm,
            },
            {
              key: 'register',
              label: 'Регистрация',
              children: registerForm,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Login;
