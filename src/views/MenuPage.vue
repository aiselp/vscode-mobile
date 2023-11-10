<template >
    <ion-content>
        <div :style="style" style="display: flex;height: 100%;width: 100%;flex-direction: column;">
            <Menu v-model:selectedKeys="current" mode="horizontal" :items="items" />
            <div style="flex-grow: 1;width: 100%;padding: 0px;overflow: hidden;">
                <div ref="activityBar" style="display: none;"></div>
                <div id="sidebar" v-show="current[0] === 'search' || current[0] === 'file'"
                    style="width: 100%;height: 100%;" ref="sidebar"></div>
                <SettingMenu v-if="current[0] === 'settings'"></SettingMenu>
            </div>
        </div>
    </ion-content>
</template>
<script setup lang="ts">
import { IonContent, IonIcon } from '@ionic/vue';
import { ref, onMounted, h, watch, computed } from 'vue'
import { folder, search, settings } from 'ionicons/icons';
import { MenuProps } from 'ant-design-vue';
import { renderSidebarPart, renderActivitybarPar } from '../core/setup'
import SettingMenu from './SettingMenu.vue';
import { openSearch, openExplorer } from '../core/shortcutFunctions'
import { theme, Menu, } from "ant-design-vue";
import { useElementSize } from '@vueuse/core'

const { token } = theme.useToken()
const style = computed(() => {
    return {
        "background-color": token.value.colorBgBase,
        "color": token.value.colorText
    }
})

const current = ref<string[]>(['file']);
const sidebar = ref<HTMLElement>()
const activityBar = ref<HTMLElement>()

const { height: sidebarHeight } = useElementSize(sidebar)
const stop = watch(sidebarHeight, (height) => {
    if (height > 100) {
        stop()
        sidebar.value!!.style.height = height + 'px'
    }
})

watch(current, ([value]) => {
    console.log(value);
    switch (value) {
        case 'file':
            openExplorer()
            break;
        case 'search':
            openSearch()
            break;
        case "settings":
            break;
    }
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

onMounted(() => {
    renderSidebarPart(sidebar.value!!)
    renderActivitybarPar(activityBar.value!!)
})
</script>
<style scoped></style>