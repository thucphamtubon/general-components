import { Form } from 'antd';
import React from 'react';
import BaseRadioAntd, { IBaseRadioAntdProps } from '../base/BaseRadioAntd';
import { RadioChangeEvent } from 'antd/es/radio';

export interface IRadioInputItemProps extends Omit<IBaseRadioAntdProps, 'onChange'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	onSelected?: (value: any, event: RadioChangeEvent) => void;
}

export const RadioInputItem: React.FC<IRadioInputItemProps> = (props) => {
	const { name, label, rules, formItemProps, onSelected, ...radioProps } = props;

	return (
		<Form.Item name={name} label={label} rules={rules} {...formItemProps}>
			<BaseRadioAntd
				{...radioProps}
				onChange={(e) => {
					onSelected?.(e.target.value, e);
				}}
			/>
		</Form.Item>
	);
};

export default RadioInputItem;