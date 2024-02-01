module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime'],
	ignorePatterns: ['dist', 'dev-dist', '.eslintrc.cjs', '_*.jsx', '*deprecated', '*.config.js'],
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	settings: { react: { version: '18.2' } },
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'no-unused-vars': [1],
		'react/prop-types': [0],
		'no-unused-vars': [0],
		'react/no-unescaped-entities': [0],
		'react-refresh/only-export-components': [0],
		'no-mixed-spaces-and-tabs': [0]
	}
};
