// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		public: { url: '/', static: true },
		src: '/',
	},
	plugins: ['@snowpack/plugin-postcss', '@snowpack/plugin-babel'],
	packageOptions: {},
	devOptions: {},
	buildOptions: {
		clean: true,
	},
	optimize: {
		bundle: true,
		minify: true,
		target: 'es2018',
	},
}
