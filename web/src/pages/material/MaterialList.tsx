import { Table, Card, Tag, Image, Button } from 'antd';
import { EyeOutlined, HeartOutlined } from '@ant-design/icons';
import styles from './MaterialList.module.less';

const mockData = [
  {
    id: 1,
    materialType: 'image',
    title: '电商主图示例',
    prompt: '一款精美的智能手表，简约设计，白色背景',
    mediaUrl: 'https://picsum.photos/400/400',
    thumbnailUrl: 'https://picsum.photos/200/200',
    ecommerceWork: '智能手表',
    scene: '电商主图',
    address: 'https://example.com/watch',
    viewCount: 120,
    collectCount: 45,
    createdAt: '2024-01-15 10:00:00',
  },
];

export default function MaterialList() {
  const columns = [
    {
      title: '预览',
      dataIndex: 'thumbnailUrl',
      key: 'thumbnailUrl',
      width: 100,
      render: (url: string, record: any) => (
        <Image
          src={url}
          width={80}
          height={80}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '类型',
      dataIndex: 'materialType',
      key: 'materialType',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'image' ? 'blue' : 'green'}>
          {type === 'image' ? '图片' : '视频'}
        </Tag>
      ),
    },
    {
      title: '电商作品',
      dataIndex: 'ecommerceWork',
      key: 'ecommerceWork',
      width: 120,
    },
    {
      title: '场景',
      dataIndex: 'scene',
      key: 'scene',
      width: 100,
    },
    {
      title: '提示词',
      dataIndex: 'prompt',
      key: 'prompt',
      ellipsis: true,
    },
    {
      title: '浏览',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      render: (count: number) => (
        <span>
          <EyeOutlined /> {count}
        </span>
      ),
    },
    {
      title: '收藏',
      dataIndex: 'collectCount',
      key: 'collectCount',
      width: 80,
      render: (count: number) => (
        <span>
          <HeartOutlined /> {count}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => console.log('detail', record.id)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="材料库">
        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
}
