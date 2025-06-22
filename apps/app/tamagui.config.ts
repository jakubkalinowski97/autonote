import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes } from '@tamagui/themes'
import { color as tamaguiColors, radius, size, space, zIndex } from '@tamagui/themes'

const headingFont = createInterFont({
  size: {
    6: 15,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
})

const bodyFont = createInterFont({
  size: {
    6: 15,
  },
})

// Custom color palette
export const color = {
  white: '#FFFFFF',
  black: '#000000',

  // Neutrals (Grays)
  gray0: '#F9FAFB',
  gray1: '#F3F4F6',
  gray2: '#E5E7EB',
  gray3: '#D1D5DB',
  gray4: '#9CA3AF',
  gray5: '#6B7280',
  gray6: '#4B5563',
  gray7: '#374151',
  gray8: '#1F2937',
  gray9: '#111827',

  // Accent (Modern Blue)
  blue1: '#EFF6FF',
  blue2: '#DBEAFE',
  blue3: '#BFDBFE',
  blue4: '#93C5FD',
  blue5: '#60A5FA',
  blue6: '#3B82F6', // Primary
  blue7: '#2563EB',
  blue8: '#1D4ED8',
  blue9: '#1E40AF',

  // Alerts (optional)
  red: '#EF4444',
  yellow: '#FACC15',
  green: '#10B981',
}

const tokens = createTokens({
  color: {
    ...tamaguiColors,
    ...color,
  },
  radius,
  size,
  space,
  zIndex,
})


const appConfig = createTamagui({
  themes: {
    ...themes,
    light_blue: {
      background: color.white,
      color: color.gray9,
      borderColor: color.gray2,
      placeholderColor: color.gray4,
    },
    dark_blue: {
      background: color.gray9,
      color: color.gray0,
      borderColor: color.gray7,
      placeholderColor: color.gray5,
    },
  },
  tokens,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  // or '@tamagui/core'
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig 