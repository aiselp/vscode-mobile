<template>
  <ConfigProvider :theme="ant_theme">
    <ion-app>
      <ion-router-outlet />
    </ion-app>
  </ConfigProvider>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { ConfigProvider } from 'ant-design-vue';
import { ant_theme } from './theme'

</script>
