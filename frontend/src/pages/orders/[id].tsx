import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Typography, Card, Descriptions, Button, Modal, Spin, Alert } from 'antd';
import api from '@/utils/api';
import { useDiscounts } from '@/hooks/useDiscounts';
import { DiscountCard } from '@/components/discounts/DiscountCard';
import { formatCurrency, formatDate } from '@/utils/formatters';

const { Title } = Typography;

interface Order {
  id: number;
  title: string;
  description: string;
  status: string;
  budget: number;
  original_price?: number;
  discount_amount?: number;
  final_price?: number;
  discount?: {
    id: number;
    name: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    value: number;
    discount_display: string;
  };
  created_at: string;
  deadline: string;
}

const OrderPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);

  const {
    discounts,
    loading: discountsLoading,
    error: discountsError,
    applyDiscount,
    removeDiscount,
  } = useDiscounts();

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Order>(`/api/orders/${id}/`);
      setOrder(response.data);
    } catch (err) {
      setError('Не удалось загрузить заказ');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id, fetchOrder]);

  const handleApplyDiscount = async (discountId: number) => {
    if (!order) return;

    const success = await applyDiscount(order.id, discountId);
    if (success) {
      setIsDiscountModalVisible(false);
      fetchOrder();
    }
  };

  const handleRemoveDiscount = async () => {
    if (!order) return;

    const success = await removeDiscount(order.id);
    if (success) {
      fetchOrder();
    }
  };

  if (loading) {
    return (
      <div className="order-loading">
        <Spin size="large" />
        <style jsx>{`
          .order-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
          }
        `}</style>
      </div>
    );
  }

  if (error || !order) {
    return (
      <Alert
        message="Ошибка"
        description={error || 'Заказ не найден'}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="order-page">
      <Title level={2}>Заказ #{order.id}</Title>

      <Card>
        <Descriptions title="Информация о заказе" bordered>
          <Descriptions.Item label="Название">{order.title}</Descriptions.Item>
          <Descriptions.Item label="Статус">{order.status}</Descriptions.Item>
          <Descriptions.Item label="Дата создания">
            {formatDate(order.created_at)}
          </Descriptions.Item>
          <Descriptions.Item label="Срок сдачи">
            {formatDate(order.deadline)}
          </Descriptions.Item>
          <Descriptions.Item label="Стоимость" span={2}>
            {order.discount ? (
              <>
                <div className="price-with-discount">
                  <span className="original-price">{formatCurrency(order.original_price!)}</span>
                  <span className="discount-amount">-{formatCurrency(order.discount_amount!)}</span>
                  <span className="final-price">{formatCurrency(order.final_price!)}</span>
                </div>
                <div className="discount-info">
                  <span>Применена скидка: {order.discount.discount_display}</span>
                  <Button type="link" onClick={handleRemoveDiscount}>
                    Удалить скидку
                  </Button>
                </div>
              </>
            ) : (
              <>
                {formatCurrency(order.budget)}
                <Button type="link" onClick={() => setIsDiscountModalVisible(true)}>
                  Применить скидку
                </Button>
              </>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Описание" span={3}>
            {order.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="Выберите скидку"
        open={isDiscountModalVisible}
        onCancel={() => setIsDiscountModalVisible(false)}
        footer={null}
        width={800}
      >
        {discountsLoading ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Spin />
          </div>
        ) : discountsError ? (
          <Alert message={discountsError} type="error" showIcon />
        ) : (
          <div className="discounts-grid">
            {discounts?.available_discounts.map((discount) => (
              <div key={discount.id} className="discount-item">
                <DiscountCard
                  discount={discount}
                  isAvailable={true}
                  onApply={handleApplyDiscount}
                />
              </div>
            ))}
          </div>
        )}
      </Modal>

      <style jsx>{`
        .order-page {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .price-with-discount {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .original-price {
          text-decoration: line-through;
          color: #999;
        }
        .discount-amount {
          color: #52c41a;
        }
        .final-price {
          font-weight: bold;
          font-size: 16px;
        }
        .discount-info {
          margin-top: 8px;
          font-size: 14px;
          color: #666;
        }
        .discounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          padding: 16px;
        }
        .discount-item {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default OrderPage; 