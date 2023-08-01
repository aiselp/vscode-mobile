<template>
  <ion-split-pane content-id="main-content">
    <ion-menu type="reveal" contentId="main-content">
      <MenuPage></MenuPage>
    </ion-menu>

    <!-- ----------body-------------- -->
    <div class="ion-page" style="width: 100%;" id="main-content">
      <ion-content :fullscreen="true">
        <div id="container">
          <TopToolbar></TopToolbar>
          <div ref="editors" style="flex-grow: 1;"></div>
          <div ref="statusBar"></div>
        </div>
      </ion-content>
    </div>
  </ion-split-pane>
  <BottomShortcuts></BottomShortcuts>
  <bottom-log-page></bottom-log-page>
</template>

<script setup lang="ts">
import BottomLogPage from './BottomLogPage.vue'
import TopToolbar from './TopToolbar.vue'
import MenuPage from './MenuPage.vue';
import BottomShortcuts from './BottomShortcuts.vue'
import { IonContent, IonSplitPane, IonMenu } from '@ionic/vue';
import { ref, onMounted } from 'vue'
import { renderEditorPart, renderStatusBarPart } from '../core/setup'

const editors = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const statusBar = ref<HTMLElement>()
onMounted(() => {
  renderEditorPart(editors.value!!)
  renderStatusBarPart(statusBar.value!!)
})

</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

}

#sidebar {
  text-align: left;
}
</style>
<style>
.monaco-icon-label::before {
  width: 22px;
}

.monaco-tl-twistie {
  transform: translateX(6px);
  margin-right: 7px;
}
</style>