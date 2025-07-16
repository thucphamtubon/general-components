import { DatePicker } from 'antd';
import { Moment } from 'moment';
import React from 'react';
import { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;

export interface IBaseRangePickerAntdProps extends Omit<RangePickerProps, 'onChange'> {
	onChange?: (dates: [Moment | null, Moment | null] | null, dateStrings: [string, string]) => void;
	testId?: string;
	testIdPrefix?: string;
}

export const BaseRangePickerAntd: React.FC<IBaseRangePickerAntdProps> = (props) => {
	const { style, testId, testIdPrefix, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		width: '100%',
		...style,
	};

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-range-picker` : undefined);

	return <RangePicker style={mergedStyle} data-testid={finalTestId} {...rest} />;
};

export default BaseRangePickerAntd;