import React from 'react';
import { Spin, Alert } from 'antd';
import ExpertProfile from '../../components/expert/ExpertProfile';
import { useExpertProfile } from '../../hooks/useExpert';

const ExpertProfilePage: React.FC = () => {
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useExpertProfile();

  // Проверяем ошибки
  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Ошибка загрузки профиля"
          description="Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже."
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Показываем загрузку
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {profile && <ExpertProfile profile={profile} />}
    </div>
  );
};

export default ExpertProfilePage; 