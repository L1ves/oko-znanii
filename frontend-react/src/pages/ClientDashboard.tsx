import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Statistic, List, Button, Tag, Spin, Alert, Empty } from 'antd';
import { 
  PlusOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  DollarOutlined,
  FileTextOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ordersApi, type Order } from '../api/orders';
import dayjs from 'dayjs';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Получаем заказы клиента
  const { data: ordersData, isLoading, error, refetch } = useQuery({
    queryKey: ['clientOrders', selectedStatus],
    queryFn: () => ordersApi.getClientOrders({ 
      status: selectedStatus || undefined,
      ordering: '-created_at'
    }),
  });

  const orders = ordersData?.results || ordersData || [];

  // Статистика
  const totalOrders = orders.length;
  const activeOrders = orders.filter((order: Order) => 
    ['created', 'in_progress'].includes(order.status)
  ).length;
  const completedOrders = orders.filter((order: Order) => 
    order.status === 'completed'
  ).length;
  const totalSpent = orders
    .filter((order: Order) => order.status === 'completed')
    .reduce((sum: number, order: Order) => sum + parseFloat(order.budget), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'blue';
      case 'in_progress': return 'orange';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created': return 'Создан';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Загрузка дашборда...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка загрузки данных"
        description="Не удалось загрузить данные дашборда. Пожалуйста, попробуйте позже."
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => refetch()}>
            Попробовать снова
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Дашборд клиента</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/create-order')}
        >
          Создать заказ
        </Button>
      </div>

      {/* Статистика */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Всего заказов"
              value={totalOrders}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Активные заказы"
              value={activeOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Завершенные"
              value={completedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Потрачено"
              value={totalSpent}
              prefix={<DollarOutlined />}
              suffix="₽"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Фильтры */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button 
            type={selectedStatus === '' ? 'primary' : 'default'}
            onClick={() => setSelectedStatus('')}
          >
            Все заказы
          </Button>
          <Button 
            type={selectedStatus === 'created' ? 'primary' : 'default'}
            onClick={() => setSelectedStatus('created')}
          >
            Созданные
          </Button>
          <Button 
            type={selectedStatus === 'in_progress' ? 'primary' : 'default'}
            onClick={() => setSelectedStatus('in_progress')}
          >
            В работе
          </Button>
          <Button 
            type={selectedStatus === 'completed' ? 'primary' : 'default'}
            onClick={() => setSelectedStatus('completed')}
          >
            Завершенные
          </Button>
        </div>
      </Card>

      {/* Список заказов */}
      <Card title="Мои заказы">
        {orders.length === 0 ? (
          <Empty
            description="У вас пока нет заказов"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/create-order')}
            >
              Создать первый заказ
            </Button>
          </Empty>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={orders}
            renderItem={(order: Order) => (
              <List.Item
                key={order.id}
                actions={[
                  <Button 
                    type="link" 
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Подробнее
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{order.title}</span>
                      <Tag color={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <p>{order.description}</p>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <span><strong>Предмет:</strong> {order.subject?.name}</span>
                        <span><strong>Тема:</strong> {order.topic?.name}</span>
                        <span><strong>Тип работы:</strong> {order.work_type?.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <span><strong>Бюджет:</strong> {order.budget} ₽</span>
                        <span><strong>Срок:</strong> {dayjs(order.deadline).format('DD.MM.YYYY')}</span>
                        <span><strong>Создан:</strong> {dayjs(order.created_at).format('DD.MM.YYYY HH:mm')}</span>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default ClientDashboard;
