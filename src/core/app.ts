
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import * as vscode from 'vscode'
import 'monaco-editor/esm/vs/editor/editor.all.js'
import './vscode-plugins'

import 'vscode/default-extensions/theme-defaults'
import 'vscode/default-extensions/javascript'
import 'vscode/default-extensions/typescript-basics'
import 'vscode/default-extensions/json'
import 'vscode/default-extensions/xml'
import 'vscode/default-extensions/theme-seti'
import 'vscode/default-extensions/references-view'
import 'vscode/default-extensions/search-result'
import { jsCode } from "./testdata";
import './setup'
import './features/userConfiguration'
import './features/filesystem'
import './features/customView'
import './features/intellisense'
import './native'

import { onExtHostInitialized } from 'vscode/extensions'
import { Modal } from 'ant-design-vue';
import { createVNode, watch } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

import { meunSate, rootPath, editorOpened } from './appConfigs'
import { openNewFolder } from './shortcutFunctions'
import { keyboard } from './native/native_status'
import { ViewColumn, WorkspaceFolderPickOptions } from 'vscode'
// const modelRef = await createModelReference(monaco.Uri.file('/tmp/test.js'), jsCode)

const isDev = import.meta.env.DEV;

vscode.window.onDidChangeActiveTextEditor(() => {
  meunSate.value = false
})

//已打开编辑器保存和恢复
onExtHostInitialized(async () => {
  console.log("恢复标签：", editorOpened.value.length);
  setTimeout(async () => {
    for (let uri of editorOpened.value) {
      await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(uri));
    }
  }, 500)

})
setInterval(() => {
  editorOpened.value = vscode.workspace.textDocuments.map((t) => {
    return t.uri.toString()
  })
}, 1000)

watch(keyboard, (open) => {
  const e = document.activeElement
  if (!open && isEditorActive()) {
    (e as HTMLElement).blur()
  }
})
export function isEditorActive(): boolean {
  const e = document.activeElement
  return !!(e?.classList.contains('monaco-mouse-cursor-text') && (e.tagName == 'textarea'.toLocaleUpperCase()))
}
//初始化工作区目录
openNewFolder(rootPath.value)

export async function checkDocument(message: string) {
  const isChange = vscode.workspace.textDocuments.some(document => document.isDirty);
  if (isChange) {
    await new Promise((resolve, reject) => {
      Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: message,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: resolve,
        onCancel: async () => {
          reject(new Error('cancelled'))
        }
      });
    })
  }
}
