import type { Config } from 'tailwindcss';
import defaults from 'tailwindcss/defaultTheme';

// import forms from '@tailwindcss/forms';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-default)', ...defaults.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
export default config;
