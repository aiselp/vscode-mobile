<template>
  <ion-menu contentId="main-content">
    <ion-content>
      <div style="display: flex;height: 100%;width: 100%;">
        <div ref="activityBar" style="display: none;"></div>
        <div id="sidebar" style="width: 100%;height: 100%;" ref="sidebar"></div>
      </div>
    </ion-content>
  </ion-menu>
  <bottom-log-page></bottom-log-page>
  <!-- ----------body-------------- -->
  <ion-page id="main-content">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <div style="display: flex;">
          <ion-title>vscode-api</ion-title>
          <ion-button id="open-log">open</ion-button>
        </div>

      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container">
        <div ref="editors" style="flex-grow: 1;"></div>
        <div ref="statusBar"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import BottomLogPage from './BottomLogPage.vue'
import { IonContent, IonButton, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonMenu } from '@ionic/vue';
import { ref, onMounted } from 'vue'
import { renderEditorPart, renderSidebarPart, renderActivitybarPar, renderStatusBarPart } from '../core/setup'

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
