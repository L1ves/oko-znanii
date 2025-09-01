import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { register } from '../api/auth';

const { Title, Text } = Typography;

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function TestRegisterPage() {
  const [form] = Form.useForm();

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      message.success('Регистрация успешна!');
      console.log('Registration success:', data);
    },
    onError: (error: any) => {
      let errorMessage = 'Ошибка регистрации';
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.email) {
          errorMessage = `Email: ${errorData.email.join(', ')}`;
        } else if (errorData.username) {
          errorMessage = `Имя пользователя: ${errorData.username.join(', ')}`;
        } else if (errorData.password) {
          errorMessage = `Пароль: ${errorData.password.join(', ')}`;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors.join(', ');
        }
      } catch {
        errorMessage = error.message || 'Неизвестная ошибка';
      }
      message.error(errorMessage);
      console.error('Registration error:', error);
    }
  });

  const onFinish = (values: RegisterForm) => {
    console.log('Form values:', values);
    registerMutation.mutate({
      role: 'expert',
      ...values,
      confirmPassword: values.confirmPassword
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Тест регистрации
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
            rules={[{ required: true, message: 'Введите ваше имя' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, message: 'Пароль должен быть не менее 6 символов' }
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label="Подтверждение пароля"
            name="confirmPassword"
            dependencies={['password']}
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
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={registerMutation.isPending}
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>

        <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
          <Text strong>Статус:</Text>
          <Text>{registerMutation.isPending ? 'Отправка запроса...' : 'Готово'}</Text>
          
          {registerMutation.isError && (
            <Text type="danger">
              Ошибка: {registerMutation.error?.message}
            </Text>
          )}
          
          {registerMutation.isSuccess && (
            <Text type="success">
              Успешно! Проверьте консоль для деталей.
            </Text>
          )}
        </Space>
      </Card>
    </div>
  );
} 