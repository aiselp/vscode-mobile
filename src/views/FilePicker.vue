<template>
    <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name" :root-style="{ color: 'blue' }"
        style="color: red" title="选择文件" placement="right">
        <a-directory-tree v-model:expandedKeys="expandedKeys" :load-data="onLoadData" v-model:selectedKeys="selectedKeys"
            multiple :tree-data="treeData"></a-directory-tree>
        <template #footer>
            <div class="button-go">
                <a-button style="margin-right: 8px" @click="open = false">取消</a-button>
                <a-button type="primary" @click="selectFile">确定</a-button>
            </div>
        </template>
        <context-holder />
    </a-drawer>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import * as vscode from 'vscode'
import defaultFileSystem from '../core/features/filesystem'
import type { TreeProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { openNewFolder, openNewFile } from '../core/shortcutFunctions'
import { FileType } from 'vscode';

const props = defineProps<{
    isOpen: boolean,
    fileType: FileType
}>()
const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
}>()
const [messageApi, contextHolder] = message.useMessage();

const expandedKeys = ref<string[]>([]);
const loadedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const treeData = ref<TreeProps['treeData']>([
    {
        title: '/',
        key: vscode.Uri.parse(`${defaultFileSystem.value?.scheme}:///`).toString(),
        selectable: props.fileType == FileType.Directory,
        isLeaf: false,
    },
    // { title: 'Tree Node', key: '2', isLeaf: true },
])
watch(defaultFileSystem, (n) => {
    console.log("File system updated:", n?.scheme);

    if (!n) return
    treeData.value = [{
        title: '/',
        key: vscode.Uri.parse(`${n.scheme}:///`).toString(),
        selectable: props.fileType == FileType.Directory,
        isLeaf: false,
    }]
})

watch(props, () => {
    const data = treeData.value
    function update(data: TreeProps['treeData']) {
        if (!data) return
        for (let t of data) {
            const type = t.isLeaf == true ? FileType.File : FileType.Directory
            t.selectable = props.fileType == type
            update(t.children)
        }
    }
    return update(data)
})
const onLoadData: TreeProps['loadData'] = async (treeNode) => {
    if (treeNode.dataRef?.children) {
        return;
    }
    const filesystem = defaultFileSystem.value?.fileSystem
    if (!filesystem) return message.error('No filesystem')
    try {
        const files = await filesystem.readDirectory(vscode.Uri.parse(treeNode.key.toString()))
        if (treeNode.dataRef) {
            treeNode.dataRef.children = files.map(file => {
                if (typeof treeNode.eventKey !== 'string') throw new Error('not a uri')
                const key = vscode.Uri.joinPath(vscode.Uri.parse(treeNode.eventKey), file[0]).toString()
                return {
                    title: file[0],
                    key,
                    isLeaf: file[1] == FileType.File,
                    selectable: props.fileType == file[1]
                }
            })

        }
    } catch (e) {

    }
    if (treeData.value)
        treeData.value = [...treeData.value];

}
async function selectFile() {
    const isChange = vscode.workspace.textDocuments.some(document => document.isDirty);


    const uri = selectedKeys.value[0]
    if (uri) {
        open.value = false
        if (props.fileType == FileType.File) {
            await openNewFile(uri)
        } else {
            await openNewFolder(uri)
        }
    } else {
        messageApi.error('未选择文件')
    }
}
const open = computed<boolean>({
    get() {
        return props.isOpen
    },
    set(value: boolean): void {
        emit("update:isOpen", value)
    }
})


</script>
<style scoped>
.button-go {
    display: flex;
    justify-content: flex-end;
    padding: 5px;
}
</style>