import { Form } from 'antd';
import React from 'react';
import BaseInputNumberAntd, { IBaseInputNumberAntdProps } from '../base/BaseInputNumberAntd';

export interface INumberInputItemProps extends Omit<IBaseInputNumberAntdProps, 'onChange'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	onInputed?: (value: number | string | null) => void;
	testId?: string;
	testIdPrefix?: string;
}

export const NumberInputItem: React.FC<INumberInputItemProps> = (props) => {
	const { name, label, rules, formItemProps, onInputed, testId, testIdPrefix, ...inputProps } = props;

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-${name}` : `form-input-number-${name}`);
	const formItemTestId = testIdPrefix ? `${testIdPrefix}-form-item-${name}` : `form-item-${name}`;

	return (
		<Form.Item name={name} label={label} rules={rules} data-testid={formItemTestId} {...formItemProps}>
			<BaseInputNumberAntd
				{...inputProps}
				testId={finalTestId}
				onChange={(value) => {
					onInputed?.(value);
				}}
			/>
		</Form.Item>
	);
};

export default NumberInputItem;