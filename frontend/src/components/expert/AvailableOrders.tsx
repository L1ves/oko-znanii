import React, { useState } from 'react';
import { Card, List, Tag, Button, Space, Typography, Modal, message } from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  BookOutlined,
  FileTextOutlined,
  StarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { ExpertOrder } from '../../types/expert';
import { formatCurrency } from '../../utils/formatters';
import { expertApi } from '../../api/expert';

const { Text, Title } = Typography;

interface AvailableOrdersProps {
  orders: ExpertOrder[];
  onOrderTaken: () => void;
}

const AvailableOrders: React.FC<AvailableOrdersProps> = ({ orders, onOrderTaken }) => {
  const [loading, setLoading] = useState<number | null>(null);

  // Убеждаемся, что orders - это массив
  const safeOrders = Array.isArray(orders) ? orders : [];

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

  const handleTakeOrder = async (orderId: number) => {
    Modal.confirm({
      title: 'Взять заказ в работу?',
      content: 'Вы уверены, что хотите взять этот заказ в работу?',
      okText: 'Да, взять',
      cancelText: 'Отмена',
      onOk: async () => {
        setLoading(orderId);
        try {
          await expertApi.takeOrder({ order_id: orderId });
          message.success('Заказ успешно взят в работу!');
          onOrderTaken();
        } catch (error) {
          message.error('Ошибка при взятии заказа в работу');
        } finally {
          setLoading(null);
        }
      }
    });
  };

  if (safeOrders.length === 0) {
    return (
      <Card title="Доступные заказы">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
          <div style={{ marginTop: '16px', color: '#8c8c8c' }}>
            Сейчас нет доступных заказов по вашим специализациям
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Доступные заказы">
      <List
        dataSource={safeOrders}
        renderItem={(order) => (
          <List.Item
            actions={[
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />}
                loading={loading === order.id}
                onClick={() => handleTakeOrder(order.id)}
              >
                Взять в работу
              </Button>
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Title level={5} style={{ margin: 0 }}>
                    {order.title || 'Без названия'}
                  </Title>
                  <Tag color="green">Новый</Tag>
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
                <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
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

export default AvailableOrders; 