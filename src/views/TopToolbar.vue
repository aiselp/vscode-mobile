<template>
    <a-modal v-model:open="filel" title="输入文件夹路径" @ok="openFolder">
        <a-input v-model:value="path" style="width:100%" />
    </a-modal>
    <div v-show="enableTopToolbar" style="display: flex;justify-content: center;">
        <a-space-compact class="warp" size="middle" wrap>
            <a-dropdown :trigger="['click']">
                <a-button :size="size" class="dbutton" :icon="h(IonIcon, { icon: document })">
                    <span>文件</span></a-button>
                <template #overlay>
                    <a-menu @click="">
                        <a-menu-item @click="openFile">打开文件</a-menu-item>
                        <a-menu-divider />
                        <a-menu-item @click="filel = true">打开文件夹</a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <a-dropdown :trigger="['click']">
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
            <a-button @click="start" :size="size" class="dbutton" :icon="h(IonIcon, { icon: play })">
                <span>运行</span></a-button>
            <a-button :size="size" class="dbutton" :icon="h(IonIcon, { icon: arrowUndo })"
                @click="undo"><span>撤销</span></a-button>
            <a-button :size="size" class="dbutton" :icon="h(IonIcon, { icon: arrowRedo })"
                @click="redo"><span>重做</span></a-button>
            <a-button :size="size" class="dbutton" @click="saveFile"
                :icon="h(IonIcon, { icon: save })"><span>保存</span></a-button>
        </a-space-compact>
    </div>
</template>
<script setup lang="ts" >
import { IonIcon } from '@ionic/vue';
import { ref, onMounted, h } from 'vue'
import { save, arrowUndo, arrowRedo, play, pencil, document } from 'ionicons/icons';
import { enableBottomShortcuts, enableTopToolbar, rootPath } from '../core/appConfigs'
import type { SizeType } from 'ant-design-vue/es/config-provider';
import {
    save as saveFile, undo, redo, gotoline, execCommand,
    find, commentLine, formatDocument, openNewFolder
} from '../core/shortcutFunctions'
import type { MenuProps } from 'ant-design-vue';
import * as vscode from 'vscode'
import { Modal } from 'ant-design-vue';
import { createVNode, watch } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const foldAll = ref<boolean>(false)
const filel = ref<boolean>(false)
const path = ref<string>(rootPath.value)
const size = ref<SizeType>("middle");
const editMenu: string[] = ['查找/替换', '跳转', '折叠/展开', '执行命令']
const onEditMenuClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key as number) {
        case 0:
            await find()
            break;
        case 1:
            await gotoline()
            break;
        case 2:
            foldAll.value = !foldAll.value;
            foldAll.value ? execCommand('editor.foldAll') : execCommand('editor.unfoldAll')
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

async function start() {
    const commands = vscode.commands.getCommands();
    commands.then((allCommands: string[]) => {
        allCommands.forEach((command) => {
            console.log(command);
        });
    });
}
function openFolder() {
    filel.value = false
    openNewFolder(path.value)
}
function openFile() {

}
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