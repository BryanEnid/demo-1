import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { cn } from '@/lib/utils.js';
import { Input } from '@/chadcn/Input.jsx';
import { Button } from '@/chadcn/Button';

const EditableLabel = ({
	controls,
	value,
	focus,
	className,
	onSave: handleSave = () => {},
	onCancel: handleCancel = () => {}
}) => {
	const [inputVal, setInputVal] = useState(value);
	const [editing, setEditing] = useState(false);

	const inpElRef = useRef();

	useEffect(() => {
		if (focus) {
			inpElRef.current?.focus?.();
			setEditing(true);
		}
	}, [focus]);

	const onSave = () => {
		if (!inputVal) {
			setInputVal(value);
			return handleCancel();
		}

		if (value !== inputVal) {
			handleSave(inputVal);
		} else {
			handleCancel();
		}
	};

	const onCancel = () => {
		setEditing(false);
		setInputVal(value);
		handleCancel();
	};

	const onFocus = () => {
		setEditing(true);
	};

	const onBlur = () => {
		if (!controls) {
			setEditing(false);
			onSave();
		}
	};

	return (
		<div className="flex items-center gap-1 max-w-full">
			<div className="flex relative h-[44px] overflow-hidden">
				<div className={cn('px-3 mr-3 bar border-l border-r border-transparent invisible', className)}>{inputVal}</div>
				<Input
					ref={inpElRef}
					value={inputVal}
					className={cn(
						!controls || !editing ? 'border-transparent shadow-none focus:border-input focus:shadow-sm' : '',
						'absolute top-[1px] left-[1px] right-[1px] w-auto',
						className
					)}
					onChange={(e) => setInputVal(e.target.value)}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
			</div>
			{controls && editing && (
				<>
					<Button className="w-[36px] h-[36px] p-1 shrink-0" onClick={() => onSave(inputVal)}>
						<Icon icon="ci:check-big" className="text-2xl" />
					</Button>
					<Button variant="secondary" className="rounded-full shrink-0 w-[36px] h-[36px] p-1" onClick={onCancel}>
						<Icon icon="mingcute:close-fill" className="text-2xl" />
					</Button>
				</>
			)}
		</div>
	);
};

export default EditableLabel;
