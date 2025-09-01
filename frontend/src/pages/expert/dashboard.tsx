import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Alert } from 'antd';
import { useRouter } from 'next/router';
import ExpertDashboard from '../../components/expert/ExpertDashboard';
import ActiveOrders from '../../components/expert/ActiveOrders';
import AvailableOrders from '../../components/expert/AvailableOrders';
import { 
  useExpertStatistics, 
  useActiveOrders, 
  useAvailableOrders,
  useTakeOrder 
} from '../../hooks/useExpert';

const ExpertDashboardPage: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Получаем данные
  const { 
    data: statistics, 
    isLoading: statisticsLoading, 
    error: statisticsError 
  } = useExpertStatistics();
  
  const { 
    data: activeOrders, 
    isLoading: activeOrdersLoading, 
    error: activeOrdersError 
  } = useActiveOrders();
  
  const { 
    data: availableOrders, 
    isLoading: availableOrdersLoading, 
    error: availableOrdersError,
    refetch: refetchAvailableOrders
  } = useAvailableOrders();

  const takeOrderMutation = useTakeOrder();

  const handleViewOrder = (orderId: number) => {
    router.push(`/expert/orders/${orderId}`);
  };

  const handleOrderTaken = () => {
    refetchAvailableOrders();
  };

  // Если мы на сервере, показываем загрузку
  if (!isClient) {
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

  // Проверяем токен
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('access_token');
  
  if (!hasToken) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Требуется авторизация"
          description="Для доступа к дашборду специалиста необходимо войти в систему."
          type="warning"
          showIcon
          action={
            <button onClick={() => router.push('/auth/login')}>
              Войти
            </button>
          }
        />
      </div>
    );
  }

  // Проверяем ошибки
  if (statisticsError || activeOrdersError || availableOrdersError) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Ошибка загрузки данных"
          description="Не удалось загрузить данные дашборда. Пожалуйста, попробуйте позже."
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Показываем загрузку
  if (statisticsLoading || activeOrdersLoading || availableOrdersLoading) {
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

  return (
    <div style={{ padding: '24px' }}>
      {/* Статистика */}
      {statistics && (
        <div style={{ marginBottom: '24px' }}>
          <ExpertDashboard statistics={statistics} />
        </div>
      )}

      <Row gutter={[24, 24]}>
        {/* Активные заказы */}
        <Col xs={24} lg={12}>
          <ActiveOrders 
            orders={activeOrders || []} 
            onViewOrder={handleViewOrder}
          />
        </Col>

        {/* Доступные заказы */}
        <Col xs={24} lg={12}>
          <AvailableOrders 
            orders={availableOrders || []} 
            onOrderTaken={handleOrderTaken}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ExpertDashboardPage; 