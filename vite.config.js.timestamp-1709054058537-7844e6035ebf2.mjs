// vite.config.js
import { defineConfig } from 'file:///C:/Users/Bryan/Projects/Web%20Apps/Observe-PWA/node_modules/vite/dist/node/index.js';
import path from 'path';
import react from 'file:///C:/Users/Bryan/Projects/Web%20Apps/Observe-PWA/node_modules/@vitejs/plugin-react-swc/index.mjs';
import { VitePWA } from 'file:///C:/Users/Bryan/Projects/Web%20Apps/Observe-PWA/node_modules/vite-plugin-pwa/dist/index.js';
import { qrcode } from 'file:///C:/Users/Bryan/Projects/Web%20Apps/Observe-PWA/node_modules/vite-plugin-qrcode/dist/index.js';

// public/manifest.json
var manifest_default = {
	theme_color: '#ffffff',
	background_color: '#5598dc',
	icons: [
		{ purpose: 'maskable', sizes: '512x512', src: 'icon512_maskable.png', type: 'image/png' },
		{ purpose: 'any', sizes: '512x512', src: 'icon512_rounded.png', type: 'image/png' }
	],
	orientation: 'portrait',
	display: 'standalone',
	dir: 'auto',
	lang: 'en-US',
	name: 'Observe',
	short_name: 'Observe',
	start_url: 'https://dev.observe.space',
	scope: 'https://dev.observe.space'
};

