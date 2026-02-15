import { Checkbox, DatePicker, InputNumber, Divider } from 'antd';

export interface Filter {
    type: string;
    description: string;
    fields: string[];
    values: Record<string, string>;
    min: number;
    max: number;
}

interface FilterProps {
    categoryId: string;
    filterId: string;
    filter: Filter;
    value: string[] & number[] & any;
    onChange: (categoryId: string, filterId: string, value: any) => void;
}

interface TermProps {
    categoryId: string;
    filterId: string;
    filter: Filter;
    value: string[];
    onChange: (categoryId: string, filterId: string, value: any) => void;
}

interface RangeProps {
    categoryId: string;
    filterId: string;
    filter: Filter;
    value: number[];
    onChange: (categoryId: string, filterId: string, value: any) => void;
}

interface DateRangeProps {
    categoryId: string;
    filterId: string;
    filter: Filter;
    value: any;
    onChange: (categoryId: string, filterId: string, value: any) => void;
}

interface GeoBoxProps {
    categoryId: string;
    filterId: string;
    filter: Filter;
    value: any;
    onChange: (categoryId: string, filterId: string, value: any) => void;
}

interface GeoDistanceProps {
    categoryId: string;
    filterId: string;
    filter: Filter;
    value: any;
    onChange: (categoryId: string, filterId: string, value: any) => void;
}

const Term = ({ categoryId, filterId, filter, value, onChange }: TermProps) => {
    const options = [];
    for (const v in filter.values) {
        options.push(
            { label: filter.values[v], value: v }
        )
    }

    return (
        <Checkbox.Group
            options={options}
            value={value}
            onChange={(val) => onChange(categoryId, filterId, val)}
        />
    );
};

const Range = ({ categoryId, filterId, filter, value, onChange }: RangeProps) => {
    return (
        <>
            <div style={{ 'display': 'inline-block', 'marginRight': 5 }}>От</div>
            <InputNumber value={value[0]} min={filter.min} max={value[1]} onChange={(val) => onChange(categoryId, filterId, [val, value[1]])} />
            <div style={{ 'display': 'inline-block', 'marginRight': 5, 'marginLeft': 5 }}>До</div>
            <InputNumber value={value[1]} min={value[0]} max={filter.max} onChange={(val) => onChange(categoryId, filterId, [value[0], val])} />
        </>
    );
};

const DateRange = ({ categoryId, filterId, filter, value, onChange }: DateRangeProps) => {
    return (
        <>
            <div style={{ 'display': 'inline-block', 'marginRight': 5 }}>От</div>
            <DatePicker value={value[0]} format={'DD.MM.YYYY'} onChange={(val) => onChange(categoryId, filterId, [val, value[1]])} />
            <div style={{ 'marginBottom': 5}} />
            <div style={{ 'display': 'inline-block', 'marginRight': 5}}>До</div>
            <DatePicker value={value[1]} format={'DD.MM.YYYY'} onChange={(val) => onChange(categoryId, filterId, [value[0], val])} />
        </>
    );
};

const GeoBox = ({ categoryId, filterId, filter, value, onChange }: GeoBoxProps) => {
    return (
        <>
            <Divider size='small'>Верхний левый угол</Divider>
            <div style={{ 'display': 'inline-block', 'marginRight': 5 }}>Широта</div>
            <InputNumber value={value[0]} min={-90} max={90} onChange={(val) => onChange(categoryId, filterId, [val, value[1], value[2], value[3]])} />
            <div style={{ 'marginBottom': 5}} />
            <div style={{ 'display': 'inline-block', 'marginRight': 5 }}>Долгота</div>
            <InputNumber value={value[1]} min={-180} max={180} onChange={(val) => onChange(categoryId, filterId, [value[0], val, value[2], value[3]])} />
            <div style={{ 'marginBottom': 5}} />

            <Divider size='small'>Нижний правый угол</Divider>
            <div style={{ 'display': 'inline-block', 'marginRight': 5 }}>Широта</div>
            <InputNumber value={value[0]} min={-90} max={90} onChange={(val) => onChange(categoryId, filterId, [value[0], value[1], val, value[3]])} />
            <div style={{ 'marginBottom': 5}} />
            <div style={{ 'display': 'inline-block', 'marginRight': 5 }}>Долгота</div>
            <InputNumber value={value[1]} min={-180} max={180} onChange={(val) => onChange(categoryId, filterId, [value[0], value[1], value[2], val])} />
            <div style={{ 'marginBottom': 5}} />
        </>
    );
};

const GeoDistance = ({ categoryId, filterId, filter, value, onChange }: GeoDistanceProps) => {
    return (
        <>
            <div style={{ 'display': 'inline-block', 'marginRight': 5 }}>Широта</div>
            <InputNumber value={value[0]} min={-90} max={90} onChange={(val) => onChange(categoryId, filterId, [val, value[1], value[2]])} />
            <div style={{ 'marginBottom': 5}} />
            <div style={{ 'display': 'inline-block', 'marginRight': 5 }}>Долгота</div>
            <InputNumber value={value[1]} min={-180} max={180} onChange={(val) => onChange(categoryId, filterId, [value[0], val, value[2]])} />
            <div style={{ 'marginBottom': 5}} />
            <div style={{ 'display': 'inline-block', 'marginRight': 5 }}>Дистанция (метры)</div>
            <InputNumber value={value[2]} min={0} max={20037000} onChange={(val) => onChange(categoryId, filterId, [value[0], value[1], val])} />
        </>
    );
};

export const FilterUI = ({ categoryId, filterId, filter, value, onChange }: FilterProps) => {
    switch (filter.type) {
        case "term":
            return <Term
                categoryId={categoryId}
                filterId={filterId}
                filter={filter}
                value={value ?? []}
                onChange={onChange}
            />;
        case "range":
            return <Range
                categoryId={categoryId}
                filterId={filterId}
                filter={filter}
                value={value ?? [filter.min, filter.max]}
                onChange={onChange}
            />;
        case "date_range":
            return <DateRange
                categoryId={categoryId}
                filterId={filterId}
                filter={filter}
                value={value ?? [null, null]}
                onChange={onChange}
            />;
        case "geo_bounding_box":
            return <GeoBox
                categoryId={categoryId}
                filterId={filterId}
                filter={filter}
                value={value ?? [null, null, null, null]}
                onChange={onChange}
            />;
        case "geo_distance":
            return <GeoDistance
                categoryId={categoryId}
                filterId={filterId}
                filter={filter}
                value={value ?? [null, null, null]}
                onChange={onChange}
            />;
        case "full_text":
            return <div>Используйте поле ввода сверху</div>;

        default:
            return null;
    }
};