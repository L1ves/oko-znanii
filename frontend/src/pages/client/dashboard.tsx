import React from 'react';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import ClientDashboard from '../../components/client/ClientDashboard';

const { Header, Sider, Content } = Layout;

const ClientDashboardPage: React.FC = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = React.useState('dashboard');

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Обзор',
      onClick: () => router.push('/client/dashboard'),
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Мои заказы',
      onClick: () => router.push('/client/orders'),
    },
    {
      key: 'transactions',
      icon: <WalletOutlined />,
      label: 'Транзакции',
      onClick: () => router.push('/client/transactions'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль',
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Настройки',
      onClick: () => router.push('/client/settings'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h2>Личный кабинет</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: 0, minHeight: 280 }}>
          <ClientDashboard />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientDashboardPage; 