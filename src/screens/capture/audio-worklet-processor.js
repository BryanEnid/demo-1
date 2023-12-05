// audio-worklet-processor.js
class AWProcessor extends AudioWorkletProcessor {
	constructor() {
		super();
	}

	process(inputs, outputs, parameters) {
		const input = inputs[0];
		const bufferLength = input[0].length;
		const dataArray = new Uint8Array(bufferLength);

		// Process audio data as needed
		// Example: compute the average amplitude
		let sum = 0;
		for (let i = 0; i < bufferLength; i++) {
			sum += Math.abs(input[0][i]);
		}
		const average = sum / bufferLength;

		// Post the result to the main thread
		this.port.postMessage({ type: 'audioData', data: { average } });

		return true;
	}
}

registerProcessor('vumeter', AWProcessor);
