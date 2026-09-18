/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js}'
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--bg)',
        panel: 'var(--panel)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-mute': 'var(--ink-mute)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)'
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'PingFang SC',
          'Segoe UI',
          'Microsoft YaHei',
          'system-ui',
          'sans-serif'
        ],
        serif: [
          'New York',
          'Georgia',
          'Songti SC',
          'Noto Serif SC',
          'SimSun',
          'Times New Roman',
          'serif'
        ],
        mono: [
          'SF Mono',
          'ui-monospace',
          'JetBrains Mono',
          'Menlo',
          'Consolas',
          'monospace'
        ]
      },
      maxWidth: {
        content: '44rem',
        wide: '60rem'
      },
      animation: {
        'fade-in': 'fadeIn .45s ease-in-out',
        'slide-up': 'slideUp .4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
