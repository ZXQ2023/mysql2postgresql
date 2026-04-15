import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives()],
  theme: {
    fontFamily: {
      sans: '"IBM Plex Sans", system-ui, -apple-system, sans-serif',
      mono: '"IBM Plex Mono", "SF Mono", "Fira Code", monospace',
    },
    colors: {
      surface: {
        0: '#08080a',
        1: '#111116',
        2: '#1a1a22',
        3: '#25252f',
        4: '#31313d',
      },
      accent: {
        DEFAULT: '#00ffa3',
        dim: '#00ffa326',
        muted: '#00ffa318',
      },
      mysql: '#ff7b72',
      pgsql: '#58e1f7',
    },
  },
})
