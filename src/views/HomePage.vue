<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <ion-menu menu-id="main-menu" @ionDidOpen="meunSate = true" @ionDidClose="meunSate = false" type="reveal"
        contentId="main-content">
        <MenuPage></MenuPage>
      </ion-menu>

      <!-- ----------body-------------- -->
      <div class="ion-page" style="width: 100%;" id="main-content">
        <ion-content :fullscreen="true">
          <div :style="style" id="container">
            <TopToolbar></TopToolbar>
            <div style="flex-grow: 1;overflow: hidden;position: relative;">
              <div ref="editors" style="height: 100%;width: 100%;"></div>
            </div>
            <div ref="statusBar"></div>
          </div>
        </ion-content>
      </div>
    </ion-split-pane>
    <BottomShortcuts :style="style"></BottomShortcuts>
    <bottom-log-page :style="style"></bottom-log-page>
  </ion-page>
</template>

<script setup lang="ts">
import BottomLogPage from './BottomLogPage.vue'
import TopToolbar from './TopToolbar.vue'
import MenuPage from './MenuPage.vue';
import BottomShortcuts from './BottomShortcuts.vue'
import { IonContent, IonPage, IonSplitPane, IonMenu, menuController } from '@ionic/vue';
import { ref, onMounted, watch, watchEffect, computed } from 'vue'
import { attachPart, Parts } from '@codingame/monaco-vscode-views-service-override'
import { renderEditorPart, renderStatusBarPart } from '../core/setup'
import { meunSate } from '../core/appConfigs'
import { theme } from 'ant-design-vue';

const { token } = theme.useToken()
const style = computed(() => {
  return {
    "background-color": token.value.colorBgBase,
    "color": token.value.colorText
  }
})


const editors = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const statusBar = ref<HTMLElement>()
watchEffect(() => {
  const s = style.value
  const html = statusBar.value?.childNodes[0] as HTMLElement
  if (html) {
    Object.assign(html.style, s)
  }
})
onMounted(() => {
  // renderStatusBarPart(statusBar.value!!)
  renderEditorPart(editors.value!!)
  attachPart(Parts.STATUSBAR_PART, statusBar.value!!)
  //监听菜单状态
  watch(meunSate, async (v) => {
    if (v) {
      await menuController.open('main-menu')
    } else await menuController.close('main-menu')
  })
})

</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#container :deep(a) {
  color: inherit;
}

#sidebar {
  text-align: left;
}
</style>