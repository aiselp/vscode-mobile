import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core'
import { ref, computed, h } from "vue"

export const keyboard = ref<boolean>(false);

if (Capacitor.isNativePlatform()) {
    Keyboard.addListener('keyboardDidHide', () => {
        keyboard.value = false
    });

    Keyboard.addListener('keyboardDidShow', () => {
        keyboard.value = true
    });

} else {

}

