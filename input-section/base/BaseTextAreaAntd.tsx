import { Input } from 'antd';
import React from 'react';
import { TextAreaProps } from 'antd/es/input';

const { TextArea } = Input;

export interface IBaseTextAreaAntdProps extends TextAreaProps {
	// Có thể mở rộng thêm props tùy chỉnh nếu cần
	testId?: string;
	testIdPrefix?: string;
}

export const BaseTextAreaAntd: React.FC<IBaseTextAreaAntdProps> = (props) => {
	const { style, testId, testIdPrefix, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		width: '100%',
		...style,
	};

	// Auto-generate testId if not provided
	const finalTestId = testId || (testIdPrefix ? `${testIdPrefix}-textarea` : undefined);

	return <TextArea style={mergedStyle} data-testid={finalTestId} {...rest} />;
};

export default BaseTextAreaAntd;