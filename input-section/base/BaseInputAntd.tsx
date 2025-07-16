import { Input, InputProps } from 'antd';
import React from 'react';

export interface IBaseInputAntdProps extends InputProps {
	// Có thể mở rộng thêm props tùy chỉnh nếu cần
	testId?: string;
	testIdPrefix?: string;
}

export const BaseInputAntd: React.FC<IBaseInputAntdProps> = (props) => {
	const { style, testId, testIdPrefix, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		width: '100%',
		...style,
	};

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-input` : undefined);

	return <Input style={mergedStyle} data-testid={finalTestId} {...rest} />;
};

export default BaseInputAntd;