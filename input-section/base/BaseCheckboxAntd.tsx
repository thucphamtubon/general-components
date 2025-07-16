import { Checkbox, CheckboxProps } from 'antd';
import React from 'react';

export interface IBaseCheckboxAntdProps extends CheckboxProps {
	// Có thể mở rộng thêm props tùy chỉnh nếu cần
	testId?: string;
	testIdPrefix?: string;
}

export const BaseCheckboxAntd: React.FC<IBaseCheckboxAntdProps> = (props) => {
	const { style, testId, testIdPrefix, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		...style,
	};

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-checkbox` : undefined);

	return <Checkbox style={mergedStyle} data-testid={finalTestId} {...rest} />;
};

export default BaseCheckboxAntd;