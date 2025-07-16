import { Switch, SwitchProps } from 'antd';
import React from 'react';

export interface IBaseSwitchAntdProps extends SwitchProps {
	// Có thể mở rộng thêm props tùy chỉnh nếu cần
	testId?: string;
	testIdPrefix?: string;
}

export const BaseSwitchAntd: React.FC<IBaseSwitchAntdProps> = (props) => {
	const { style, testId, testIdPrefix, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		...style,
	};

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-switch` : undefined);

	return <Switch style={mergedStyle} data-testid={finalTestId} {...rest} />;
};

export default BaseSwitchAntd;