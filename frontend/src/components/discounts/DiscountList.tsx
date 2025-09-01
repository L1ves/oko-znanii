import React from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import { DiscountCard } from './DiscountCard';
import { DiscountRule, DiscountProgress } from '@/types/discounts';

interface DiscountListProps {
  discounts: DiscountRule[];
  progress?: Record<number, DiscountProgress>;
  loading?: boolean;
  isAvailable?: boolean;
}

const DiscountList: React.FC<DiscountListProps> = ({
  discounts,
  progress,
  loading = false,
  isAvailable = true,
}) => {
  if (loading) {
    return (
      <div className="discount-list-loading">
        <Spin size="large" />
        <style jsx>{`
          .discount-list-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
          }
        `}</style>
      </div>
    );
  }

  if (!discounts.length) {
    return (
      <Empty
        description={
          isAvailable
            ? "У вас пока нет доступных скидок"
            : "Нет скидок, которые скоро станут доступны"
        }
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {discounts.map((discount) => (
        <Col key={discount.id} xs={24} sm={12} lg={8}>
          <DiscountCard
            discount={discount}
            progress={progress?.[discount.id]}
            isAvailable={isAvailable}
          />
        </Col>
      ))}
      <style jsx>{`
        :global(.ant-row) {
          margin-bottom: 24px;
        }
      `}</style>
    </Row>
  );
};

export default DiscountList; 