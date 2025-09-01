import React from 'react';
import { Card, Row, Col, Tag, Rate, List, Typography, Space, Divider } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  FileTextOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { ExpertProfile as ExpertProfileType } from '../../types/expert';

const { Text, Title } = Typography;

interface ExpertProfileProps {
  profile: ExpertProfileType;
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ profile }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="expert-profile">
      <Title level={2}>Профиль специалиста</Title>
      
      {/* Основная информация */}
      <Card title="Основная информация" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="small">
              <Space>
                <UserOutlined />
                <Text strong>Имя пользователя:</Text>
                <Text>{profile.user.username}</Text>
              </Space>
              
              <Space>
                <UserOutlined />
                <Text strong>Имя:</Text>
                <Text>{profile.user.first_name || 'Не указано'}</Text>
              </Space>
              
              <Space>
                <UserOutlined />
                <Text strong>Фамилия:</Text>
                <Text>{profile.user.last_name || 'Не указано'}</Text>
              </Space>
              
              <Space>
                <UserOutlined />
                <Text strong>Email:</Text>
                <Text>{profile.user.email}</Text>
              </Space>
            </Space>
          </Col>
          
          <Col xs={24} md={12}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '16px' }}>
                <Rate 
                  disabled 
                  value={profile.user.rating} 
                  allowHalf 
                  style={{ fontSize: '24px' }}
                />
              </div>
              <Text strong style={{ fontSize: '18px' }}>
                Рейтинг: {profile.user.rating.toFixed(1)}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Специализации */}
      <Card title="Специализации" style={{ marginBottom: '24px' }}>
        {profile.specializations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <BookOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <div style={{ marginTop: '16px', color: '#8c8c8c' }}>
              У вас пока нет специализаций
            </div>
          </div>
        ) : (
          <List
            dataSource={profile.specializations}
            renderItem={(spec) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{spec.subject.name}</Text>
                      {spec.is_verified && (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          Проверена
                        </Tag>
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      <Space wrap style={{ marginBottom: '8px' }}>
                        <Space>
                          <ClockCircleOutlined />
                          <Text>Опыт: {spec.experience_years} лет</Text>
                        </Space>
                        
                        <Space>
                          <StarOutlined />
                          <Text>Ставка: {spec.hourly_rate} ₽/час</Text>
                        </Space>
                      </Space>
                      
                      {spec.description && (
                        <div>
                          <Text type="secondary">{spec.description}</Text>
                        </div>
                      )}
                      
                      <div style={{ marginTop: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Добавлена: {formatDate(spec.created_at)}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Документы */}
      <Card title="Документы" style={{ marginBottom: '24px' }}>
        {profile.documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <div style={{ marginTop: '16px', color: '#8c8c8c' }}>
              У вас пока нет загруженных документов
            </div>
          </div>
        ) : (
          <List
            dataSource={profile.documents}
            renderItem={(doc) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{doc.title}</Text>
                      <Tag color={doc.document_type === 'diploma' ? 'blue' : 
                                   doc.document_type === 'certificate' ? 'green' : 
                                   doc.document_type === 'award' ? 'gold' : 'default'}>
                        {doc.document_type === 'diploma' ? 'Диплом' :
                         doc.document_type === 'certificate' ? 'Сертификат' :
                         doc.document_type === 'award' ? 'Награда' : 'Другое'}
                      </Tag>
                      {doc.is_verified && (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          Проверен
                        </Tag>
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      {doc.description && (
                        <div style={{ marginBottom: '8px' }}>
                          <Text type="secondary">{doc.description}</Text>
                        </div>
                      )}
                      
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Загружен: {formatDate(doc.created_at)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Отзывы */}
      <Card title="Последние отзывы">
        {profile.reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <StarOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <div style={{ marginTop: '16px', color: '#8c8c8c' }}>
              У вас пока нет отзывов
            </div>
          </div>
        ) : (
          <List
            dataSource={profile.reviews}
            renderItem={(review) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>Отзыв от {review.client.username}</Text>
                      <Rate 
                        disabled 
                        value={review.rating} 

                      />
                      <Text type="secondary">({review.rating}/5)</Text>
                    </Space>
                  }
                  description={
                    <div>
                      {review.comment && (
                        <div style={{ marginBottom: '8px' }}>
                          <Text>{review.comment}</Text>
                        </div>
                      )}
                      
                      <Space>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Заказ: {review.order.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {formatDate(review.created_at)}
                        </Text>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default ExpertProfile; 