<template>
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
          <div ref="editors" style="flex-grow: 1;"></div>
          <div ref="statusBar"></div>
        </div>
      </ion-content>
    </div>
  </ion-split-pane>
  <BottomShortcuts :style="style"></BottomShortcuts>
  <bottom-log-page :style="style"></bottom-log-page>
</template>

<script setup lang="ts">
import BottomLogPage from './BottomLogPage.vue'
import TopToolbar from './TopToolbar.vue'
import MenuPage from './MenuPage.vue';
import BottomShortcuts from './BottomShortcuts.vue'
import { IonContent, IonSplitPane, IonMenu, menuController } from '@ionic/vue';
import { ref, onMounted, watch, computed } from 'vue'
import { renderEditorPart, renderStatusBarPart } from '../core/setup'
import { meunSate } from '../core/appConfigs'
import { theme } from 'ant-design-vue';

const { token } = theme.useToken()
const style = computed(() => {
  return {
    "background-color": token.value.colorBgBase,
  }
})


const editors = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const statusBar = ref<HTMLElement>()
onMounted(() => {
  renderEditorPart(editors.value!!)
  renderStatusBarPart(statusBar.value!!)
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

#sidebar {
  text-align: left;
}
</style>