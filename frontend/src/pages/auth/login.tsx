import { Card, Form, Input, Button, Typography, Divider, message } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/auth';

const { Title } = Typography;

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      message.success('Успешный вход');
      router.push('/profile');
    },
    onError: (error: any) => {
      let errorMessage = 'Ошибка входа';
      try {
        const errorData = error.response?.data;
        if (errorData?.detail) {
          errorMessage = errorData.detail;
        } else if (errorData?.non_field_errors) {
          errorMessage = errorData.non_field_errors.join(', ');
        }
      } catch {
        errorMessage = 'Проверьте email и пароль';
      }
      message.error(errorMessage);
    }
  });

  const onFinish = (values: LoginForm) => {
    loginMutation.mutate(values);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: 'calc(100vh - 64px)',
      padding: '24px'
    }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Вход в систему
        </Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={loginMutation.isPending}
            >
              Войти
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Typography.Text>
            Нет аккаунта?{' '}
            <Link href="/auth/register">
              Зарегистрироваться
            </Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
} 