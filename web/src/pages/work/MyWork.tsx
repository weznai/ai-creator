import { Card, Table, Tag, Image } from 'antd';

export default function MyWork() {
  const columns = [
    {
      title: '预览',
      dataIndex: 'thumbnailUrl',
      key: 'thumbnailUrl',
      width: 100,
      render: (url: string) => (
        <Image src={url} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
      ),
    },
    {
      title: '类型',
      dataIndex: 'workType',
      key: 'workType',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'image' ? 'blue' : 'green'}>
          {type === 'image' ? '图片' : '视频'}
        </Tag>
      ),
    },
    {
      title: '场景',
      dataIndex: 'scene',
      key: 'scene',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
    },
  ];

  return (
    <Card title="我的作品">
      <Table columns={columns} dataSource={[]} rowKey="id" />
    </Card>
  );
}
