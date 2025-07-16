import { Select, SelectProps } from 'antd';
import React from 'react';

export interface IBaseSelectAntdProps extends SelectProps {
	// Có thể mở rộng thêm props tùy chỉnh nếu cần
	testId?: string;
	testIdPrefix?: string;
}

export const BaseSelectAntd: React.FC<IBaseSelectAntdProps> = (props) => {
	const { style, testId, testIdPrefix, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		width: '100%',
		...style,
	};

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-select` : undefined);

	return <Select style={mergedStyle} data-testid={finalTestId} {...rest} />;
};

export default BaseSelectAntd;