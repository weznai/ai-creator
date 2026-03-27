import { useState } from 'react';
import { Card, Form, Select, Input, Button, Upload, Image, Spin, message } from 'antd';
import { UploadOutlined, ReloadOutlined, DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './ImageGenerate.module.less';

const { TextArea } = Input;

const mockModels = [
  { id: 1, name: 'DALL-E 3', description: '高质量文生图模型' },
  { id: 2, name: 'Stable Diffusion XL', description: '开源高质量图像生成' },
];

const mockSizes = [
  { id: 1, scene: '电商主图', method: '文生图', ratio: '1:1', width: 800, height: 800 },
  { id: 2, scene: '详情页', method: '文生图', ratio: '3:4', width: 750, height: 1000 },
  { id: 3, scene: '横版海报', method: '文生图', ratio: '16:9', width: 1920, height: 1080 },
];

export default function ImageGenerate() {
  const [loading, setLoading] = useState(false);
  const [taskType, setTaskType] = useState<'text2img' | 'img2img'>('text2img');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async (values: any) => {
    setLoading(true);
    // TODO: 调用API生成图片
    setTimeout(() => {
      setGeneratedImages([
        'https://picsum.photos/800/800?random=1',
        'https://picsum.photos/800/800?random=2',
      ]);
      setLoading(false);
      message.success('生成成功');
    }, 2000);
  };

  const handleSave = (imageUrl: string) => {
    // TODO: 保存到材料库
    message.success('已保存到材料库');
  };

  const handleDownload = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.resultArea}>
        <Card title="生成结果">
          {loading ? (
            <div className={styles.loading}>
              <Spin size="large" tip="正在生成中..." />
            </div>
          ) : generatedImages.length > 0 ? (
            <div className={styles.imageGrid}>
              {generatedImages.map((url, index) => (
                <div key={index} className={styles.imageItem}>
                  <Image src={url} width="100%" />
                  <div className={styles.imageActions}>
                    <Button icon={<SaveOutlined />} onClick={() => handleSave(url)}>
                      保存
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={() => handleDownload(url)}>
                      下载
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>请输入提示词生成图片</div>
          )}
        </Card>
      </div>

      <div className={styles.configArea}>
        <Card title="生成配置">
          <Form layout="vertical" onFinish={handleGenerate}>
            <Form.Item label="生成类型" name="taskType" initialValue="text2img">
              <Select onChange={(v) => setTaskType(v)}>
                <Select.Option value="text2img">文生图</Select.Option>
                <Select.Option value="img2img">图生图</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="语言" name="language" initialValue="zh">
              <Select>
                <Select.Option value="zh">中文</Select.Option>
                <Select.Option value="en">英文</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="选择模型" name="modelId" rules={[{ required: true }]}>
              <Select placeholder="请选择模型">
                {mockModels.map((m) => (
                  <Select.Option key={m.id} value={m.id}>
                    {m.name} - {m.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="选择尺寸" name="sizeId" rules={[{ required: true }]}>
              <Select placeholder="请选择尺寸">
                {mockSizes.map((s) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.scene} | {s.method} | {s.ratio} | {s.width}x{s.height}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="生成数量" name="generateCount" initialValue={1}>
              <Select>
                <Select.Option value={1}>1张</Select.Option>
                <Select.Option value={2}>2张</Select.Option>
                <Select.Option value={4}>4张</Select.Option>
              </Select>
            </Form.Item>

            {taskType === 'img2img' && (
              <Form.Item label="参考图片" name="referenceImage">
                <Upload maxCount={1} accept="image/*">
                  <Button icon={<UploadOutlined />}>上传参考图</Button>
                </Upload>
              </Form.Item>
            )}

            <Form.Item label="提示词" name="prompt" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder="请输入提示词描述..." />
            </Form.Item>

            <Form.Item label="负向提示词" name="negativePrompt">
              <TextArea rows={2} placeholder="不想出现的内容..." />
            </Form.Item>

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
