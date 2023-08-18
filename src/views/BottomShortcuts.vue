<template >
    <div @touchstart="updateInputBox" @click="resetFocus" v-show="show" class="main">
        <div style="height: 100%;width: 140px;">
            <a-space-compact class="warp" size="middle" wrap>
                <a-button class="button" type="text" @click="test('0')" :icon="h(IonIcon, { icon: logoNodejs })"></a-button>
                <a-button class="button" type="text" @click="selection" :icon="h(IonIcon, { icon: crop })"></a-button>
                <a-button class="button" type="text" @click="moveCursorByOffset(-1, 0)"
                    :icon="h(IonIcon, { icon: chevronUp })"></a-button>
                <a-button class="button" type="text" @click="copySelection" :icon="h(IonIcon, { icon: copy })"></a-button>
                <a-button class="button" type="text" @click="inputText('\t')"
                    :icon="h(IonIcon, { icon: swapHorizontal })"></a-button>
                <a-button class="button" type="text" @click="moveCursorByOffset(0, -1)"
                    :icon="h(IonIcon, { icon: chevronBack })"></a-button>
                <a-button class="button" type="text" @click="moveCursorByOffset(1, 0)"
                    :icon="h(IonIcon, { icon: chevronDown })"></a-button>
                <a-button class="button" type="text" @click="moveCursorByOffset(0, 1)"
                    :icon="h(IonIcon, { icon: chevronForward })"></a-button>
            </a-space-compact>
        </div>
        <div style="height: 100%;overflow: auto;flex: 1;">
            <a-space-compact class="warp" size="middle" wrap>
                <a-button @click="inputText(symbol.insertText)" class="button" v-for="(symbol, i) in symbols" :key="i"
                    type="text">{{ symbol.hint }}</a-button>
            </a-space-compact>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, h } from "vue"
import { crop, chevronBack, chevronForward, chevronDown, newspaper, chevronUp, copy, logoNodejs, swapHorizontal } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import { enableBottomShortcuts, symbols } from '../core/appConfigs'
import { moveCursorByOffset, selection, copySelection } from '../core/shortcutFunctions'
import { keyboard as keyboardStatus } from '../core/native/native_status'

const currentInputBox = ref<HTMLElement>()

const show = computed<boolean>(() => {
    if (import.meta.env.DEV) {
        return enableBottomShortcuts.value
    }
    return enableBottomShortcuts.value && keyboardStatus.value
})
function updateInputBox() {
    console.log(document.activeElement);

    currentInputBox.value = document.activeElement as HTMLElement
}
function resetFocus() {
    currentInputBox.value?.focus?.();
}
function inputText(str: string) {
    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    (currentInputBox.value as HTMLIonTextareaElement).value += str
    currentInputBox.value?.dispatchEvent(inputEvent)
}
function test(t: string) {
    console.log(t);
}
</script>
<style scoped>
.main {
    position: absolute;
    background-color: #ffffff;
    display: flex;
    bottom: 0;
    width: 100%;
    height: 80px;
}

.warp {
    flex-wrap: wrap;
}

.button {
    width: 35px;
    height: 40px;
    /* font-size: small; */
}
</style>../core/use_status/native_status../core/native/native_status