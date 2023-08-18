import { Keyboard } from '@capacitor/keyboard';
import { ref, computed, h } from "vue"

export const keyboard = ref<boolean>(false)

Keyboard.addListener('keyboardDidHide', () => {
    keyboard.value = false
});

Keyboard.addListener('keyboardDidShow', () => {
    keyboard.value = true
});

