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
        slate: {
          850: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        focus: {
          'lecture-notes': '#3B82F6',
          'review-assignment': '#F59E0B',
          'setup-environment': '#64748B',
          'code-prototype': '#22C55E',
          'study-prerequisite': '#A855F7',
          'optimize-impl': '#F43F5E',
        }
      },
    },
  },
  plugins: [],
}

export default config