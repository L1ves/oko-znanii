import React from 'react';
import { Card, List, Tag, Typography, Space, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Order } from '../../api/client';

const { Text } = Typography;

interface RecentOrdersProps {
  orders: Order[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    case 'new':
      return 'default';
    default:
      return 'processing';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Выполнен';
    case 'cancelled':
      return 'Отменен';
    case 'new':
      return 'Новый';
    default:
      return status;
  }
};

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <Card title="Последние заказы">
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <Text type="secondary">У вас пока нет заказов</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Последние заказы"
      extra={
        <Button type="link" onClick={() => router.push('/orders')}>
          Все заказы
        </Button>
      }
    >
      <List
        dataSource={orders}
        renderItem={(order) => (
          <List.Item
            actions={[
              <Button 
                type="link" 
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                Подробнее
              </Button>
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Text strong>{order.title || `Заказ #${order.id}`}</Text>
                  <Tag color={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text type="secondary">{order.description}</Text>
                  
                  <Space>
                    {order.subject && (
                      <Text type="secondary">
                        Предмет: {order.subject.name}
                      </Text>
                    )}
                    {order.work_type && (
                      <Text type="secondary">
                        Тип: {order.work_type.name}
                      </Text>
                    )}
                  </Space>
                  
                  <Space>
                    <Text type="secondary">
                      <CalendarOutlined /> Создан: {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                    {order.expert && (
                      <Text type="secondary">
                        Эксперт: {order.expert.name}
                      </Text>
                    )}
                  </Space>
                  
                  {order.discount && (
                    <Tag color="green">
                      Скидка: {order.discount.discount_type === 'percentage' 
                        ? `${order.discount.value}%` 
                        : `${order.discount.value} ₽`}
                    </Tag>
                  )}
                </Space>
              }
            />
            
            <div style={{ textAlign: 'right' }}>
              <Space direction="vertical" size="small">
                <Text strong style={{ fontSize: '16px' }}>
                  {order.final_price || order.budget} ₽
                </Text>
                {order.discount_amount && order.discount_amount > 0 && (
                  <Text type="secondary" delete>
                    {order.original_price} ₽
                  </Text>
                )}
                {order.status === 'completed' && (
                  <Text type="success">
                    <CheckCircleOutlined /> Выполнен
                  </Text>
                )}
                {order.status === 'cancelled' && (
                  <Text type="danger">
                    <CloseCircleOutlined /> Отменен
                  </Text>
                )}
              </Space>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentOrders; 