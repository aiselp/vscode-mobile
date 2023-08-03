import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { symbols as defaultSymbols } from './user_symbols'

export const enableTopToolbar = useStorage<boolean>('app.enableTopToolbar', true)
export const enableBottomShortcuts = useStorage<boolean>('app.enableBottomShortcuts', true)

export const symbols = useStorage('app.symbols', defaultSymbols)
