import React, { useEffect, useState } from 'react';
import { Typography, Tabs, Spin, Alert } from 'antd';
import DiscountList from '@/components/discounts/DiscountList';
import { UserDiscounts } from '@/types/discounts';
import api from '@/utils/api';

const { Title } = Typography;
const { TabPane } = Tabs;

const DiscountsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<UserDiscounts | null>(null);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<UserDiscounts>('/api/catalog/discounts/available/');
      setDiscounts(response.data);
    } catch (err) {
      setError('Не удалось загрузить скидки. Пожалуйста, попробуйте позже.');
      console.error('Error fetching discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  if (loading) {
    return (
      <div className="discounts-loading">
        <Spin size="large" />
        <style jsx>{`
          .discounts-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка"
        description={error}
        type="error"
        showIcon
        style={{ maxWidth: 800, margin: '24px auto' }}
      />
    );
  }

  return (
    <div className="discounts-page">
      <Title level={1}>Скидки</Title>

      {discounts?.user_stats && (
        <div className="user-stats">
          <Alert
            message="Ваша статистика"
            description={
              <>
                <p>Выполнено заказов: {discounts.user_stats.total_orders}</p>
                <p>Общая сумма заказов: {discounts.user_stats.total_spent} ₽</p>
              </>
            }
            type="info"
            showIcon
          />
        </div>
      )}

      <Tabs defaultActiveKey="available">
        <TabPane tab="Доступные скидки" key="available">
          <DiscountList
            discounts={discounts?.available_discounts || []}
            loading={loading}
            isAvailable={true}
          />
        </TabPane>
        <TabPane tab="Скоро доступны" key="upcoming">
          <DiscountList
            discounts={discounts?.nearly_available.map(item => item.discount) || []}
            progress={discounts?.nearly_available.reduce((acc, item) => ({
              ...acc,
              [item.discount.id]: {
                orders_remaining: item.orders_remaining,
                spent_remaining: item.spent_remaining,
                min_orders: item.discount.min_orders,
                min_total_spent: item.discount.min_total_spent
              }
            }), {})}
            loading={loading}
            isAvailable={false}
          />
        </TabPane>
      </Tabs>

      <style jsx>{`
        .discounts-page {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .user-stats {
          margin: 24px 0;
        }
      `}</style>
    </div>
  );
};

export default DiscountsPage; 