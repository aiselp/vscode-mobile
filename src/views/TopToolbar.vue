<template>
    <div v-show="enableTopToolbar" style="display: flex;justify-content: center;">
        <a-dropdown>
            <a-button :size="size" class="dbutton" :icon="h(IonIcon, { icon: pencil })">
                <span>编辑</span></a-button>
            <template #overlay>
                <a-menu @click="onEditMenuClick">
                    <a-menu-item v-for="(menu, index) in editMenu" :key="index">
                        {{ menu }}
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item :key="editMenu.length">格式化文档</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-button :size="size" class="dbutton" :icon="h(IonIcon, { icon: play })">
            <span>运行</span></a-button>
        <a-button :size="size" class="dbutton" :icon="h(IonIcon, { icon: arrowUndo })"
            @click="undo"><span>撤销</span></a-button>
        <a-button :size="size" class="dbutton" :icon="h(IonIcon, { icon: arrowRedo })"
            @click="redo"><span>重做</span></a-button>
        <a-button :size="size" class="dbutton" @click="saveFile"
            :icon="h(IonIcon, { icon: save })"><span>保存</span></a-button>
    </div>
</template>
<script setup lang="ts" >
import { IonIcon } from '@ionic/vue';
import { ref, onMounted, h } from 'vue'
import { save, arrowUndo, arrowRedo, play, pencil } from 'ionicons/icons';
import { enableBottomShortcuts, enableTopToolbar } from '../core/appConfigs'
import type { SizeType } from 'ant-design-vue/es/config-provider';
import { save as saveFile, undo, redo, gotoline, find, commentLine, formatDocument } from '../core/shortcutFunctions'
import type { MenuProps } from 'ant-design-vue';


const size = ref<SizeType>("middle");
const editMenu: string[] = ['查找/替换', '跳转', '折叠所有', '执行命令']
const onEditMenuClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key as number) {
        case 0:
            await find()
            break;
        case 1:
            await gotoline()
            break;
        case 2:

            break;
        case 3:
            await commentLine()
            break;
        case 4:
            await formatDocument()
            break;
    }
    console.log(`Click on item ${key}`);
};
</script>
<style scoped>
.dbutton {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 45px;
    font-size: 1.2em;
}

.dbutton span {
    font-size: 0.5em;
}
</style>