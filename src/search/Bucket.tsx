import { Table, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { BucketItemProps, Categories } from './Search';

interface BucketProps {
    token: string;
    bucketItems: BucketItemProps[];
    categories: Categories;
    deleteFromBucket: (itemId: string, categoryId: string) => void;
}

function Bucket({ token, bucketItems, categories, deleteFromBucket }: BucketProps) {
    const columns = [
        {
            title: 'Категория',
            dataIndex: 'categoryId',
            // width: '20%',
            render: (value: string) => categories[value].title,
        },
        {
            title: 'ID',
            dataIndex: 'id',
            // width: '20%',
        },
        // {
        //     title: 'Описание',
        //     dataIndex: 'description'
        // },
        {
            title: 'Действие',
            width: '100px',
            render: (_: string, record: BucketItemProps) => {
                return <Tooltip title="Удалить из корзины">
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteFromBucket(record.id, record.categoryId)}
                    />
                </Tooltip>
            }
        },
    ];

    return <Table
        rowKey='id'
        scroll={{ y: 'calc(100vh - 180px - 0px)' }}
        size="small"
        dataSource={bucketItems}
        columns={columns}
        bordered
        pagination={{ pageSize: 50, hideOnSinglePage: true, showSizeChanger: false }}
    />;
}

export default Bucket;