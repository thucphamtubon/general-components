import { TimePicker, TimePickerProps } from 'antd';
import { Moment } from 'moment';
import React from 'react';

export interface IBaseTimePickerAntdProps extends Omit<TimePickerProps, 'onChange'> {
	onChange?: (time: Moment | null, timeString: string) => void;
	testId?: string;
	testIdPrefix?: string;
}

export const BaseTimePickerAntd: React.FC<IBaseTimePickerAntdProps> = (props) => {
	const { style, testId, testIdPrefix, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		width: '100%',
		...style,
	};

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-time-picker` : undefined);

	return <TimePicker style={mergedStyle} data-testid={finalTestId} {...rest} />;
};

export default BaseTimePickerAntd;