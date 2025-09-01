import React, { useState } from 'react';
import { List, Card, Space, Tag, Input, Select, Button, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Order } from '@/types/orders';
import { formatCurrency, formatDate } from '@/utils/formatters';

const { Search } = Input;
const { Option } = Select;

interface OrderListProps {
  orders: Order[];
  loading?: boolean;
  onSearch?: (query: string) => void;
  onFilter?: (filters: OrderFilters) => void;
  onSort?: (sort: OrderSort) => void;
}

export interface OrderFilters {
  status?: string[];
  subject?: string[];
  priceRange?: [number, number];
  deadline?: [Date, Date];
}

export interface OrderSort {
  field: 'price' | 'deadline' | 'created_at';
  order: 'asc' | 'desc';
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading = false,
  onSearch,
  onFilter,
  onSort,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<OrderFilters>({});
  const [sort, setSort] = useState<OrderSort>({ field: 'created_at', order: 'desc' });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleSortChange = (field: OrderSort['field']) => {
    const newSort: OrderSort = {
      field,
      order: sort.field === field && sort.order === 'asc' ? 'desc' : 'asc',
    };
    setSort(newSort);
    onSort?.(newSort);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'green';
      case 'in_progress':
        return 'blue';
      case 'review':
        return 'orange';
      case 'completed':
        return 'purple';
      default:
        return 'default';
    }
  };

  const renderFilters = () => (
    <Card size="small" className="filters-card">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Поиск по заказам"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            mode="multiple"
            placeholder="Статус"
            style={{ width: '100%' }}
            value={filters.status}
            onChange={(value) => handleFilterChange({ ...filters, status: value })}
          >
            <Option value="new">Новый</Option>
            <Option value="in_progress">В работе</Option>
            <Option value="review">На проверке</Option>
            <Option value="completed">Завершен</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            mode="multiple"
            placeholder="Предмет"
            style={{ width: '100%' }}
            value={filters.subject}
            onChange={(value) => handleFilterChange({ ...filters, subject: value })}
          >
            <Option value="math">Математика</Option>
            <Option value="physics">Физика</Option>
            <Option value="programming">Программирование</Option>
            <Option value="other">Другое</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Space>
            <Button
              icon={<SortAscendingOutlined />}
              onClick={() => handleSortChange('price')}
            >
              По цене
            </Button>
            <Button
              icon={<SortAscendingOutlined />}
              onClick={() => handleSortChange('deadline')}
            >
              По сроку
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  return (
    <div className="order-list">
      {renderFilters()}
      
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 4,
        }}
        dataSource={orders}
        loading={loading}
        renderItem={(order) => (
          <List.Item>
            <Card
              title={order.title}
              extra={
                <Tag color={getStatusColor(order.status)}>
                  {order.status}
                </Tag>
              }
            >
              <p>{order.description}</p>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <strong>Бюджет:</strong> {formatCurrency(order.budget)}
                </div>
                <div>
                  <strong>Срок сдачи:</strong> {formatDate(order.deadline)}
                </div>
                <div>
                  <strong>Предмет:</strong> {order.subject}
                </div>
              </Space>
            </Card>
          </List.Item>
        )}
      />

      <style jsx>{`
        .order-list {
          padding: 24px;
        }
        .filters-card {
          margin-bottom: 24px;
        }
        :global(.ant-card-body) {
          padding: 16px;
        }
        :global(.ant-list-item) {
          padding: 8px;
        }
      `}</style>
    </div>
  );
}; 