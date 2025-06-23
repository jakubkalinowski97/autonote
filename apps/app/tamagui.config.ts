import { createTamagui, createFont } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'
import { tokens } from '@tamagui/themes'
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'
import { createAnimations } from '@tamagui/animations-react-native'

const interFont = createFont({
  family: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
  size: {
    1: 12,
    2: 14,
    3: 15,
    4: 16,
    5: 18,
    6: 20,
    7: 24,
    8: 30,
    9: 48,
  },
  weight: {
    1: '300',
    3: '400',
    4: '500',
    6: '700',
    7: '900',
  },
  lineHeight: {
    1: 14,
    2: 18,
    3: 20,
    4: 22,
    5: 24,
    6: 28,
    7: 32,
    8: 38,
    9: 58,
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
  },
})

const darkPalette = ['hsla(0, 15%, 1%, 1)','hsla(0, 15%, 6%, 1)','hsla(0, 15%, 12%, 1)','hsla(0, 15%, 17%, 1)','hsla(0, 15%, 23%, 1)','hsla(0, 15%, 28%, 1)','hsla(0, 15%, 34%, 1)','hsla(0, 15%, 39%, 1)','hsla(0, 15%, 45%, 1)','hsla(0, 15%, 50%, 1)','hsla(0, 15%, 93%, 1)','hsla(0, 15%, 99%, 1)']
const lightPalette = ['hsla(0, 15%, 94%, 1)','hsla(0, 15%, 88%, 1)','hsla(0, 15%, 83%, 1)','hsla(0, 15%, 77%, 1)','hsla(0, 15%, 72%, 1)','hsla(0, 15%, 66%, 1)','hsla(0, 15%, 61%, 1)','hsla(0, 15%, 55%, 1)','hsla(0, 15%, 50%, 1)','hsla(0, 15%, 15%, 1)','hsla(0, 15%, 1%, 1)']

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

const animations = createAnimations({
  fast: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    damping: 20,
    stiffness: 60,
  },
})

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,
  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },
    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: ['hsla(226, 50%, 35%, 1)','hsla(226, 50%, 38%, 1)','hsla(226, 50%, 41%, 1)','hsla(226, 50%, 43%, 1)','hsla(226, 50%, 46%, 1)','hsla(226, 50%, 49%, 1)','hsla(226, 50%, 52%, 1)','hsla(226, 50%, 54%, 1)','hsla(226, 50%, 57%, 1)','hsla(226, 50%, 60%, 1)','hsla(250, 50%, 90%, 1)','hsla(250, 50%, 95%, 1)'],
      light: ['hsla(226, 50%, 45%, 1)','hsla(226, 50%, 47%, 1)','hsla(226, 50%, 49%, 1)','hsla(226, 50%, 52%, 1)','hsla(226, 50%, 54%, 1)','hsla(226, 50%, 56%, 1)','hsla(226, 50%, 58%, 1)','hsla(226, 50%, 61%, 1)','hsla(226, 50%, 63%, 1)','hsla(226, 50%, 65%, 1)','hsla(250, 50%, 95%, 1)','hsla(250, 50%, 95%, 1)'],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  }
})

export type Themes = typeof builtThemes

export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
  process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)


const appConfig = createTamagui({
  themes,
  tokens,
  shorthands,
  fonts: {
    body: interFont,
    heading: interFont,
  },
  animations,
})

export type AppConfig = typeof appConfig


export default appConfig 