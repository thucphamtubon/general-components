import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';

export interface IBaseInputNumberAntdProps extends InputNumberProps {
	// Có thể mở rộng thêm props tùy chỉnh nếu cần
	testId?: string;
	testIdPrefix?: string;
}

export const BaseInputNumberAntd: React.FC<IBaseInputNumberAntdProps> = (props) => {
	const { style, testId, testIdPrefix, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		width: '100%',
		...style,
	};

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-input-number` : undefined);

	return <InputNumber style={mergedStyle} data-testid={finalTestId} {...rest} />;
};

export default BaseInputNumberAntd;