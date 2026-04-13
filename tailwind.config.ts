import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Kinetic Manuscript design system tokens
        'surface-container-low': '#eff1f2',
        'surface-container-lowest': '#ffffff',
        'surface-container': '#e6e8ea',
        'surface-container-high': '#e0e3e4',
        'surface-container-highest': '#dadddf',
        'surface-dim': '#d1d5d7',
        'surface-bright': '#f5f6f7',
        'on-surface': '#2c2f30',
        'on-surface-variant': '#595c5d',
        'inverse-surface': '#0c0f10',
        'inverse-on-surface': '#9b9d9e',
        'outline': '#757778',
        'outline-variant': '#abadae',
        'primary': '#652fe7',
        'primary-dim': '#5819db',
        'primary-container': '#a98fff',
        'on-primary': '#f7f0ff',
        'on-primary-container': '#280072',
        'inverse-primary': '#9a7bff',
        'secondary': '#006571',
        'secondary-dim': '#005863',
        'secondary-container': '#26e6ff',
        'secondary-fixed-dim': '#00d7f0',
        'on-secondary': '#d8f8ff',
        'on-secondary-container': '#004f59',
        'tertiary': '#b60051',
        'tertiary-dim': '#a00047',
        'tertiary-container': '#ff8fa9',
        'tertiary-fixed-dim': '#ff769b',
        'on-tertiary': '#ffeff0',
        'on-tertiary-container': '#66002b',
        'error': '#b31b25',
        'error-container': '#fb5151',
        'on-error': '#ffefee',
        'on-error-container': '#570008',
        // Focus tag colors (spec §5)
        focus: {
          'lecture-notes': '#3B82F6',
          'review-assignment': '#F59E0B',
          'setup-environment': '#64748B',
          'code-prototype': '#22C55E',
          'study-prerequisite': '#A855F7',
          'optimize-impl': '#F43F5E',
        },
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.375rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0 0 0 1px #f1f5f9, 3px 0 0 rgba(255,69,0,0.15), -1px 0 0 rgba(0,255,255,0.1)',
        'card-hover': '0 4px 24px -4px rgba(44,47,48,0.12)',
        atmospheric: '0 20px 60px -10px rgba(44,47,48,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
