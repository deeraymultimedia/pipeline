import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ─── Deeray Multimedia design tokens ─────────────────────────────────────
      colors: {
        // Primary brand colours
        navy:   '#1B2A4A',   // Primary navy: headings, body emphasis, borders
        teal:   '#0EA5A0',   // Primary teal: actions, highlights, accents

        // Surface colours
        canvas: '#F7F8FA',   // Off-white content canvas
        white:  '#FFFFFF',   // Card and panel backgrounds

        // Text
        'text-primary':  '#1B2A4A',  // Dark navy body text
        'text-muted':    '#6B7A99',  // Supporting notes, placeholders
        'text-on-dark':  '#FFFFFF',  // Text on navy backgrounds

        // Borders
        'border-subtle': '#E4E8F0',  // Thin structural separation
        'border-active': '#1B2A4A',  // Active/focus border

        // Light tints (for callout boxes, alternate table rows)
        'teal-light':  '#EAF7F7',   // Very light teal panels
        'navy-light':  '#EEF1F7',   // Very light navy for alternate rows

        // Stage colours
        stage: {
          lead:     '#888780',
          proposal: '#378ADD',
          approval: '#EF9F27',
          build:    '#7F77DD',
          qa:       '#D85A30',
          live:     '#1D9E75',
        },

        // Relationship health colours
        health: {
          healthy:   '#1D9E75',
          attention: '#EF9F27',
          at_risk:   '#D85A30',
          inactive:  '#888780',
        },
      },

      // ─── Typography scale ─────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'Aptos', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],   // 10px
        'xs':  ['0.75rem',  { lineHeight: '1rem' }],   // 12px
        'sm':  ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'md':  ['1rem',     { lineHeight: '1.5rem' }],  // 16px
        'lg':  ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl':  ['1.25rem',  { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],    // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      },

      // ─── Spacing scale ────────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      // ─── Border radius ────────────────────────────────────────────────────────
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // ─── Box shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        'card': '0 1px 3px 0 rgba(27, 42, 74, 0.08), 0 1px 2px -1px rgba(27, 42, 74, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(27, 42, 74, 0.1), 0 2px 4px -2px rgba(27, 42, 74, 0.06)',
        'popover': '0 10px 15px -3px rgba(27, 42, 74, 0.12), 0 4px 6px -4px rgba(27, 42, 74, 0.08)',
      },

      // ─── CSS variables (safe-area, touch targets) ─────────────────────────────
      // These are applied as var() references in index.css
    },
  },
  plugins: [],
};

export default config;
