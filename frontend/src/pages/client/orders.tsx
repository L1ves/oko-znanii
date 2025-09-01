import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, Input } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { fetchClientOrders, Order } from '../../api/client';

const { Title } = Typography;
const { Option } = Select;

const ClientOrdersPage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    ordering: '-created_at',
  });

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['client-orders', filters],
    queryFn: () => fetchClientOrders(filters),
    staleTime: 1000 * 60 * 2, // 2 минуты
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'processing';
      case 'review':
        return 'warning';
      case 'revision':
        return 'error';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Новый';
      case 'waiting_payment':
        return 'Ожидает оплаты';
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Order) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            {text || `Заказ #${record.id}`}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.subject?.name} • {record.work_type?.name}
          </div>
        </div>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Эксперт',
      dataIndex: 'expert',
      key: 'expert',
      render: (expert: any) => (
        expert ? (
          <div>
            <div>{expert.name}</div>
            {expert.rating && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                Рейтинг: {expert.rating}/5
              </div>
            )}
          </div>
        ) : (
          <span style={{ color: '#999' }}>Не назначен</span>
        )
      ),
    },
    {
      title: 'Дедлайн',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Стоимость',
      dataIndex: 'final_price',
      key: 'final_price',
      render: (finalPrice: number, record: Order) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            {finalPrice || record.budget} ₽
          </div>
          {record.discount_amount && record.discount_amount > 0 && (
            <div style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>
              {record.original_price} ₽
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/orders/${record.id}`)}
        >
          Просмотр
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Мои заказы</Title>

        {/* Фильтры */}
        <Card>
          <Space wrap>
            <Select
              placeholder="Статус заказа"
              style={{ width: 200 }}
              allowClear
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value || '' }))}
            >
              <Option value="new">Новый</Option>
              <Option value="waiting_payment">Ожидает оплаты</Option>
              <Option value="in_progress">В работе</Option>
              <Option value="review">На проверке</Option>
              <Option value="revision">На доработке</Option>
              <Option value="completed">Выполнен</Option>
              <Option value="cancelled">Отменен</Option>
            </Select>

            <Select
              placeholder="Сортировка"
              style={{ width: 200 }}
              value={filters.ordering}
              onChange={(value) => setFilters(prev => ({ ...prev, ordering: value }))}
            >
              <Option value="-created_at">Сначала новые</Option>
              <Option value="created_at">Сначала старые</Option>
              <Option value="-budget">По цене (дорогие)</Option>
              <Option value="budget">По цене (дешевые)</Option>
              <Option value="deadline">По дедлайну</Option>
            </Select>

            <Input
              placeholder="Поиск по названию"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </Space>
        </Card>

        {/* Таблица заказов */}
        <Card>
          <Table
            columns={columns}
            dataSource={ordersData?.results || []}
            loading={isLoading}
            rowKey="id"
            pagination={{
              total: ordersData?.count || 0,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} из ${total} заказов`,
            }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default ClientOrdersPage; 