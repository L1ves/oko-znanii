import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, Input, Modal, Form, DatePicker, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { fetchClientOrders, Order, createOrderMinimal } from '../../api/client';
import { fetchSubjects, fetchTopics, fetchWorkTypes, fetchComplexities, Topic, WorkType, Complexity } from '../../api/catalog';
import { Subject } from '../../types/catalog';

const { Title } = Typography;
const { Option } = Select;

const ClientOrdersPage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    ordering: '-created_at',
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['client-orders', filters],
    queryFn: () => fetchClientOrders(filters),
    staleTime: 1000 * 60 * 2, // 2 минуты
  });

  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  });

  const { data: topics, isLoading: topicsLoading, error: topicsError } = useQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
  });

  const { data: workTypes, isLoading: workTypesLoading, error: workTypesError } = useQuery({
    queryKey: ['work-types'],
    queryFn: fetchWorkTypes,
  });

  const { data: complexities, isLoading: complexitiesLoading, error: complexitiesError } = useQuery({
    queryKey: ['complexities'],
    queryFn: fetchComplexities,
  });

  // Отладочная информация
  console.log('Subjects:', subjects, 'Loading:', subjectsLoading, 'Error:', subjectsError);
  console.log('WorkTypes:', workTypes, 'Loading:', workTypesLoading, 'Error:', workTypesError);
  console.log('Complexities:', complexities, 'Loading:', complexitiesLoading, 'Error:', complexitiesError);

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

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createOrderMinimal({
        title: values.title,
        description: values.description,
        deadline: values.deadline.toISOString(),
        subject_id: Number(values.subject_id),
        topic_id: Number(values.topic_id),
        work_type_id: Number(values.work_type_id),
        complexity_id: Number(values.complexity_id),
      });
      message.success('Заказ создан');
      setIsCreateOpen(false);
      form.resetFields();
    } catch (e) {
      message.error('Не удалось создать заказ');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Мои заказы</Title>
        <Button type="primary" onClick={() => setIsCreateOpen(true)}>Создать заказ</Button>

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

        <Modal
          title="Создать заказ"
          open={isCreateOpen}
          onOk={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          okText="Создать"
          cancelText="Отмена"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Укажите название' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Описание" rules={[{ required: true, message: 'Опишите задачу' }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="deadline" label="Дедлайн" rules={[{ required: true, message: 'Укажите дедлайн' }]}>
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="subject_id" label="Предмет" rules={[{ required: true }]}>
              <Select placeholder="Выберите предмет">
                {subjects?.map((subject: Subject) => (
                  <Option key={subject.id} value={subject.id}>
                    {subject.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="topic_id" label="Тема" rules={[{ required: true }]}>
              <Select placeholder="Выберите тему">
                {topics?.map((topic: Topic) => (
                  <Option key={topic.id} value={topic.id}>
                    {topic.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="work_type_id" label="Тип работы" rules={[{ required: true }]}>
              <Select placeholder="Выберите тип работы">
                {workTypes?.map((workType: WorkType) => (
                  <Option key={workType.id} value={workType.id}>
                    {workType.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="complexity_id" label="Сложность" rules={[{ required: true }]}>
              <Select placeholder="Выберите сложность">
                {complexities?.map((complexity: Complexity) => (
                  <Option key={complexity.id} value={complexity.id}>
                    {complexity.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  );
};

export default ClientOrdersPage; 