import React from "react";

export const FlexInputComponent = React.forwardRef((props, ref) => {
	const {
		h1Ref,
		id,
		onBlur,
		onChange,
		onKeyDown,
		placeholder,
		value,
		width,
		className,
	} = props;
	return (
		<>
			<div style={{ padding: "0.25rem" }}>
				<input
					className={`flexInput px-1 ${className}`}
					id={id}
					onBlur={onBlur}
					onKeyDown={onKeyDown}
					onChange={onChange}
					placeholder={placeholder}
					ref={ref}
					style={{
						fieldSizing: 'content',
					}}
					value={value}
				/>
			</div>
		</>
	);
});
