<template>
    <FilePicker :file-type="fileType" v-model:is-open="filePickerOpen"></FilePicker>
    <div v-show="enableTopToolbar" :style="style">
        <Space.Compact class="warp" size="middle" wrap>
            <IonMenuToggle>
                <Button :size="size" class="dbutton" :icon="h(IonIcon, { icon: menu })">
                    <span>菜单</span></Button>
            </IonMenuToggle>
            <Dropdown :trigger="['click']">
                <Button :size="size" class="dbutton" :icon="h(IonIcon, { icon: document })">
                    <span>文件</span></Button>
                <template #overlay>
                    <Menu @click="">
                        <menu-item @click="openFile">打开文件</menu-item>
                        <menu-divider />
                        <menu-item @click="openFolder">打开文件夹</menu-item>
                    </Menu>
                </template>
            </Dropdown>
            <Dropdown :trigger="['click']">
                <Button :size="size" class="dbutton" :icon="h(IonIcon, { icon: pencil })">
                    <span>编辑</span></Button>
                <template #overlay>
                    <Menu @click="onEditMenuClick">
                        <menu-item v-for="(menu, index) in editMenu" :key="index">
                            {{ menu }}
                        </menu-item>
                        <menu-divider />
                        <menu-item :key="editMenu.length">格式化文档</menu-item>
                    </Menu>
                </template>
            </Dropdown>
            <Button @click="start" :size="size" class="dbutton" :loading="codeRunning" :icon="h(IonIcon, { icon: play })">
                <span>运行</span></Button>
            <Button :size="size" class="dbutton" :icon="h(IonIcon, { icon: arrowUndo })"
                @click="undo"><span>撤销</span></Button>
            <Button :size="size" class="dbutton" :icon="h(IonIcon, { icon: arrowRedo })"
                @click="redo"><span>重做</span></Button>
            <Button :size="size" class="dbutton" @click="saveFile"
                :icon="h(IonIcon, { icon: save })"><span>保存</span></Button>
        </Space.Compact>
    </div>
</template>
<script setup lang="ts">
import { IonIcon, IonMenuToggle } from "@ionic/vue";
import { ref, h, computed } from "vue";
import {
    save, arrowUndo, arrowRedo,
    play, pencil, document, menu,
} from "ionicons/icons";
import { enableTopToolbar, rootPath } from "../core/appConfigs";
import type { SizeType } from "ant-design-vue/es/config-provider";
import {
    save as saveFile,
    undo, redo, gotoline, execCommand, find, commentLine, formatDocument,
} from "../core/shortcutFunctions";
import type { MenuProps } from "ant-design-vue";
import {
    message,
    notification,
    Space,
    Button,
    Dropdown,
    Menu,
    MenuItem,
    MenuDivider,
} from "ant-design-vue";
import * as vscode from "vscode";
import FilePicker from "./FilePicker.vue";
import { FileType } from "vscode";
import * as monaco from "monaco-editor";
import { prettierFormat, enable } from "@/core/tools/prettier";
import { getNativeApp } from "../core/native"

const style = computed(() => {
    return {
        "justify-content": "center",
        display: " flex",
    };
});

const codeRunning = ref(false)
const fileType = ref<FileType>(FileType.Directory);
const filePickerOpen = ref<boolean>(false);
const foldAll = ref<boolean>(false);
const size = ref<SizeType>("middle");
const editMenu: string[] = ["查找/替换", "跳转", "折叠/展开", "执行命令"];
const onEditMenuClick: MenuProps["onClick"] = async ({ key }) => {
    switch (key as number) {
        case 0:
            await find();
            break;
        case 1:
            await gotoline();
            break;
        case 2:
            foldAll.value = !foldAll.value;
            foldAll.value
                ? execCommand("editor.foldAll")
                : execCommand("editor.unfoldAll");
            break;
        case 3:
            await commentLine();
            break;
        case 4:
            let form = enable.value ? prettierFormat : formatDocument
            form().catch((err: Error) => {
                notification.error({
                    message: "格式化出错！",
                    description: err.message,
                });
            });
            break;
    }
    console.log(`Click on item ${key}`);
};
async function start() {
    if (codeRunning.value) return
    const nativeApp = await getNativeApp()
    if (nativeApp?.runCode) {
        const document = vscode.window.activeTextEditor?.document
        if (document) {
            codeRunning.value = true
            nativeApp.runCode(document).catch((e: Error) => {
                message.error(e.message);
            }).finally(() => { codeRunning.value = false })
        } else message.error("请打开文件后运行！");
        return
    }
    message.error("没有接口！");
}
function openFolder() {
    fileType.value = FileType.Directory;
    filePickerOpen.value = true;
}
function openFile() {
    fileType.value = FileType.File;
    filePickerOpen.value = true;
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
