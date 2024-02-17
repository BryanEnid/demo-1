import React from 'react';
import { RichUtils } from 'draft-js';

import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@/chadcn/Button.jsx';

export const Toolbar = ({ editorState, setEditorState }) => {
	const toolbarRef = React.useRef();

	React.useEffect(() => {
		let observer;
		if (toolbarRef.current) {
			const toggleStyles = ([e]) => {
				e.target.children[0].classList.toggle('is-pinned', e.intersectionRatio < 1);
			};
			observer = new IntersectionObserver(toggleStyles, {
				threshold: [1]
			});

			observer.observe(toolbarRef.current);
		}

		return () => observer?.disconnect();
	}, [toolbarRef]);

	const tools = [
		{
			label: 'bold',
			style: 'BOLD',
			icon: 'octicon:bold-24',
			method: 'inline'
		},
		{
			label: 'italic',
			style: 'ITALIC',
			icon: 'tabler:italic',
			method: 'inline'
		},
		{
			label: 'underline',
			style: 'UNDERLINE',
			icon: 'tabler:underline',
			method: 'inline'
		},
		{
			label: 'Blockquote',
			style: 'blockquote',
			icon: 'tabler:blockquote',
			method: 'block'
		},
		{
			label: 'Unordered-List',
			style: 'unordered-list-item',
			method: 'block',
			icon: 'tabler:list'
		},
		{
			label: 'Ordered-List',
			style: 'ordered-list-item',
			method: 'block',
			icon: 'mingcute:list-ordered-line'
		},
		{
			label: 'Code Block',
			style: 'code-block',
			icon: 'tabler:code',
			method: 'block'
		},
		{ label: 'H1', style: 'header-one', method: 'block' },
		{ label: 'H2', style: 'header-two', method: 'block' },
		{ label: 'H3', style: 'header-three', method: 'block' },
		{ label: 'H4', style: 'header-four', method: 'block' },
		{ label: 'H5', style: 'header-five', method: 'block' },
		{ label: 'H6', style: 'header-six', method: 'block' }
	];

	const applyStyle = (e, style, method) => {
		e.preventDefault();

		method === 'block'
			? setEditorState(RichUtils.toggleBlockType(editorState, style))
			: setEditorState(RichUtils.toggleInlineStyle(editorState, style));
	};

	const isActive = (style, method) => {
		if (method === 'block') {
			const selection = editorState.getSelection();
			const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
			return blockType === style;
		} else {
			const currentStyle = editorState.getCurrentInlineStyle();
			return currentStyle.has(style);
		}
	};

	return (
		<div className="sticky top-0 z-10" ref={toolbarRef}>
			<div className="w-full h-full bg-white transition-all">
				<div className="flex items-center">
					{tools.map((item, i) => (
						<Button
							variant="ghost"
							className={`px-3 ${!isActive(item.style, item.method) ? 'opacity-50' : ''}`}
							key={item.label}
							title={item.label}
							onClick={(e) => applyStyle(e, item.style, item.method)}
							onMouseDown={(e) => e.preventDefault()}
						>
							{item.icon ? <Icon icon={item.icon} className="text-2xl" /> : item.label}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
};
