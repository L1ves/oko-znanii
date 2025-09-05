import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, Typography, message, DatePicker, Space } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { catalogApi } from '../api/catalog';
import { ordersApi, type CreateOrderRequest } from '../api/orders';
// import { authApi } from '../api/auth';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

const CreateOrder: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedSubject, setSelectedSubject] = useState<number | undefined>();

  // Загружаем данные каталога
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: catalogApi.getSubjects,
  });

  const { data: topics = [], isLoading: topicsLoading } = useQuery({
    queryKey: ['topics', selectedSubject],
    queryFn: () => catalogApi.getTopics(selectedSubject),
    enabled: !!selectedSubject,
  });

  const { data: workTypes = [], isLoading: workTypesLoading } = useQuery({
    queryKey: ['workTypes'],
    queryFn: catalogApi.getWorkTypes,
  });

  const { data: complexities = [], isLoading: complexitiesLoading } = useQuery({
    queryKey: ['complexities'],
    queryFn: catalogApi.getComplexities,
  });

  // Мутация для создания заказа
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CreateOrderRequest) => ordersApi.create(orderData),
    onSuccess: () => {
      message.success('Заказ создан успешно!');
      form.resetFields();
    },
    onError: () => {
      message.error('Ошибка создания заказа');
    },
  });

  const onFinish = (values: any) => {
    const orderData: CreateOrderRequest = {
      title: values.title,
      description: values.description,
      deadline: values.deadline?.format('YYYY-MM-DD'),
      subject_id: values.subject_id,
      topic_id: values.topic_id,
      work_type_id: values.work_type_id,
      complexity_id: values.complexity_id,
    };
    createOrderMutation.mutate(orderData);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
          Создать заказ
        </Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            deadline: dayjs().add(7, 'day'),
          }}
        >
          <Form.Item
            name="title"
            label="Название заказа"
            rules={[{ required: true, message: 'Введите название заказа' }]}
          >
            <Input placeholder="Например: Курсовая работа по экономике" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание задания"
            rules={[{ required: true, message: 'Введите описание задания' }]}
          >
            <TextArea
              rows={4}
              placeholder="Подробно опишите задание, требования, объем работы..."
            />
          </Form.Item>

          <Form.Item
            name="subject_id"
            label="Предмет"
            rules={[{ required: true, message: 'Выберите предмет' }]}
          >
            <Select
              placeholder="Выберите предмет"
              loading={subjectsLoading}
              onChange={(value) => setSelectedSubject(value)}
            >
              {subjects.map((subject) => (
                <Select.Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="topic_id"
            label="Тема"
            rules={[{ required: true, message: 'Выберите тему' }]}
          >
            <Select
              placeholder="Выберите тему"
              loading={topicsLoading}
              disabled={!selectedSubject}
            >
              {topics.map((topic) => (
                <Select.Option key={topic.id} value={topic.id}>
                  {topic.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="work_type_id"
            label="Тип работы"
            rules={[{ required: true, message: 'Выберите тип работы' }]}
          >
            <Select
              placeholder="Выберите тип работы"
              loading={workTypesLoading}
            >
              {workTypes.map((workType) => (
                <Select.Option key={workType.id} value={workType.id}>
                  {workType.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="complexity_id"
            label="Сложность"
            rules={[{ required: true, message: 'Выберите сложность' }]}
          >
            <Select
              placeholder="Выберите сложность"
              loading={complexitiesLoading}
            >
              {complexities.map((complexity) => (
                <Select.Option key={complexity.id} value={complexity.id}>
                  {complexity.name} (x{complexity.multiplier})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Срок выполнения"
            rules={[{ required: true, message: 'Выберите срок выполнения' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createOrderMutation.isPending}>
                Создать заказ
              </Button>
              <Button onClick={() => form.resetFields()}>
                Очистить
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateOrder;
