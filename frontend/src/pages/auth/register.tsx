import { Card, Form, Input, Button, Typography, Divider, message, Tabs, Select, Space } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../api/auth';
import { UserOutlined, BookOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ClientRegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ExpertRegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  about: string;
  education: string;
  experience_years: number;
  hourly_rate: number;
  specializations: string[];
}

export default function RegisterPage() {
  const router = useRouter();
  const [clientForm] = Form.useForm();
  const [expertForm] = Form.useForm();

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      message.success('Регистрация успешна! Добро пожаловать!');
      // Перенаправляем в зависимости от роли
      if (data.user.role === 'client') {
        router.push('/client/dashboard');
      } else if (data.user.role === 'expert') {
        router.push('/expert/dashboard');
      } else {
        router.push('/profile');
      }
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
    }
  });

  const onClientFinish = (values: ClientRegisterForm) => {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate({
      ...userData,
      confirmPassword,
      role: 'client'
    });
  };

  const onExpertFinish = (values: ExpertRegisterForm) => {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate({
      ...userData,
      confirmPassword,
      role: 'expert'
    });
  };

  const clientFormItems = [
    {
      key: 'client',
      label: (
        <Space>
          <UserOutlined />
          Клиент
        </Space>
      ),
      children: (
        <Form
          form={clientForm}
          layout="vertical"
          onFinish={onClientFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Введите ваше имя' }]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Ваше полное имя" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' }
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="example@email.com" />
          </Form.Item>

          <Form.Item
            label="Телефон"
            name="phone"
            rules={[
              { required: true, message: 'Введите номер телефона' },
              { 
                pattern: /^\+?[1-9]\d{10,14}$/, 
                message: 'Введите корректный номер телефона' 
              }
            ]}
          >
            <Input size="large" prefix={<PhoneOutlined />} placeholder="+7 (999) 123-45-67" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, message: 'Пароль должен быть не менее 6 символов' }
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Минимум 6 символов" />
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
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Повторите пароль" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={registerMutation.isPending}
            >
              Зарегистрироваться как клиент
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'expert',
      label: (
        <Space>
          <BookOutlined />
          Специалист
        </Space>
      ),
      children: (
        <Form
          form={expertForm}
          layout="vertical"
          onFinish={onExpertFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Введите ваше имя' }]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Ваше полное имя" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' }
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="example@email.com" />
          </Form.Item>

          <Form.Item
            label="Телефон"
            name="phone"
            rules={[
              { required: true, message: 'Введите номер телефона' },
              { 
                pattern: /^\+?[1-9]\d{10,14}$/, 
                message: 'Введите корректный номер телефона' 
              }
            ]}
          >
            <Input size="large" prefix={<PhoneOutlined />} placeholder="+7 (999) 123-45-67" />
          </Form.Item>

          <Form.Item
            label="О себе"
            name="about"
            rules={[{ required: true, message: 'Расскажите о себе' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Расскажите о своем опыте, образовании и специализации..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Образование"
            name="education"
            rules={[{ required: true, message: 'Укажите образование' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Укажите ваше образование, дипломы, сертификаты..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Опыт работы (лет)"
            name="experience_years"
            rules={[{ required: true, message: 'Укажите опыт работы' }]}
          >
            <Input 
              type="number" 
              size="large" 
              min={0}
              max={50}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            label="Часовая ставка (₽)"
            name="hourly_rate"
            rules={[{ required: true, message: 'Укажите часовую ставку' }]}
          >
            <Input 
              type="number" 
              size="large" 
              min={0}
              placeholder="1000"
            />
          </Form.Item>

          <Form.Item
            label="Специализации"
            name="specializations"
            rules={[{ required: true, message: 'Выберите специализации' }]}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="Выберите или добавьте специализации"
              options={[
                { value: 'математика', label: 'Математика' },
                { value: 'физика', label: 'Физика' },
                { value: 'химия', label: 'Химия' },
                { value: 'биология', label: 'Биология' },
                { value: 'история', label: 'История' },
                { value: 'литература', label: 'Литература' },
                { value: 'английский', label: 'Английский язык' },
                { value: 'программирование', label: 'Программирование' },
                { value: 'экономика', label: 'Экономика' },
                { value: 'юриспруденция', label: 'Юриспруденция' },
                { value: 'медицина', label: 'Медицина' },
                { value: 'психология', label: 'Психология' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, message: 'Пароль должен быть не менее 6 символов' }
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Минимум 6 символов" />
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
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Повторите пароль" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={registerMutation.isPending}
            >
              Зарегистрироваться как специалист
            </Button>
          </Form.Item>
        </Form>
      ),
    }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: 'calc(100vh - 64px)',
      padding: '24px'
    }}>
      <Card style={{ width: '100%', maxWidth: 600 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Регистрация
        </Title>
        
        <Tabs
          defaultActiveKey="client"
          items={clientFormItems}
          size="large"
        />

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text>
            Уже есть аккаунт?{' '}
            <Link href="/auth/login">
              Войти
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
} 