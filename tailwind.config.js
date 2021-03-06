module.exports = {
	purge: ['./src/**/*.html', './src/**/*.js', './public/**/*.html', './public/**/*.js'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			animation: {
				spin: 'spin 6s linear infinite',
				wiggle: 'wiggle 1s ease-in-out infinite'
			},
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-10deg)' },
					'50%': { transform: 'rotate(10deg)' },
				}
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
