import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Tabs, message } from 'antd';
import { MobileOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { authApi } from '@/services/api';
import { useUserStore } from '@stores/user.store';
import styles from './Login.module.less';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { login } = useUserStore();

  const handlePasswordLogin = async (values: any) => {
    setLoading(true);
    try {
      const result = await authApi.login({
        phone: values.phone,
        loginType: 'password',
        password: values.password,
      });
      login(result.token, result.user);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCodeLogin = async (values: any) => {
    setLoading(true);
    try {
      const result = await authApi.login({
        phone: values.phone,
        loginType: 'code',
        code: values.code,
      });
      login(result.token, result.user);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (phone: string) => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      message.error('请输入正确的手机号');
      return;
    }
    
    try {
      await authApi.sendCode({ phone, type: 2 });
      message.success('验证码已发送');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (error) {
    }
  };

  const items = [
    {
      key: 'password',
      label: '密码登录',
      children: (
        <Form onFinish={handlePasswordLogin} layout="vertical">
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input prefix={<MobileOutlined />} placeholder="手机号" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'code',
      label: '验证码登录',
      children: (
        <Form onFinish={handleCodeLogin} layout="vertical">
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input prefix={<MobileOutlined />} placeholder="手机号" size="large" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="验证码"
              size="large"
              suffix={
                <Button
                  type="link"
                  disabled={countdown > 0}
                  onClick={() => {
                    const phone = (document.querySelector('input[placeholder="手机号"]') as HTMLInputElement)?.value;
                    handleSendCode(phone);
                  }}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              }
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>AI内容创作平台</h1>
        <Tabs items={items} centered />
        <div className={styles.footer}>
          还没有账号？ <a onClick={() => navigate('/register')}>立即注册</a>
        </div>
      </div>
    </div>
  );
}
