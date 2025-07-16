import { Form } from 'antd';
import { Moment } from 'moment';
import React from 'react';
import BaseTimePickerAntd, { IBaseTimePickerAntdProps } from '../base/BaseTimePickerAntd';

export interface ITimePickerItemProps extends Omit<IBaseTimePickerAntdProps, 'onChange'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	onSelected?: (time: Moment | null, timeString: string) => void;
}

export const TimePickerItem: React.FC<ITimePickerItemProps> = (props) => {
	const { name, label, rules, formItemProps, onSelected, ...timePickerProps } = props;

	return (
		<Form.Item name={name} label={label} rules={rules} {...formItemProps}>
			<BaseTimePickerAntd
				{...timePickerProps}
				onChange={(time, timeString) => {
					onSelected?.(time, timeString);
				}}
			/>
		</Form.Item>
	);
};

export default TimePickerItem;