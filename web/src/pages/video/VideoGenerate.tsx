import { useState } from 'react';
import { Card, Form, Select, Input, Button, Upload, message } from 'antd';
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import styles from './VideoGenerate.module.less';

const { TextArea } = Input;

const mockModels = [
  { id: 1, name: 'Runway Gen-2', description: '高质量视频生成' },
  { id: 2, name: 'Pika Labs', description: '创意视频生成' },
];

const mockSizes = [
  { id: 1, scene: '短视频', method: '参考图片', ratio: '9:16', width: 1080, height: 1920, duration: 5 },
  { id: 2, scene: '横版视频', method: '图片视频混合', ratio: '16:9', width: 1920, height: 1080, duration: 15 },
];

export default function VideoGenerate() {
  const [loading, setLoading] = useState(false);
  const [generateType, setGenerateType] = useState('image_reference');

  const handleGenerate = async (values: any) => {
    setLoading(true);
    try {
      // TODO: 调用API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success('视频生成任务已创建');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.resultArea}>
        <Card title="生成结果" style={{ height: '100%' }}>
          <div className={styles.resultContent}>
            <VideoCameraOutlined style={{ fontSize: 64, color: '#ccc' }} />
            <p>生成的视频将在这里展示</p>
          </div>
        </Card>
      </div>

      <div className={styles.configArea}>
        <Card title="视频生成配置">
          <Form layout="vertical" onFinish={handleGenerate}>
            <Form.Item label="选择模型" name="modelId" rules={[{ required: true }]}>
              <Select placeholder="请选择模型">
                {mockModels.map((m) => (
                  <Select.Option key={m.id} value={m.id}>
                    {m.name} - {m.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="生成方式" name="generateType" initialValue="image_reference">
              <Select onChange={(v) => setGenerateType(v)}>
                <Select.Option value="start_end_frame">参考首尾帧</Select.Option>
                <Select.Option value="multi_frame">参考多帧</Select.Option>
                <Select.Option value="image_reference">参考图片</Select.Option>
                <Select.Option value="image_video_mix">图片视频混合</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="尺寸配置" name="sizeId" rules={[{ required: true }]}>
              <Select placeholder="请选择尺寸">
                {mockSizes.map((s) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.scene} - {s.method} - {s.ratio} - {s.duration}s
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="生成数量" name="generateCount" initialValue={1}>
              <Select>
                <Select.Option value={1}>1个</Select.Option>
                <Select.Option value={2}>2个</Select.Option>
              </Select>
            </Form.Item>

            {generateType === 'start_end_frame' && (
              <>
                <Form.Item label="首帧图片">
                  <Upload maxCount={1} accept="image/*">
                    <Button icon={<UploadOutlined />}>上传首帧</Button>
                  </Upload>
                </Form.Item>
                <Form.Item label="尾帧图片">
                  <Upload maxCount={1} accept="image/*">
                    <Button icon={<UploadOutlined />}>上传尾帧</Button>
                  </Upload>
                </Form.Item>
              </>
            )}

            {generateType === 'multi_frame' && (
              <Form.Item label="参考帧">
                <Upload multiple accept="image/*">
                  <Button icon={<UploadOutlined />}>上传多帧图片</Button>
                </Upload>
              </Form.Item>
            )}

            {generateType === 'image_reference' && (
              <Form.Item label="参考图片">
                <Upload maxCount={1} accept="image/*">
                  <Button icon={<UploadOutlined />}>上传参考图</Button>
                </Upload>
              </Form.Item>
            )}

            {generateType === 'image_video_mix' && (
              <>
                <Form.Item label="参考图片">
                  <Upload multiple accept="image/*">
                    <Button icon={<UploadOutlined />}>上传图片</Button>
                  </Upload>
                </Form.Item>
                <Form.Item label="参考视频">
                  <Upload maxCount={1} accept="video/*">
                    <Button icon={<UploadOutlined />}>上传视频</Button>
                  </Upload>
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                {loading ? '生成中...' : '开始生成'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
