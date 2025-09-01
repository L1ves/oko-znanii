import React, { useState } from 'react';
import { Tabs, Spin, Alert, List, Tag, Button, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  BookOutlined,
  FileTextOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useActiveOrders, useAvailableOrders, useRecentOrders } from '../../hooks/useExpert';
import { formatCurrency } from '../../utils/formatters';

const { Text, Title } = Typography;

const ExpertOrdersPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');

  // Получаем данные
  const { 
    data: activeOrders, 
    isLoading: activeOrdersLoading, 
    error: activeOrdersError 
  } = useActiveOrders();
  
  const { 
    data: availableOrders, 
    isLoading: availableOrdersLoading, 
    error: availableOrdersError 
  } = useAvailableOrders();

  const { 
    data: recentOrders, 
    isLoading: recentOrdersLoading, 
    error: recentOrdersError 
  } = useRecentOrders();

  const handleViewOrder = (orderId: number) => {
    router.push(`/expert/orders/${orderId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'processing';
      case 'review':
        return 'warning';
      case 'revision':
        return 'error';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'default';
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
      case 'completed':
        return 'Выполнен';
      case 'cancelled':
        return 'Отменен';
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

  // Проверяем ошибки
  if (activeOrdersError || availableOrdersError || recentOrdersError) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Ошибка загрузки заказов"
          description="Не удалось загрузить данные заказов. Пожалуйста, попробуйте позже."
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Показываем загрузку
  if (activeOrdersLoading || availableOrdersLoading || recentOrdersLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  const renderOrdersList = (orders: any[], emptyText: string) => (
    <List
      dataSource={orders}
      locale={{
        emptyText: (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <div style={{ marginTop: '16px', color: '#8c8c8c' }}>
              {emptyText}
            </div>
          </div>
        )
      }}
      renderItem={(order) => (
        <List.Item
          actions={[
            <Button 
              type="primary" 
              onClick={() => handleViewOrder(order.id)}
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
                    <Text>Клиент: {order.client.username}</Text>
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
                {formatCurrency(order.budget)}
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
  );

  const tabs = [
    {
      key: 'active',
      label: 'Активные заказы',
      children: renderOrdersList(
        activeOrders || [], 
        'У вас пока нет активных заказов'
      )
    },
    {
      key: 'available',
      label: 'Доступные заказы',
      children: renderOrdersList(
        availableOrders || [], 
        'Сейчас нет доступных заказов по вашим специализациям'
      )
    },
    {
      key: 'recent',
      label: 'Последние заказы',
      children: renderOrdersList(
        recentOrders || [], 
        'У вас пока нет заказов'
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Мои заказы</Title>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={tabs}
      />
    </div>
  );
};

export default ExpertOrdersPage; 