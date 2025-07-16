import { Form } from 'antd';
import React from 'react';
import BaseCheckboxAntd, { IBaseCheckboxAntdProps } from '../base/BaseCheckboxAntd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

export interface ICheckboxInputItemProps extends Omit<IBaseCheckboxAntdProps, 'onChange'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	onChecked?: (checked: boolean, event: CheckboxChangeEvent) => void;
}

export const CheckboxInputItem: React.FC<ICheckboxInputItemProps> = (props) => {
	const { name, label, rules, formItemProps, onChecked, ...checkboxProps } = props;

	return (
		<Form.Item name={name} label={label} rules={rules} {...formItemProps} valuePropName="checked">
			<BaseCheckboxAntd
				{...checkboxProps}
				onChange={(e) => {
					onChecked?.(e.target.checked, e);
				}}
			/>
		</Form.Item>
	);
};

export default CheckboxInputItem;