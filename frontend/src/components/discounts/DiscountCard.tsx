import React from 'react';
import { Card, Badge, Progress, Typography, Tag, Button } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { DiscountRule, DiscountProgress, WorkType } from '@/types/discounts';

const { Text, Title } = Typography;

interface DiscountCardProps {
  discount: DiscountRule;
  progress?: DiscountProgress;
  isAvailable?: boolean;
  onApply?: (discountId: number) => void;
}

export const DiscountCard: React.FC<DiscountCardProps> = ({
  discount,
  progress,
  isAvailable = true,
  onApply,
}) => {
  const getStatusBadge = () => {
    if (!discount.is_active) {
      return <Badge status="default" text="Неактивна" />;
    }
    if (isAvailable) {
      return <Badge status="success" text="Доступна" />;
    }
    return <Badge status="processing" text="Скоро доступна" />;
  };

  const renderProgress = () => {
    if (!progress || isAvailable) return null;

    return (
      <div className="discount-progress">
        {progress.orders_remaining !== undefined && progress.min_orders && (
          <div className="progress-item">
            <Text>До получения скидки осталось заказов:</Text>
            <Text strong>{progress.orders_remaining}</Text>
            <Progress
              percent={Math.round(
                ((progress.min_orders - progress.orders_remaining) / progress.min_orders) * 100
              )}
              size="small"
              status="active"
            />
          </div>
        )}
        {progress.spent_remaining !== undefined && progress.min_total_spent && (
          <div className="progress-item">
            <Text>До получения скидки осталось потратить:</Text>
            <Text strong>{formatCurrency(progress.spent_remaining)}</Text>
            <Progress
              percent={Math.round(
                ((progress.min_total_spent - progress.spent_remaining) / progress.min_total_spent) * 100
              )}
              size="small"
              status="active"
            />
          </div>
        )}
      </div>
    );
  };

  const renderRequirements = () => {
    if (isAvailable) return null;

    return (
      <div className="discount-requirements">
        <Title level={5}>Условия получения:</Title>
        <ul>
          {discount.min_orders > 0 && (
            <li>
              <Text>Минимальное количество заказов: {discount.min_orders}</Text>
            </li>
          )}
          {discount.min_total_spent > 0 && (
            <li>
              <Text>
                Минимальная сумма заказов: {formatCurrency(discount.min_total_spent)}
              </Text>
            </li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <Card className="discount-card">
      <div className="discount-header">
        {getStatusBadge()}
        <Title level={4}>{discount.name}</Title>
      </div>
      
      <div className="discount-value">
        <Title level={2} type="danger">
          {discount.discount_display}
        </Title>
      </div>

      <Text type="secondary">{discount.description}</Text>

      {discount.valid_until && (
        <div className="discount-validity">
          <ClockCircleOutlined />
          <Text type="secondary">
            Действует до {formatDate(discount.valid_until)}
          </Text>
        </div>
      )}

      {discount.work_types.length > 0 && (
        <div className="work-types">
          <Text>Применяется к:</Text>
          <div className="work-type-tags">
            {discount.work_types.map((type: WorkType) => (
              <Tag key={type.id} color="blue">
                {type.name}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {renderRequirements()}
      {renderProgress()}

      {isAvailable && onApply && (
        <div className="discount-actions">
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => onApply(discount.id)}
          >
            Применить скидку
          </Button>
        </div>
      )}

      <style jsx>{`
        .discount-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .discount-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .discount-value {
          margin: 16px 0;
        }
        .discount-validity {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px 0;
        }
        .work-types {
          margin-top: 16px;
        }
        .work-type-tags {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .discount-progress {
          margin-top: 16px;
          border-top: 1px solid #f0f0f0;
          padding-top: 16px;
        }
        .progress-item {
          margin-bottom: 12px;
        }
        .progress-item :global(.ant-progress) {
          margin-top: 8px;
        }
        .discount-requirements {
          margin-top: 16px;
          border-top: 1px solid #f0f0f0;
          padding-top: 16px;
        }
        .discount-requirements ul {
          list-style: none;
          padding: 0;
          margin: 8px 0 0;
        }
        .discount-requirements li {
          margin-bottom: 8px;
        }
        .discount-actions {
          margin-top: auto;
          padding-top: 16px;
        }
      `}</style>
    </Card>
  );
}; 