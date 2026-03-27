import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import {
  AppstoreOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FolderOutlined,
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useUserStore } from '@stores/user.store';
import styles from './Layout.module.less';

const { Sider, Content, Header } = AntLayout;

const menuItems = [
  { key: '/material', icon: <AppstoreOutlined />, label: '材料库' },
  { key: '/image/generate', icon: <PictureOutlined />, label: '生成图片' },
  { key: '/video/generate', icon: <VideoCameraOutlined />, label: '生成视频' },
  { key: '/work', icon: <FolderOutlined />, label: '我的作品' },
  { key: '/collection', icon: <HeartOutlined />, label: '我的收藏' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUserStore();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AntLayout className={styles.layout}>
      <Sider width={220} className={styles.sider}>
        <div className={styles.logo}>AI创作平台</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.menu}
        />
      </Sider>
      <AntLayout>
        <Header className={styles.header}>
          <div className={styles.userInfo}>
            <UserOutlined />
            <span>{user?.nickname || user?.userNo}</span>
            <span onClick={handleLogout} className={styles.logout}>
              <LogoutOutlined /> 退出
            </span>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
