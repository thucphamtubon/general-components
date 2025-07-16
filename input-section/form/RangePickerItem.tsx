import { Form } from 'antd';
import { Moment } from 'moment';
import React from 'react';
import BaseRangePickerAntd, { IBaseRangePickerAntdProps } from '../base/BaseRangePickerAntd';

export interface IRangePickerItemProps extends Omit<IBaseRangePickerAntdProps, 'onChange'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	onSelected?: (dates: [Moment | null, Moment | null] | null, dateStrings: [string, string]) => void;
}

export const RangePickerItem: React.FC<IRangePickerItemProps> = (props) => {
	const { name, label, rules, formItemProps, onSelected, ...rangePickerProps } = props;

	return (
		<Form.Item name={name} label={label} rules={rules} {...formItemProps}>
			<BaseRangePickerAntd
				{...rangePickerProps}
				onChange={(dates, dateStrings) => {
					onSelected?.(dates, dateStrings);
				}}
			/>
		</Form.Item>
	);
};

export default RangePickerItem;