import { DatePicker, DatePickerProps } from 'antd';
import { Moment } from 'moment';
import React from 'react';

export interface IBaseDatePickerAntdProps extends Omit<DatePickerProps, 'onChange' | 'showTime'> {
	onChange?: (date: Moment | null, dateString: string) => void;
	showTime?: boolean | object;
	testId?: string;
	testIdPrefix?: string;
}

export const BaseDatePickerAntd: React.FC<IBaseDatePickerAntdProps> = (props) => {
	const { style, testId, testIdPrefix, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		width: '100%',
		...style,
	};

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-date-picker` : undefined);

	return <DatePicker style={mergedStyle} data-testid={finalTestId} {...rest} />;
};

export default BaseDatePickerAntd;