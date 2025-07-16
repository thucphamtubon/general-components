import { Form, Select } from 'antd';
import React from 'react';
import BaseSelectAntd, { IBaseSelectAntdProps } from '../base/BaseSelectAntd';
import type { DefaultOptionType } from 'antd/es/select';

const { Option } = Select;

export interface ISelectOption {
	label: string;
	value: any;
	disabled?: boolean;
}

export interface ISelectInputItemProps extends Omit<IBaseSelectAntdProps, 'onChange' | 'options'> {
	name: string;
	label?: React.ReactNode;
	rules?: any[];
	formItemProps?: any;
	options: ISelectOption[];
	onSelected?: (value: any, option: DefaultOptionType | DefaultOptionType[]) => void;
	testId?: string;
	testIdPrefix?: string;
}

export const SelectInputItem: React.FC<ISelectInputItemProps> = (props) => {
	const { name, label, rules, formItemProps, options, onSelected, testId, testIdPrefix, ...selectProps } = props;

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-${name}` : `form-select-${name}`);
	const formItemTestId = testIdPrefix ? `${testIdPrefix}-form-item-${name}` : `form-item-${name}`;

	return (
		<Form.Item name={name} label={label} rules={rules} data-testid={formItemTestId} {...formItemProps}>
			<BaseSelectAntd
				{...selectProps}
				testId={finalTestId}
				onChange={(value, option) => {
					onSelected?.(value, option);
				}}
			>
				{options.map((option, index) => (
					<Option
						key={`${option.value}-${index}`}
						value={option.value}
						disabled={option.disabled}
						data-testid={`${finalTestId}-option-${option.value}`}
					>
						{option.label}
					</Option>
				))}
			</BaseSelectAntd>
		</Form.Item>
	);
};

export default SelectInputItem;