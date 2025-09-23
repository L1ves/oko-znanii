import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, List, Typography, Tag, message, Upload, Space, InputNumber, Input, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ordersApi, type Order, type OrderComment } from '../api/orders';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

const { Title, Text } = Typography;

const ExpertDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [bidLoading, setBidLoading] = useState<Record<number, boolean>>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ['available-orders'],
    queryFn: () => ordersApi.getAvailableOrders(),
  });

  const { data: myInProgress } = useQuery({
    queryKey: ['my-orders-in-progress'],
    queryFn: () => ordersApi.getMyOrders({ status: 'in_progress' }),
  });

  const { data: myCompleted } = useQuery({
    queryKey: ['my-orders-completed'],
    queryFn: () => ordersApi.getMyOrders({ status: 'completed' }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'blue';
      case 'in_progress': return 'orange';
      case 'review': return 'purple';
      case 'revision': return 'magenta';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Создан';
      case 'in_progress': return 'В работе';
      case 'review': return 'На проверке';
      case 'revision': return 'На доработке';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const takeMutation = useMutation({
    mutationFn: (orderId: number) => ordersApi.takeOrder(orderId),
    onSuccess: () => {
      message.success('Заказ взят в работу');
      queryClient.invalidateQueries({ queryKey: ['available-orders'] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.detail || 'Не удалось взять заказ');
    },
  });

  if (isLoading) return <Text>Загрузка...</Text>;
  if (isError) return <Text type="danger">Ошибка загрузки заказов</Text>;

  const orders: Order[] = data || [];

  return (
    <div style={{ maxWidth: 900, margin: '24px auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Кабинет эксперта</Title>
        <Space>
          <Button onClick={() => navigate(-1)}>Назад</Button>
          <Button
            onClick={() => {
              authApi.logout();
              navigate('/');
              window.location.reload();
            }}
          >
            Выйти
          </Button>
        </Space>
      </div>
      <Title level={2}>Доступные заказы</Title>
      <List
        dataSource={orders}
        locale={{ emptyText: 'Нет доступных заказов' }}
        renderItem={(order) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                onClick={() => takeMutation.mutate(order.id)}
                loading={takeMutation.isPending}
              >
                Взять в работу
              </Button>,
              <Space>
                <InputNumber
                  min={1}
                  step={1}
                  precision={0}
                  placeholder="Ваша цена"
                  onChange={(value) => (order as any)._bidAmount = value}
                  style={{ width: 120 }}
                />
                <Button
                  loading={bidLoading[order.id]}
                  onClick={async () => {
                    try {
                      const amount = (order as any)._bidAmount;
                      if (!amount || amount <= 0) {
                        message.error('Укажите корректную сумму');
                        return;
                      }
                      setBidLoading(prev => ({ ...prev, [order.id]: true }));
                      await ordersApi.placeBid(order.id, { amount });
                      message.success('Ставка отправлена');
                      queryClient.invalidateQueries({ queryKey: ['available-orders'] });
                      queryClient.invalidateQueries({ queryKey: ['clientOrders'] });
                    } catch (e: any) {
                      message.error(e?.response?.data?.detail || e?.response?.data?.amount || 'Не удалось отправить ставку');
                    } finally {
                      setBidLoading(prev => ({ ...prev, [order.id]: false }));
                    }
                  }}
                >
                  Предложить
                </Button>
              </Space>
            ]}
          >
            <Card style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>{order.title}</Title>
                  <Text type="secondary">#{order.id}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">{order.subject?.name}</Tag>
                    <Tag>{order.work_type?.name}</Tag>
                    <Tag color="green">до {dayjs(order.deadline).format('DD.MM.YYYY')}</Tag>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Title level={4} style={{ margin: 0 }}>{order.budget} ₽</Title>
                  <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <Text>{order.description}</Text>
              </div>
              <div style={{ marginTop: 12 }}>
                <strong>Чат по заказу</strong>
                <OrderChat orderId={order.id} />
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Title level={3} style={{ marginTop: 32 }}>Мои заказы (в работе)</Title>
      <List
        dataSource={(myInProgress as Order[] | undefined) || []}
        locale={{ emptyText: 'Нет заказов в работе' }}
        renderItem={(order) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await ordersApi.submitOrder(order.id);
                    message.success('Отправлено на проверку');
                    queryClient.invalidateQueries({ queryKey: ['my-orders-in-progress'] });
                  } catch (e: any) {
                    message.error(e?.response?.data?.detail || 'Не удалось отправить на проверку');
                  }
                }}
              >
                Отправить на проверку
              </Button>,
              <Upload
                beforeUpload={async (file) => {
                  try {
                    await ordersApi.uploadOrderFile(order.id, file, { file_type: 'solution' });
                    message.success('Файл загружен');
                    queryClient.invalidateQueries({ queryKey: ['my-orders-in-progress'] });
                  } catch (e: any) {
                    message.error(e?.response?.data?.detail || 'Ошибка загрузки файла');
                  }
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Загрузить файл</Button>
              </Upload>,
            ]}
          >
            <Card style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>{order.title}</Title>
                  <Text type="secondary">#{order.id}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">{order.subject?.name}</Tag>
                    <Tag>{order.work_type?.name}</Tag>
                    <Tag color="green">до {dayjs(order.deadline).format('DD.MM.YYYY')}</Tag>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Title level={4} style={{ margin: 0 }}>{order.budget} ₽</Title>
                  <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <Text>{order.description}</Text>
              </div>
              <div style={{ marginTop: 12 }}>
                <strong>Чат по заказу</strong>
                <OrderChat orderId={order.id} />
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Title level={3} style={{ marginTop: 32 }}>Мои заказы (завершенные)</Title>
      <List
        dataSource={(myCompleted as Order[] | undefined) || []}
        locale={{ emptyText: 'Нет завершенных заказов' }}
        renderItem={(order) => (
          <List.Item>
            <Card style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>{order.title}</Title>
                  <Text type="secondary">#{order.id}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">{order.subject?.name}</Tag>
                    <Tag>{order.work_type?.name}</Tag>
                    <Tag color="green">до {dayjs(order.deadline).format('DD.MM.YYYY')}</Tag>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Title level={4} style={{ margin: 0 }}>{order.budget} ₽</Title>
                  <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <Text>{order.description}</Text>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ExpertDashboard;

// Простой чат-компонент для заказа (MVP)
const OrderChat: React.FC<{ orderId: number }> = ({ orderId }) => {
  const [text, setText] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['order-comments', orderId],
    queryFn: () => ordersApi.getComments(orderId),
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const raw = (data as any) || [];
  const comments: OrderComment[] = Array.isArray(raw) ? raw : Array.isArray(raw.results) ? raw.results : [];

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments?.length]);

  const authorName = (c: OrderComment) => c?.author?.username || (c?.author?.id ? `Пользователь #${c.author.id}` : 'Пользователь');

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 12, marginTop: 8 }}>
      <div ref={scrollRef} style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 8 }}>
        {isLoading ? (
          <Spin size="small" />
        ) : comments.length === 0 ? (
          <div style={{ color: '#999', fontStyle: 'italic' }}>Сообщений пока нет</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {comments.map((c) => (
              <li key={c.id} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {authorName(c)} — {dayjs(c.created_at).format('DD.MM HH:mm')}
                </div>
                <div>{c.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 3 }}
          placeholder="Напишите сообщение"
        />
        <Button
          type="primary"
          disabled={!text.trim() || sending}
          loading={sending}
          onClick={async () => {
            if (!text.trim()) return;
            try {
              setSending(true);
              await ordersApi.addComment(orderId, text.trim());
              setText('');
              await refetch();
            } catch (e: any) {
              message.error(e?.response?.data?.detail || 'Не удалось отправить сообщение');
            } finally {
              setSending(false);
            }
          }}
        >
          Отправить
        </Button>
      </div>
    </div>
  );
};
