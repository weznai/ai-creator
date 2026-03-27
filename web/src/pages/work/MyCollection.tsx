import { Card, Table, Tag, Image } from 'antd';

export default function MyCollection() {
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
      title: '提示词',
      dataIndex: 'prompt',
      key: 'prompt',
      ellipsis: true,
    },
    {
      title: '收藏时间',
      dataIndex: 'collectedAt',
      key: 'collectedAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
    },
  ];

  return (
    <Card title="我的收藏">
      <Table columns={columns} dataSource={[]} rowKey="id" />
    </Card>
  );
}
