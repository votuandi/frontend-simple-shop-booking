/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors:{
        'app-brown': '#745039',
        'dark-brown': '#2B221B',
        'medium-brown': '#2F1707',
        'light-brown': '#9A8C81',
        'app-mint': '#16B49E',
        'background-01': '#fcf8f5'
      },
      backgroundImage: {
        'light': "url('/img/bg-background-01.jpg')",
        'dark': "url('/img/bg-background-02.jpg')",
        'course': "url('/img/bg-background-course.jpg')",
        'avatar-circle': "url('/img/img-avatar-circle.png')",
        'avatar-circle-sm': "url('/img/img-avatar-circle-sm.png')",
        'wave': "url('/img/bg-wave.png')",
        'yellow-noise': "url('/img/bg-yellow.png')",
        'detail-title': "url('/img/bg-detail-title.png')",
        'metaphysical-information': "url('/img/bg-metaphysical-information.png')",
        'member-center': "url('/img/bg-member.png')",
        'member-center-mobile': "url('/img/bg-member-mobile.jpg')"
      },
      fontFamily: {
        "noto-sans-tc": ["Noto Sans TC", "sans-serif"],
        "perpetua-titling-mt": ["Perpetua Titling MT", "sans-serif"],
      },
      screens: {
        'pc': '1400px'
      }
    },
  },
  plugins: [],
}
