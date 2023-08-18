import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { symbols as defaultSymbols } from './user_symbols'

export const enableTopToolbar = useStorage<boolean>('app.enableTopToolbar', true)
export const enableBottomShortcuts = useStorage<boolean>('app.enableBottomShortcuts', true)

export const symbols = useStorage('app.symbols', defaultSymbols)

export const meunSate = ref<boolean>(false)
export const rootPath = useStorage<string>('app.rootPath', '/')