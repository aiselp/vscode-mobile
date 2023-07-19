<template>
  <ion-menu type="reveal" contentId="main-content">
    <ion-content>
      <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" />
      <div style="display: flex;height: 100%;width: 100%;">
        <div ref="activityBar" style="display: none;"></div>
        <div id="sidebar" style="width: 100%;height: 100%;" ref="sidebar"></div>
      </div>
    </ion-content>
  </ion-menu>
  <bottom-log-page></bottom-log-page>
  <!-- ----------body-------------- -->
  <ion-page id="main-content">
    <ion-content :fullscreen="true">
      <div id="container">
        <TopToolbar></TopToolbar>
        <div ref="editors" style="flex-grow: 1;"></div>
        <div ref="statusBar"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import BottomLogPage from './BottomLogPage.vue'
import TopToolbar from './TopToolbar.vue'
import { IonContent, IonIcon, IonPage, IonMenu } from '@ionic/vue';
import { ref, onMounted, h, watch } from 'vue'
import { folder, search, settings } from 'ionicons/icons';
import { renderEditorPart, renderSidebarPart, renderActivitybarPar, renderStatusBarPart } from '../core/setup'
import { MenuProps } from 'ant-design-vue';

const current = ref<string[]>(['file']);
watch(current, (value) => {
  console.log(value);
})
const items = ref<MenuProps['items']>([
  {
    key: 'file',
    icon: () => h(IonIcon, { icon: folder }),
    label: '文件',
    title: '文件',
  },
  {
    key: 'search',
    icon: () => h(IonIcon, { icon: search }),
    label: '搜索',
    title: '搜索',
  },
  {
    key: 'settings',
    icon: () => h(IonIcon, { icon: settings }),
    label: '设置',
    title: '设置',
  },
]);

const sidebar = ref<HTMLElement>()
const activityBar = ref<HTMLElement>()
const editors = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const statusBar = ref<HTMLElement>()
onMounted(async () => {
  renderEditorPart(editors.value!!)
  renderSidebarPart(sidebar.value!!)
  renderActivitybarPar(activityBar.value!!)
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
