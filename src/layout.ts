import { useStorage } from '@vueuse/core'
import { ref } from 'vue'




export const editorBodyLeftOffset = useStorage<number>('layout.editorBodyLeftOffset', 0)