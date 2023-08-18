<template >
    <div class="content">

        <a-card>
            <a-button @click="openSettings" type="primary" block>打开编辑器设置</a-button>
        </a-card>
        <IonList>
            <IonItem class="item">
                <IonText>主题</IonText>
            </IonItem>
            <IonItem>
                <IonText>顶部工具栏</IonText>
                <IonToggle slot="end" v-model="enableTopToolbar"></IonToggle>
            </IonItem>
            <IonItem>
                <IonText>底部工具栏</IonText>
                <IonToggle slot="end" v-model="enableBottomShortcuts"></IonToggle>
            </IonItem>
        </IonList>
    </div>
</template>
<script setup lang="ts">
import { enableBottomShortcuts, enableTopToolbar } from '../core/appConfigs'
import { IonItem, IonLabel, IonList, IonInput, IonText, IonToggle } from '@ionic/vue';
import { openSettings } from '../core/shortcutFunctions'

</script>
<style scoped>
.content {
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>