import React from 'react';
import { Card, Form, Input, Button, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TestForm {
  name: string;
  email: string;
  password: string;
  description: string;
}

export default function TestInputPage() {
  const [form] = Form.useForm();

  const onFinish = (values: TestForm) => {
    message.success('Форма отправлена: ' + JSON.stringify(values, null, 2));
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      padding: '24px',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: '100%', maxWidth: 600 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Тест компонента Input
        </Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input 
              size="large" 
              prefix={<UserOutlined />} 
              placeholder="Введите ваше имя"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' }
            ]}
          >
            <Input 
              size="large" 
              prefix={<MailOutlined />} 
              placeholder="example@email.com"
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password 
              size="large" 
              prefix={<LockOutlined />} 
              placeholder="Введите пароль"
            />
          </Form.Item>

          <Form.Item
            label="Описание"
            name="description"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Введите описание..."
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
              >
                Отправить
              </Button>
              <Button 
                size="large"
                onClick={() => form.resetFields()}
              >
                Очистить
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24, padding: 16, background: '#f6f8fa', borderRadius: 8 }}>
          <Text strong>Проверяемые функции Input:</Text>
          <ul style={{ marginTop: 8, marginLeft: 16 }}>
            <li>Обычный Input с префиксом</li>
            <li>Input.Password с префиксом</li>
            <li>Input.TextArea с счетчиком символов</li>
            <li>Валидация форм</li>
            <li>Размеры (large)</li>
            <li>Placeholder и иконки</li>
          </ul>
        </div>
      </Card>
    </div>
  );
} 