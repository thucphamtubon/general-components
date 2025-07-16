import { Form } from 'antd';
import { Moment } from 'moment';
import React from 'react';
import BaseDatePickerAntd, { IBaseDatePickerAntdProps } from '../base/BaseDatePickerAntd';

export interface IDatePickerItemProps extends Omit<IBaseDatePickerAntdProps, 'onChange'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	onSelected?: (date: Moment | null, dateString: string) => void;
}

export const DatePickerItem: React.FC<IDatePickerItemProps> = (props) => {
	const { name, label, rules, formItemProps, onSelected, ...datePickerProps } = props;

	return (
		<Form.Item name={name} label={label} rules={rules} {...formItemProps}>
			<BaseDatePickerAntd	
				{...datePickerProps}
				onChange={(date, dateString) => {
					onSelected?.(date, dateString);
				}}
			/>
		</Form.Item>
	);
};
