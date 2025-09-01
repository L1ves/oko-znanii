import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button } from 'antd';
import { 
  ShoppingCartOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  DollarOutlined,
  WalletOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { fetchClientDashboard } from '../../api/client';
import { ClientStatistics } from '../../api/client';
import RecentOrders from './RecentOrders';
import ActiveOrders from './ActiveOrders';

const { Title } = Typography;

const ClientDashboard: React.FC = () => {
  const router = useRouter();
  
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['client-dashboard'],
    queryFn: fetchClientDashboard,
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  if (isLoading) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div>Загрузка данных...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div>Ошибка загрузки данных</div>
        </Card>
      </div>
    );
  }

  const stats = dashboard?.statistics;

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Заголовок */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Личный кабинет</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => router.push('/orders/new')}
          >
            Создать заказ
          </Button>
        </div>

        {/* Статистика */}
        <Card title="Статистика">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Всего заказов"
                value={stats?.total_orders || 0}
                prefix={<ShoppingCartOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Выполнено"
                value={stats?.completed_orders || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="В работе"
                value={stats?.active_orders || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Потрачено"
                value={stats?.total_spent || 0}
                prefix={<DollarOutlined />}
                suffix="₽"
                precision={2}
              />
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Средний чек"
                value={stats?.average_order_price || 0}
                prefix={<DollarOutlined />}
                suffix="₽"
                precision={2}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Баланс"
                value={stats?.balance || 0}
                prefix={<WalletOutlined />}
                suffix="₽"
                precision={2}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Заморожено"
                value={stats?.frozen_balance || 0}
                prefix={<WalletOutlined />}
                suffix="₽"
                precision={2}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Активные заказы */}
        <ActiveOrders orders={dashboard?.active_orders || []} />

        {/* Последние заказы */}
        <RecentOrders orders={dashboard?.recent_orders || []} />
      </Space>
    </div>
  );
};

export default ClientDashboard; 