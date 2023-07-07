<template>
    <ion-modal :keep-contents-mounted="true" trigger="open-log" :initial-breakpoint="0.75" :breakpoints="[0, 0.5, 0.75]"
        handle-behavior="cycle">
        <div style="height: 75%;">
            <div ref="body" style="height: 100%;"></div>
        </div>

    </ion-modal>
</template>
  
<script setup lang="ts">
import { IonModal, IonContent, IonLabel } from '@ionic/vue';
import { ref, onMounted } from 'vue'
import { renderPanelPart, renderStatusBarPart } from '../core/setup'

// const statusBar = ref<HTMLElement>()
const body = ref<HTMLElement>()
onMounted(async () => {
    renderPanelPart(body.value!!)
})

</script>