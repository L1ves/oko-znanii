import React from 'react';
import { Card, List, Tag, Typography, Space, Button, Progress } from 'antd';
import { ClockCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Order } from '../../api/client';

const { Text, Title } = Typography;

interface ActiveOrdersProps {
  orders: Order[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'processing';
    case 'review':
      return 'warning';
    case 'revision':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'В работе';
    case 'review':
      return 'На проверке';
    case 'revision':
      return 'На доработке';
    default:
      return status;
  }
};

const getProgressPercent = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 50;
    case 'review':
      return 80;
    case 'revision':
      return 60;
    default:
      return 0;
  }
};

const ActiveOrders: React.FC<ActiveOrdersProps> = ({ orders }) => {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <Card title="Активные заказы">
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <Text type="secondary">У вас нет активных заказов</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Активные заказы">
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
                      <CalendarOutlined /> Дедлайн: {new Date(order.deadline).toLocaleDateString()}
                    </Text>
                    <Text type="secondary">
                      <ClockCircleOutlined /> Создан: {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </Space>
                  
                  {order.expert && (
                    <Space>
                      <UserOutlined />
                      <Text type="secondary">
                        Эксперт: {order.expert.name}
                        {order.expert.rating && ` (${order.expert.rating}/5)`}
                      </Text>
                    </Space>
                  )}
                  
                  <Progress 
                    percent={getProgressPercent(order.status)} 
                    size="small" 
                    status={order.status === 'revision' ? 'exception' : 'active'}
                  />
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
              </Space>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ActiveOrders; 