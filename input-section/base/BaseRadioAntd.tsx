import { Radio, RadioProps } from 'antd';
import React from 'react';

export interface IBaseRadioAntdProps extends RadioProps {
	// Có thể mở rộng thêm props tùy chỉnh nếu cần
}

export const BaseRadioAntd: React.FC<IBaseRadioAntdProps> = (props) => {
	const { style, ...rest } = props;

	const mergedStyle: React.CSSProperties = {
		...style,
	};

	return <Radio style={mergedStyle} {...rest} />;
};

export default BaseRadioAntd;