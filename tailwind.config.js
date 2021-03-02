module.exports = {
	purge: ['./src/**/*.html', './src/**/*.js', './public/**/*.html', './public/**/*.js'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {
			opacity: ['disabled'],
		},
	},
	plugins: [require('@tailwindcss/forms')],
}
