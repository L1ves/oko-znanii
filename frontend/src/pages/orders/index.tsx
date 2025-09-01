import React, { useState, useCallback } from 'react';
import { Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { OrderList, OrderFilters, OrderSort } from '@/components/orders/OrderList';
import { useOrders } from '@/hooks/useOrders';

const { Title } = Typography;

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<OrderFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<OrderSort>({ field: 'created_at', order: 'desc' });

  const { orders, loading, error } = useOrders({ filters, searchQuery, sort });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback((newFilters: OrderFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSort = useCallback((newSort: OrderSort) => {
    setSort(newSort);
  }, []);

  const handleCreateOrder = () => {
    router.push('/orders/new');
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <Title level={2}>Мои заказы</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateOrder}
        >
          Создать заказ
        </Button>
      </div>

      <OrderList
        orders={orders || []}
        loading={loading}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
      />

      <style jsx>{`
        .orders-page {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

export default OrdersPage; 