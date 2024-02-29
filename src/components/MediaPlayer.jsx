import React from 'react';
// import ReactDOM from "react-dom";
import 'aframe';
import { Entity, Scene } from 'aframe-react';
import videoasset from '../assets/360example.mp4';
import png from '@/assets/observe_logo_512.png';
import { Image } from './Image';

export function VR_3D() {
	const [color, setColor] = React.useState('');

	const changeColor = () => {
		const colors = ['red', 'orange', 'yellow', 'green', ''];
		const getRandomColor = () => {
			const arr = colors.filter((item) => item !== color);
			return arr[Math.floor(Math.random() * arr.length)];
		};
		setColor(getRandomColor());
	};

	return (
		<Scene>
			<a-assets>
				<Image id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" />
				<Image id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" />
			</a-assets>

			<Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100" />
			<Entity primitive="a-light" type="ambient" intensity="2" color="#445451" />
			<Entity primitive="a-light" type="point" intensity="1" position="2 4 4" />

			<Entity primitive="a-sky" height="2048" radius="30" src="#skyTexture" theta-length="90" width="2048" />

			<Entity
				id="box"
				geometry={{ primitive: 'box' }}
				material={{ src: png, color, opacity: 1 }}
				position={{ x: 0, y: 1, z: -3 }}
				events={{ click: changeColor }}
			/>

			<Entity
				primitive="a-camera"
				camera="fov: 80"
				look-controls-enabled={false}
				wasd-controls-enabled={false}
				rotation-reader
			>
				<Entity
					primitive="a-cursor"
					cursor="fuse: false;"
					animation__click={{
						property: 'scale',
						startEvents: 'click',
						from: '0.1 0.1 0.1',
						to: '1 1 1',
						dur: 150
					}}
				/>
			</Entity>
		</Scene>
	);
}

export function Video360({ className, onVideoReady, src }) {
	const videoRef = React.useRef();
	const [isReady, setReady] = React.useState(null);
	const mounted = React.useRef(false);

	React.useEffect(() => {
		const content = videoRef.current?.components?.material?.material?.map?.image;
		if (content) {
			setReady(true);
			onVideoReady(videoRef, content);
		}

		if (!content) setTimeout(() => setReady(false), 1000);

		return () => {};
	}, [isReady, src]);

	return (
		<a-scene
			vr-mode-ui="enabled: true"
			webxr="requiredFeatures: hit-test,local-floor;
    optionalFeatures: dom-overlay,unbounded;
    overlayElement: #overlay;"
		>
			<a-videosphere
				ref={videoRef}
				// rotation="-40 0 -88"
				rotation="0 180 0"
				src="#video"
			/>

			<a-assets>
				<video id="video" style={{ display: 'none' }} autoPlay loop>
					<source type="video/mp4" src={src} />
				</video>
			</a-assets>
		</a-scene>
	);
}
