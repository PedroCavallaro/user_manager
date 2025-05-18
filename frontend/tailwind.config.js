/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				geist: ["Geist", "sans-serif"],
			},

			colors: {
				gray: {
					1000: "#EDEDE",
				},
				"rich-black": {
					100: "#0A0A0A",
				},
			},
		},
	},
	plugins: [],
};
