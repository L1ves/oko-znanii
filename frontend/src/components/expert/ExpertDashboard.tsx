import React from 'react';
import { Card, Row, Col, Statistic, Progress, Rate } from 'antd';
import { 
  DollarOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  StarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { ExpertStatistics } from '../../types/expert';

interface ExpertDashboardProps {
  statistics: ExpertStatistics;
}

const ExpertDashboard: React.FC<ExpertDashboardProps> = ({ statistics }) => {
  // Проверяем, что statistics существует
  if (!statistics) {
    return (
      <div className="expert-dashboard">
        <h2>Дашборд специалиста</h2>
        <p>Загрузка статистики...</p>
      </div>
    );
  }

  const formatCurrency = (amount: number | null) => {
    const safeAmount = amount || 0;
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(safeAmount);
  };

  const formatTime = (seconds?: number | null) => {
    if (!seconds) return 'Н/Д';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}ч ${minutes}м`;
  };

  const formatRating = (rating?: number | null) => {
    if (rating === null || rating === undefined) return 'Н/Д';
    return rating.toFixed(1);
  };

  const formatPercent = (percent?: number | null) => {
    if (percent === null || percent === undefined) return '0%';
    return `${percent.toFixed(1)}%`;
  };

  // Безопасные значения
  const safeStats = {
    total_earnings: statistics.total_earnings || 0,
    monthly_earnings: statistics.monthly_earnings || 0,
    active_orders: statistics.active_orders || 0,
    completed_orders: statistics.completed_orders || 0,
    average_rating: statistics.average_rating || 0,
    verified_specializations: statistics.verified_specializations || 0,
    success_rate: statistics.success_rate || 0,
    total_orders: statistics.total_orders || 0,
    response_time_avg: statistics.response_time_avg
  };

  return (
    <div className="expert-dashboard">
      <h2>Дашборд специалиста</h2>
      
      <Row gutter={[16, 16]}>
        {/* Общий заработок */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Общий заработок"
              value={safeStats.total_earnings}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value as number)}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        {/* Заработок за месяц */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Заработок за месяц"
              value={safeStats.monthly_earnings}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value as number)}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        {/* Активные заказы */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Активные заказы"
              value={safeStats.active_orders}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        {/* Выполненные заказы */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Выполненные заказы"
              value={safeStats.completed_orders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {/* Рейтинг */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Средний рейтинг">
            <div style={{ textAlign: 'center' }}>
              <Rate 
                disabled 
                value={safeStats.average_rating} 
                allowHalf 
                style={{ fontSize: '24px' }}
              />
              <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 'bold' }}>
                {formatRating(safeStats.average_rating)}
              </div>
            </div>
          </Card>
        </Col>

        {/* Процент успешных заказов */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Процент успешных заказов">
            <Progress
              type="circle"
              percent={safeStats.success_rate}
              format={(percent) => formatPercent(percent)}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Card>
        </Col>

        {/* Среднее время ответа */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Среднее время ответа">
            <div style={{ textAlign: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 'bold' }}>
                {formatTime(safeStats.response_time_avg)}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {/* Дополнительная статистика */}
        <Col xs={24} sm={12}>
          <Card title="Общая статистика">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Всего заказов"
                  value={safeStats.total_orders}
                  prefix={<FileTextOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Проверенные специализации"
                  value={safeStats.verified_specializations}
                  prefix={<StarOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Прогресс выполнения */}
        <Col xs={24} sm={12}>
          <Card title="Прогресс выполнения">
            <Progress
              percent={safeStats.total_orders > 0 ? (safeStats.completed_orders / safeStats.total_orders) * 100 : 0}
              format={(percent) => `${safeStats.completed_orders} из ${safeStats.total_orders}`}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExpertDashboard; 