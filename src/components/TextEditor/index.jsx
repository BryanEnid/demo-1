import React, { useState } from 'react';
import { Editor, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

import { Toolbar } from '@/components/TextEditor/Toolbar.jsx';
import './styles.css';

const TextEditor = ({ state, readOnly, placeholder, setState }) => {
	const [isFocus, setIsFocus] = useState(false);

	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);

		if (newState) {
			setState(newState);
			return 'handled';
		}

		return 'not-handled';
	};

	return (
		<div
			className={`${!readOnly ? 'border border-input pt-0' : 'readonly pt-2'} rounded-md bg-transparent ${
				isFocus ? 'ring-1 ring-ring' : ''
			}`}
		>
			{/* {!readOnly && (
				<div className="sticky top-0 opacity-1 z-10 after:sticky:bg-red-500">
					<div className="w-full h-full bg-white">
						<Toolbar editorState={state} setEditorState={setState} />
					</div>
				</div>
			)} */}

			{!readOnly && <Toolbar editorState={state} setEditorState={setState} />}

			<Editor
				readOnly={readOnly}
				placeholder={placeholder}
				editorState={state}
				onChange={setState}
				handleKeyCommand={handleKeyCommand}
				onFocus={() => setIsFocus(true)}
				onBlur={() => setIsFocus(false)}
			/>
		</div>
	);
};

export default TextEditor;
