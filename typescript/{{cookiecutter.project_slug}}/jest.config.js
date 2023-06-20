module.exports = {
	roots: ['<rootDir>/src'],
	testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	coverageReporters: ['html', 'clover', 'json', 'lcov', ['text', { skipFull: true }]]
};
