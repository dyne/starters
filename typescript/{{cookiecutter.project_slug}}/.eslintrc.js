module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	rules: {
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/consistent-type-definitions': ['error', 'type']
	}
};
