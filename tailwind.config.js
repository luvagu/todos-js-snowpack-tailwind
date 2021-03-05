module.exports = {
	purge: ['./src/**/*.html', './src/**/*.js', './public/**/*.html', './public/**/*.js'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			animation: {
				spin: 'spin 6s linear infinite'
			},
			keyframes: {

			}
		},
	},
	variants: {
		extend: {
			opacity: ['active'],
		},
	},
	plugins: [require('@tailwindcss/forms')],
}
