import { Form } from 'antd';
import React from 'react';
import BaseSwitchAntd, { IBaseSwitchAntdProps } from '../base/BaseSwitchAntd';

export interface ISwitchInputItemProps extends Omit<IBaseSwitchAntdProps, 'onChange'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	onSwitched?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SwitchInputItem: React.FC<ISwitchInputItemProps> = (props) => {
	const { name, label, rules, formItemProps, onSwitched, ...switchProps } = props;

	return (
		<Form.Item name={name} label={label} rules={rules} {...formItemProps} valuePropName="checked">
			<BaseSwitchAntd
				{...switchProps}
				onChange={(checked, event) => {
					onSwitched?.(checked, event);
				}}
			/>
		</Form.Item>
	);
};

export default SwitchInputItem;