// vite.config.js
var __vite_injected_original_dirname = 'C:\\Users\\Bryan\\Projects\\Web Apps\\Observe-PWA';
var vite_config_default = defineConfig({
	plugins: [
		react(),
		VitePWA({
			// Registering PWA
			registerType: 'autoUpdate',
			injectRegister: 'script',
			// Workbox
			workbox: {
				clientsClaim: true,
				skipWaiting: true
			},
			devOptions: {
				enabled: true
			},
			// Manifest
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
			manifest: manifest_default
		}),
		qrcode()
	],
	optimizeDeps: {
		exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
	},
	server: {
		// port: 3000
		// ! Enable this for local https
		https: {
			key: path.resolve(__vite_injected_original_dirname, 'localhost.key'),
			cert: path.resolve(__vite_injected_original_dirname, 'localhost.crt')
		},
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp'
		}
	},
	resolve: {
		alias: {
			'@': path.resolve(__vite_injected_original_dirname, 'src')
			// Create an alias named '@' pointing to the 'src' folder
		}
	}
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicHVibGljL21hbmlmZXN0Lmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCcnlhblxcXFxQcm9qZWN0c1xcXFxXZWIgQXBwc1xcXFxPYnNlcnZlLVBXQVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQnJ5YW5cXFxcUHJvamVjdHNcXFxcV2ViIEFwcHNcXFxcT2JzZXJ2ZS1QV0FcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0JyeWFuL1Byb2plY3RzL1dlYiUyMEFwcHMvT2JzZXJ2ZS1QV0Evdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG4vLyBQbHVnaW5zXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcclxuaW1wb3J0IHsgcXJjb2RlIH0gZnJvbSAndml0ZS1wbHVnaW4tcXJjb2RlJztcclxuXHJcbi8vIEZpbGVzXHJcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL3B1YmxpYy9tYW5pZmVzdC5qc29uJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcblx0cGx1Z2luczogW1xyXG5cdFx0cmVhY3QoKSxcclxuXHRcdFZpdGVQV0Eoe1xyXG5cdFx0XHQvLyBSZWdpc3RlcmluZyBQV0FcclxuXHRcdFx0cmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcblx0XHRcdGluamVjdFJlZ2lzdGVyOiAnc2NyaXB0JyxcclxuXHJcblx0XHRcdC8vIFdvcmtib3hcclxuXHRcdFx0d29ya2JveDoge1xyXG5cdFx0XHRcdGNsaWVudHNDbGFpbTogdHJ1ZSxcclxuXHRcdFx0XHRza2lwV2FpdGluZzogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0ZGV2T3B0aW9uczoge1xyXG5cdFx0XHRcdGVuYWJsZWQ6IHRydWVcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdC8vIE1hbmlmZXN0XHJcblx0XHRcdGluY2x1ZGVBc3NldHM6IFsnZmF2aWNvbi5pY28nLCAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnLCAnbWFzay1pY29uLnN2ZyddLFxyXG5cdFx0XHRtYW5pZmVzdFxyXG5cdFx0fSksXHJcblx0XHRxcmNvZGUoKVxyXG5cdF0sXHJcblxyXG5cdG9wdGltaXplRGVwczoge1xyXG5cdFx0ZXhjbHVkZTogWydAZmZtcGVnL2ZmbXBlZycsICdAZmZtcGVnL3V0aWwnXVxyXG5cdH0sXHJcblxyXG5cdHNlcnZlcjoge1xyXG5cdFx0Ly8gcG9ydDogMzAwMFxyXG5cdFx0Ly8gISBFbmFibGUgdGhpcyBmb3IgbG9jYWwgaHR0cHNcclxuXHRcdGh0dHBzOiB7XHJcblx0XHRcdGtleTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2xvY2FsaG9zdC5rZXknKSxcclxuXHRcdFx0Y2VydDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2xvY2FsaG9zdC5jcnQnKVxyXG5cdFx0fSxcclxuXHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0J0Nyb3NzLU9yaWdpbi1PcGVuZXItUG9saWN5JzogJ3NhbWUtb3JpZ2luJyxcclxuXHRcdFx0J0Nyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3knOiAncmVxdWlyZS1jb3JwJ1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHJlc29sdmU6IHtcclxuXHRcdGFsaWFzOiB7XHJcblx0XHRcdCdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpIC8vIENyZWF0ZSBhbiBhbGlhcyBuYW1lZCAnQCcgcG9pbnRpbmcgdG8gdGhlICdzcmMnIGZvbGRlclxyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcbiIsICJ7XCJ0aGVtZV9jb2xvclwiOlwiI2ZmZmZmZlwiLFwiYmFja2dyb3VuZF9jb2xvclwiOlwiIzU1OThkY1wiLFwiaWNvbnNcIjpbe1wicHVycG9zZVwiOlwibWFza2FibGVcIixcInNpemVzXCI6XCI1MTJ4NTEyXCIsXCJzcmNcIjpcImljb241MTJfbWFza2FibGUucG5nXCIsXCJ0eXBlXCI6XCJpbWFnZS9wbmdcIn0se1wicHVycG9zZVwiOlwiYW55XCIsXCJzaXplc1wiOlwiNTEyeDUxMlwiLFwic3JjXCI6XCJpY29uNTEyX3JvdW5kZWQucG5nXCIsXCJ0eXBlXCI6XCJpbWFnZS9wbmdcIn1dLFwib3JpZW50YXRpb25cIjpcInBvcnRyYWl0XCIsXCJkaXNwbGF5XCI6XCJzdGFuZGFsb25lXCIsXCJkaXJcIjpcImF1dG9cIixcImxhbmdcIjpcImVuLVVTXCIsXCJuYW1lXCI6XCJPYnNlcnZlXCIsXCJzaG9ydF9uYW1lXCI6XCJPYnNlcnZlXCIsXCJzdGFydF91cmxcIjpcImh0dHBzOi8vZGV2Lm9ic2VydmUuc3BhY2VcIixcInNjb3BlXCI6XCJodHRwczovL2Rldi5vYnNlcnZlLnNwYWNlXCJ9Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVSxTQUFTLG9CQUFvQjtBQUNqVyxPQUFPLFVBQVU7QUFHakIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixTQUFTLGNBQWM7OztBQ052Qix5QkFBQyxhQUFjLFdBQVUsa0JBQW1CLFdBQVUsT0FBUSxDQUFDLEVBQUMsU0FBVSxZQUFXLE9BQVEsV0FBVSxLQUFNLHdCQUF1QixNQUFPLFlBQVcsR0FBRSxFQUFDLFNBQVUsT0FBTSxPQUFRLFdBQVUsS0FBTSx1QkFBc0IsTUFBTyxZQUFXLENBQUMsR0FBRSxhQUFjLFlBQVcsU0FBVSxjQUFhLEtBQU0sUUFBTyxNQUFPLFNBQVEsTUFBTyxXQUFVLFlBQWEsV0FBVSxXQUFZLDZCQUE0QixPQUFRLDRCQUEyQjs7O0FEQTNhLElBQU0sbUNBQW1DO0FBWXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVM7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQTtBQUFBLE1BRVAsY0FBYztBQUFBLE1BQ2QsZ0JBQWdCO0FBQUE7QUFBQSxNQUdoQixTQUFTO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxhQUFhO0FBQUEsTUFDZDtBQUFBLE1BRUEsWUFBWTtBQUFBLFFBQ1gsU0FBUztBQUFBLE1BQ1Y7QUFBQTtBQUFBLE1BR0EsZUFBZSxDQUFDLGVBQWUsd0JBQXdCLGVBQWU7QUFBQSxNQUN0RTtBQUFBLElBQ0QsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLEVBQ1I7QUFBQSxFQUVBLGNBQWM7QUFBQSxJQUNiLFNBQVMsQ0FBQyxrQkFBa0IsY0FBYztBQUFBLEVBQzNDO0FBQUEsRUFFQSxRQUFRO0FBQUE7QUFBQTtBQUFBLElBR1AsT0FBTztBQUFBLE1BQ04sS0FBSyxLQUFLLFFBQVEsa0NBQVcsZUFBZTtBQUFBLE1BQzVDLE1BQU0sS0FBSyxRQUFRLGtDQUFXLGVBQWU7QUFBQSxJQUM5QztBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsOEJBQThCO0FBQUEsTUFDOUIsZ0NBQWdDO0FBQUEsSUFDakM7QUFBQSxFQUNEO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUE7QUFBQSxJQUNuQztBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
