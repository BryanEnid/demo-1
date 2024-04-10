// vite.config.js
import { defineConfig } from 'file:///C:/Users/javau/Downloads/ProductionApps/Observe/observe-pwa/node_modules/vite/dist/node/index.js';
import path from 'path';
import react from 'file:///C:/Users/javau/Downloads/ProductionApps/Observe/observe-pwa/node_modules/@vitejs/plugin-react-swc/index.mjs';
import { VitePWA } from 'file:///C:/Users/javau/Downloads/ProductionApps/Observe/observe-pwa/node_modules/vite-plugin-pwa/dist/index.js';
import { qrcode } from 'file:///C:/Users/javau/Downloads/ProductionApps/Observe/observe-pwa/node_modules/vite-plugin-qrcode/dist/index.js';

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
var __vite_injected_original_dirname = 'C:\\Users\\javau\\Downloads\\ProductionApps\\Observe\\observe-pwa';
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
			// devOptions: {
			// 	enabled: true
			// },
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicHVibGljL21hbmlmZXN0Lmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqYXZhdVxcXFxEb3dubG9hZHNcXFxcUHJvZHVjdGlvbkFwcHNcXFxcT2JzZXJ2ZVxcXFxvYnNlcnZlLXB3YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcamF2YXVcXFxcRG93bmxvYWRzXFxcXFByb2R1Y3Rpb25BcHBzXFxcXE9ic2VydmVcXFxcb2JzZXJ2ZS1wd2FcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2phdmF1L0Rvd25sb2Fkcy9Qcm9kdWN0aW9uQXBwcy9PYnNlcnZlL29ic2VydmUtcHdhL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gUGx1Z2luc1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCB7IHFyY29kZSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXFyY29kZSc7XG5cbi8vIEZpbGVzXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9wdWJsaWMvbWFuaWZlc3QuanNvbic7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRwbHVnaW5zOiBbXG5cdFx0cmVhY3QoKSxcblx0XHRWaXRlUFdBKHtcblx0XHRcdC8vIFJlZ2lzdGVyaW5nIFBXQVxuXHRcdFx0cmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG5cdFx0XHRpbmplY3RSZWdpc3RlcjogJ3NjcmlwdCcsXG5cblx0XHRcdC8vIFdvcmtib3hcblx0XHRcdHdvcmtib3g6IHtcblx0XHRcdFx0Y2xpZW50c0NsYWltOiB0cnVlLFxuXHRcdFx0XHRza2lwV2FpdGluZzogdHJ1ZVxuXHRcdFx0fSxcblxuXHRcdFx0Ly8gZGV2T3B0aW9uczoge1xuXHRcdFx0Ly8gXHRlbmFibGVkOiB0cnVlXG5cdFx0XHQvLyB9LFxuXG5cdFx0XHQvLyBNYW5pZmVzdFxuXHRcdFx0aW5jbHVkZUFzc2V0czogWydmYXZpY29uLmljbycsICdhcHBsZS10b3VjaC1pY29uLnBuZycsICdtYXNrLWljb24uc3ZnJ10sXG5cdFx0XHRtYW5pZmVzdFxuXHRcdH0pLFxuXHRcdHFyY29kZSgpXG5cdF0sXG5cblx0b3B0aW1pemVEZXBzOiB7XG5cdFx0ZXhjbHVkZTogWydAZmZtcGVnL2ZmbXBlZycsICdAZmZtcGVnL3V0aWwnXVxuXHR9LFxuXG5cdHNlcnZlcjoge1xuXHRcdC8vIHBvcnQ6IDMwMDBcblx0XHQvLyAhIEVuYWJsZSB0aGlzIGZvciBsb2NhbCBodHRwc1xuXHRcdGh0dHBzOiB7XG5cdFx0XHRrZXk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdsb2NhbGhvc3Qua2V5JyksXG5cdFx0XHRjZXJ0OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbG9jYWxob3N0LmNydCcpXG5cdFx0fSxcblx0XHRoZWFkZXJzOiB7XG5cdFx0XHQnQ3Jvc3MtT3JpZ2luLU9wZW5lci1Qb2xpY3knOiAnc2FtZS1vcmlnaW4nLFxuXHRcdFx0J0Nyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3knOiAncmVxdWlyZS1jb3JwJ1xuXHRcdH1cblx0fSxcblxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpIC8vIENyZWF0ZSBhbiBhbGlhcyBuYW1lZCAnQCcgcG9pbnRpbmcgdG8gdGhlICdzcmMnIGZvbGRlclxuXHRcdH1cblx0fVxufSk7XG4iLCAie1widGhlbWVfY29sb3JcIjpcIiNmZmZmZmZcIixcImJhY2tncm91bmRfY29sb3JcIjpcIiM1NTk4ZGNcIixcImljb25zXCI6W3tcInB1cnBvc2VcIjpcIm1hc2thYmxlXCIsXCJzaXplc1wiOlwiNTEyeDUxMlwiLFwic3JjXCI6XCJpY29uNTEyX21hc2thYmxlLnBuZ1wiLFwidHlwZVwiOlwiaW1hZ2UvcG5nXCJ9LHtcInB1cnBvc2VcIjpcImFueVwiLFwic2l6ZXNcIjpcIjUxMng1MTJcIixcInNyY1wiOlwiaWNvbjUxMl9yb3VuZGVkLnBuZ1wiLFwidHlwZVwiOlwiaW1hZ2UvcG5nXCJ9XSxcIm9yaWVudGF0aW9uXCI6XCJwb3J0cmFpdFwiLFwiZGlzcGxheVwiOlwic3RhbmRhbG9uZVwiLFwiZGlyXCI6XCJhdXRvXCIsXCJsYW5nXCI6XCJlbi1VU1wiLFwibmFtZVwiOlwiT2JzZXJ2ZVwiLFwic2hvcnRfbmFtZVwiOlwiT2JzZXJ2ZVwiLFwic3RhcnRfdXJsXCI6XCJodHRwczovL2Rldi5vYnNlcnZlLnNwYWNlXCIsXCJzY29wZVwiOlwiaHR0cHM6Ly9kZXYub2JzZXJ2ZS5zcGFjZVwifSJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVgsU0FBUyxvQkFBb0I7QUFDOVksT0FBTyxVQUFVO0FBR2pCLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsU0FBUyxjQUFjOzs7QUNOdkIseUJBQUMsYUFBYyxXQUFVLGtCQUFtQixXQUFVLE9BQVEsQ0FBQyxFQUFDLFNBQVUsWUFBVyxPQUFRLFdBQVUsS0FBTSx3QkFBdUIsTUFBTyxZQUFXLEdBQUUsRUFBQyxTQUFVLE9BQU0sT0FBUSxXQUFVLEtBQU0sdUJBQXNCLE1BQU8sWUFBVyxDQUFDLEdBQUUsYUFBYyxZQUFXLFNBQVUsY0FBYSxLQUFNLFFBQU8sTUFBTyxTQUFRLE1BQU8sV0FBVSxZQUFhLFdBQVUsV0FBWSw2QkFBNEIsT0FBUSw0QkFBMkI7OztBREEzYSxJQUFNLG1DQUFtQztBQVl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUE7QUFBQSxNQUVQLGNBQWM7QUFBQSxNQUNkLGdCQUFnQjtBQUFBO0FBQUEsTUFHaEIsU0FBUztBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsYUFBYTtBQUFBLE1BQ2Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BT0EsZUFBZSxDQUFDLGVBQWUsd0JBQXdCLGVBQWU7QUFBQSxNQUN0RTtBQUFBLElBQ0QsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLEVBQ1I7QUFBQSxFQUVBLGNBQWM7QUFBQSxJQUNiLFNBQVMsQ0FBQyxrQkFBa0IsY0FBYztBQUFBLEVBQzNDO0FBQUEsRUFFQSxRQUFRO0FBQUE7QUFBQTtBQUFBLElBR1AsT0FBTztBQUFBLE1BQ04sS0FBSyxLQUFLLFFBQVEsa0NBQVcsZUFBZTtBQUFBLE1BQzVDLE1BQU0sS0FBSyxRQUFRLGtDQUFXLGVBQWU7QUFBQSxJQUM5QztBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsOEJBQThCO0FBQUEsTUFDOUIsZ0NBQWdDO0FBQUEsSUFDakM7QUFBQSxFQUNEO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUE7QUFBQSxJQUNuQztBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
