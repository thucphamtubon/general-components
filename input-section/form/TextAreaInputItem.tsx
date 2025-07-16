import { Form } from 'antd';
import React from 'react';
import BaseTextAreaAntd, { IBaseTextAreaAntdProps } from '../base/BaseTextAreaAntd';

export interface ITextAreaInputItemProps extends Omit<IBaseTextAreaAntdProps, 'onChange'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	onInputed?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextAreaInputItem: React.FC<ITextAreaInputItemProps> = (props) => {
	const { name, label, rules, formItemProps, onInputed, ...textAreaProps } = props;

	return (
		<Form.Item name={name} label={label} rules={rules} {...formItemProps}>
			<BaseTextAreaAntd
				{...textAreaProps}
				onChange={(e) => {
					onInputed?.(e.target.value, e);
				}}
			/>
		</Form.Item>
	);
};

export default TextAreaInputItem;