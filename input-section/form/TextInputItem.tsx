import { Form } from 'antd';
import React from 'react';
import BaseInputAntd, { IBaseInputAntdProps } from '../base/BaseInputAntd';

export interface ITextInputItemProps extends Omit<IBaseInputAntdProps, 'onChange'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	onInputed?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
	testId?: string;
	testIdPrefix?: string;
}

export const TextInputItem: React.FC<ITextInputItemProps> = (props) => {
	const { name, label, rules, formItemProps, onInputed, testId, testIdPrefix, ...inputProps } = props;

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-${name}` : `form-input-${name}`);
	const formItemTestId = testIdPrefix ? `${testIdPrefix}-form-item-${name}` : `form-item-${name}`;

	return (
		<Form.Item name={name} label={label} rules={rules} data-testid={formItemTestId} {...formItemProps}>
			<BaseInputAntd
				{...inputProps}
				testId={finalTestId}
				onChange={(e) => {
					onInputed?.(e.target.value, e);
				}}
			/>
		</Form.Item>
	);
};

export default TextInputItem;