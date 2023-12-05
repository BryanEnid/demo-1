import React, { useRef, useState } from 'react';

export function Camera() {
	const cameraRef = useRef(null);
	const [isStreaming, setIsStreaming] = useState(false);

	React.useEffect(() => {
		startStreaming();
	}, []);

	const startStreaming = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: { width: window.innerWidth, height: window.innerHeight }
		});
		cameraRef.current.srcObject = stream;
		setIsStreaming(true);
	};

	return (
		<div>
			<video muted autoPlay playsInline ref={cameraRef} style={{ width: '100%' }} />
		</div>
	);
}
