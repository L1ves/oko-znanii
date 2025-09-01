import React from 'react';
import { Card, List, Tag, Button, Space, Typography, Divider } from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  BookOutlined,
  FileTextOutlined,
  StarOutlined
} from '@ant-design/icons';
import { ExpertOrder } from '../../types/expert';
import { formatCurrency } from '../../utils/formatters';

const { Text, Title } = Typography;

interface ActiveOrdersProps {
  orders: ExpertOrder[];
  onViewOrder: (orderId: number) => void;
}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({ orders, onViewOrder }) => {
  // Убеждаемся, что orders - это массив
  const safeOrders = Array.isArray(orders) ? orders : [];

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

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <Text type="danger">Просрочен</Text>;
    } else if (diffDays === 0) {
      return <Text type="warning">Сегодня</Text>;
    } else if (diffDays === 1) {
      return <Text type="warning">Завтра</Text>;
    } else {
      return <Text>{diffDays} дней</Text>;
    }
  };

  if (safeOrders.length === 0) {
    return (
      <Card title="Активные заказы">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
          <div style={{ marginTop: '16px', color: '#8c8c8c' }}>
            У вас пока нет активных заказов
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Активные заказы">
      <List
        dataSource={safeOrders}
        renderItem={(order) => (
          <List.Item
            actions={[
              <Button 
                type="primary" 
                onClick={() => onViewOrder(order.id)}
              >
                Просмотреть
              </Button>
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Title level={5} style={{ margin: 0 }}>
                    {order.title || 'Без названия'}
                  </Title>
                  <Tag color={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Tag>
                </Space>
              }
              description={
                <div>
                  {order.description && (
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary">{order.description}</Text>
                    </div>
                  )}
                  
                  <Space wrap>
                    <Space>
                      <UserOutlined />
                      <Text>Клиент: {order.client?.username || 'Неизвестно'}</Text>
                    </Space>
                    
                    {order.subject && (
                      <Space>
                        <BookOutlined />
                        <Text>{order.subject.name}</Text>
                      </Space>
                    )}
                    
                    {order.work_type && (
                      <Space>
                        <FileTextOutlined />
                        <Text>{order.work_type.name}</Text>
                      </Space>
                    )}
                    
                    {order.complexity && (
                      <Space>
                        <StarOutlined />
                        <Text>{order.complexity.name}</Text>
                      </Space>
                    )}
                  </Space>
                </div>
              }
            />
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text strong style={{ fontSize: '16px' }}>
                  {formatCurrency(order.budget || 0)}
                </Text>
              </div>
              
              <Space direction="vertical" size="small">
                <Space>
                  <ClockCircleOutlined />
                  <Text type="secondary">Срок:</Text>
                  {formatDeadline(order.deadline)}
                </Space>
                
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Создан: {new Date(order.created_at).toLocaleDateString('ru-RU')}
                </Text>
              </Space>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ActiveOrders; 