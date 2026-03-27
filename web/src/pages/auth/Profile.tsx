import { Card, Form, Input, Button, Upload, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUserStore } from '@stores/user.store';

export default function Profile() {
  const { user } = useUserStore();

  const handleUpdateProfile = async (values: any) => {
    message.success('更新成功');
  };

  const handleUpdatePassword = async (values: any) => {
    message.success('密码修改成功');
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Card title="个人信息" style={{ marginBottom: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={80} icon={<UserOutlined />} src={user?.avatar} />
          <div style={{ marginTop: 12 }}>
            <Upload showUploadList={false}>
              <Button size="small">更换头像</Button>
            </Upload>
          </div>
        </div>
        <Form layout="vertical" initialValues={user} onFinish={handleUpdateProfile}>
          <Form.Item label="用户号">
            <Input value={user?.userNo} disabled />
          </Form.Item>
          <Form.Item label="手机号">
            <Input value={user?.phone} disabled />
          </Form.Item>
          <Form.Item label="昵称" name="nickname">
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="修改密码">
        <Form layout="vertical" onFinish={handleUpdatePassword}>
          <Form.Item label="原密码" name="oldPassword" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true },
              { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, message: '密码必须是8-20位，包含字母和数字' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
