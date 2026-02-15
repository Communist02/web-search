import { useEffect, useState } from 'react';
import { Input, Popconfirm, message, Table, Layout, Collapse, Checkbox, Divider, type CheckboxProps, type CollapseProps, Card, Button, Tooltip, Drawer, Badge, Space, Typography } from 'antd';
import { getCategories, search } from '../api';
import { FilterUI, type Filter } from './ItemUI';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Bucket from './Bucket';

interface SearchProps {
    token: string;
    onLogout: () => void;
}

interface ResultSearchProps {
    categoryId: string;
    categoryTitle: string;
    id: string;
    description: string;
}

export interface BucketItemProps {
    categoryId: string;
    id: string;
}

interface CategoryItem {
    title: string;
    description: string;
    filters: Record<string, Filter>;
    // другие свойства
}

export type Categories = {
    [key: string]: CategoryItem;
};

function Search({ token, onLogout }: SearchProps) {
    const [resultSearch, setResult] = useState<ResultSearchProps[]>([]);
    const [categories, setCategories] = useState<Categories>({});
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [filterState, setFilterState] = useState<Record<string, any>>({});
    const [bucket, setBucket] = useState<BucketItemProps[]>([]);
    const [isOpenBucket, setIsOpenBucket] = useState<boolean>(false);

    async function loadCategories() {
        const response = await getCategories(token);
        setCategories(response.data);
    }

    function getBucket(): BucketItemProps[] {
        let bucket = localStorage.getItem('bucket');
        let result: BucketItemProps[];
        if (bucket !== null) {
            result = JSON.parse(bucket);
        } else {
            result = [];
        }
        return result;
    }

    function checkItemInBucket(itemId: string, categoryId: string): boolean {
        return bucket.some(item =>
            item.id === itemId && item.categoryId === categoryId
        )
    }

    const deleteFromBucket = (itemId: string, categoryId: string) => {
        const newBucket = bucket.filter(bucketItem =>
            !(bucketItem.id === itemId && bucketItem.categoryId === categoryId)
        );
        setBucket(newBucket);
        localStorage.setItem('bucket', JSON.stringify(newBucket));
        message.success("Удалено из корзины");
    }

    const addToBucket = (itemId: string, categoryId: string) => {
        const newItem = { id: itemId, categoryId: categoryId };

        // Проверяем, нет ли уже такого элемента в корзине
        const isAlreadyInBucket = bucket.some(item =>
            item.id === itemId && item.categoryId === categoryId
        );

        if (!isAlreadyInBucket) {
            // Создаем новый массив с добавленным элементом
            const newBucket = [...bucket, newItem];
            setBucket(newBucket);

            // Также обновляем localStorage
            localStorage.setItem('bucket', JSON.stringify(newBucket));
            message.success("Добавлено в корзину");
        }
    }

    const clearBucket = () => {
        const newBucket: BucketItemProps[] = [];
        setBucket(newBucket);
        localStorage.setItem('bucket', JSON.stringify(newBucket));
        message.success("Корзина очищена");
    }

    useEffect(() => {
        setBucket(getBucket());
        loadCategories();
    }, []);

    const categoriesOptions = [];
    for (const key in categories) {
        categoriesOptions.push({
            label: categories[key]['title'],
            value: key,
        })
    }

    const checkAll = checkedList.length === categoriesOptions.length;

    const onSearch = async (value: string) => {
        const order = {
            text: value,
            filters: filterState,
            token: token,
            categories: checkedList,
        };
        const response = await search(order);
        if (response.status === 200) {
            if (response.data.length === 0) {
                message.info('Ничего не найдено');
            } else {
                message.info("Поиск прошел успешно");
            }

            const result: ResultSearchProps[] = [];

            for (const category in response.data) {
                for (const file in response.data[category]) {
                    result.push({ categoryId: category, categoryTitle: categories[category]['title'], id: file, description: response.data[category][file] });
                }
            }

            setResult(result);
        } else {
            message.error('Ошибка поиска!');
        }
    }

    const columns = [
        {
            title: 'Категория',
            dataIndex: 'categoryTitle',
            width: '20%',
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
            render: (_: string, record: ResultSearchProps) => {
                return checkItemInBucket(record.id, record.categoryId) ? <Tooltip title="Удалить из корзины">
                    <Button
                        danger
                        icon={<MinusOutlined />}
                        onClick={() => deleteFromBucket(record.id, record.categoryId)}
                    />
                </Tooltip> :
                    <Tooltip title="Добавить в корзину">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => { addToBucket(record.id, record.categoryId) }}
                        />
                    </Tooltip>
            }
        },
    ];

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        const keys: string[] = [];
        for (const key in categories) {
            keys.push(key);
        }
        setCheckedList(e.target.checked ? keys : []);
    };

    const headerStyle: React.CSSProperties = {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        padding: '0 10px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    };

    const contentStyle: React.CSSProperties = {
        textAlign: 'start',
        minHeight: 120,
        height: '100%',
    };

    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
    };

    const updateFilter = (category: string, filterId: string, value: any) => {
        setFilterState(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [filterId]: value
            }
        }));
    };

    const categoriesItems: CollapseProps['items'] = [
        {
            key: 'categories',
            label: 'Категории',
            children: <>
                <Checkbox indeterminate={checkedList.length > 0 && checkedList.length < categoriesOptions.length} onChange={onCheckAllChange} checked={checkAll}>
                    Выбрать все
                </Checkbox>
                <Divider />
                <Checkbox.Group options={categoriesOptions} value={checkedList} onChange={setCheckedList} />
            </>,
        }
    ];

    const filters = (
        <>
            <Collapse
                key="block-categories"
                bordered={false}
                items={categoriesItems}
                defaultActiveKey={['categories']}
            />

            {checkedList.map(categoryId => {
                const category = categories[categoryId];
                if (!category) return null;

                const filtersItems: CollapseProps['items'] = Object.entries(category.filters).map(
                    ([filterId, filter]) => ({
                        key: categoryId + '-' + filterId,
                        label: filter.description,
                        children: (
                            <FilterUI
                                categoryId={categoryId}
                                filterId={filterId}
                                filter={filter}
                                value={filterState[categoryId]?.[filterId]}
                                onChange={updateFilter}
                            />
                        ),
                    })
                );

                return (
                    <div key={'block-' + categoryId}>
                        <Divider>{category.title}</Divider>
                        <Collapse bordered={false} items={filtersItems} />
                    </div>
                );
            })}
        </>
    );

    return <Layout hasSider>
        <Layout.Sider style={siderStyle} width={300}>
            <Card title='Фильтры' style={{ margin: 10 }} styles={{ body: { padding: 0 } }} children={filters} />
        </Layout.Sider>
        <Layout>
            <Layout.Header style={headerStyle}>
                <Input.Search style={{ width: '100%' }} placeholder="Поиск" onSearch={onSearch} enterButton />
                <Badge count={bucket.length}>
                    <Button title='Открыть корзину' type='primary' onClick={() => setIsOpenBucket(true)}>Корзина</Button>
                </Badge>
                <Popconfirm title='Вы действидельно хотите выйти?' okText="Да" cancelText="Нет" onConfirm={onLogout}>
                    <Button title='Выйти из учетной записи'>Выход</Button>
                </Popconfirm>
            </Layout.Header>
            <Layout.Content style={contentStyle}>
                <Table
                    scroll={{ y: 'calc(100vh - 180px - 0px)' }}
                    rowKey='id'
                    size="small"
                    dataSource={resultSearch}
                    columns={columns}
                    bordered
                    pagination={{ pageSize: 50, hideOnSinglePage: true, showSizeChanger: false }}
                    expandable={{
                        expandedRowRender: record => <Typography><pre>{JSON.stringify(record.description, null, 4)}</pre></Typography>,
                        // rowExpandable: record => record.message !== null && record.message !== ''
                    }}
                />
            </Layout.Content>
            {/* <Layout.Footer>Footer</Layout.Footer> */}
        </Layout>
        <Drawer title='Корзина' size='large' styles={{ body: { padding: 0 } }} extra={
            <Space>
                <Button>Отправить на обработку</Button>
                <Popconfirm title='Вы действидельно хотите очистить корзину?' okText="Да" cancelText="Нет" onConfirm={clearBucket}>
                    <Button type='primary'>Очистить корзину</Button>
                </Popconfirm>
            </Space>
        } open={isOpenBucket} onClose={() => setIsOpenBucket(false)}>
            {isOpenBucket && <Bucket bucketItems={bucket} categories={categories} deleteFromBucket={deleteFromBucket} token={token} />}
        </Drawer>
    </Layout>;
}

export default Search;