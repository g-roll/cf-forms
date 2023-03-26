module.exports = {
	printWidth: 80,
	semi: true,
	singleQuote: true,
	tabWidth: 4,
	useTabs: true,
	bracketSameLine: true,
	plugins: [
		require.resolve('prettier-plugin-organize-imports'),
		require.resolve('prettier-plugin-jsdoc')
	],
};
