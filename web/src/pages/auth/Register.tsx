import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Steps, message } from 'antd';
import { MobileOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { authApi } from '@/services/api';
import { useUserStore } from '@stores/user.store';
import styles from './Register.module.less';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useUserStore();

  const handleSendCode = async () => {
    const phone = form.getFieldValue('phone');
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      message.error('请输入正确的手机号');
      return;
    }

    try {
      await authApi.sendCode({ phone, type: 1 });
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

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const result = await authApi.register({
        phone: values.phone,
        code: values.code,
        nickname: values.nickname,
        password: values.password,
      });
      login(result.token, result.user);
      message.success('注册成功');
      navigate('/');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1>注册账号</h1>
        <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
          <Steps.Step title="验证手机" />
          <Steps.Step title="设置信息" />
        </Steps>

        <Form form={form} onFinish={handleRegister} layout="vertical">
          {currentStep === 0 && (
            <>
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
                    <Button type="link" disabled={countdown > 0} onClick={handleSendCode}>
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" block size="large" onClick={() => setCurrentStep(1)}>
                  下一步
                </Button>
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item
                name="nickname"
                rules={[
                  { required: true, message: '请输入昵称' },
                  { min: 2, max: 20, message: '昵称长度为2-20个字符' },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="昵称" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, message: '密码必须是8-20位，包含字母和数字' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="确认密码" size="large" />
              </Form.Item>
              <Form.Item>
                <Button style={{ marginRight: 12 }} onClick={() => setCurrentStep(0)}>
                  上一步
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  注册
                </Button>
              </Form.Item>
            </>
          )}
        </Form>

        <div className={styles.footer}>
          已有账号？ <a onClick={() => navigate('/login')}>立即登录</a>
        </div>
      </div>
    </div>
  );
}
