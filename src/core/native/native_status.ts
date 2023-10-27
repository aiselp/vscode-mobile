import { ref, computed, h } from "vue"
import { syncRef } from '@vueuse/core'
import { getNativeApp } from './index'

export const keyboard = ref<boolean>(false);

async function init() {
    const nativeApp = await getNativeApp()
    if (nativeApp) {
        syncRef(keyboard, nativeApp.keyboardStatus)
    }
}

init()