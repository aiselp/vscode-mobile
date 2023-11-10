
import '@codingame/monaco-vscode-language-pack-zh-hans'
import * as monaco from 'monaco-editor'
import * as vscode from 'vscode'

import './setup'
import './vscode-plugins'

import '@codingame/monaco-vscode-javascript-default-extension'
import '@codingame/monaco-vscode-typescript-basics-default-extension'
import '@codingame/monaco-vscode-json-default-extension'
import '@codingame/monaco-vscode-xml-default-extension'

import '@codingame/monaco-vscode-theme-defaults-default-extension'
import '@codingame/monaco-vscode-theme-seti-default-extension'
import '@codingame/monaco-vscode-references-view-default-extension'
import '@codingame/monaco-vscode-search-result-default-extension'
import '@codingame/monaco-vscode-configuration-editing-default-extension'
import '@codingame/monaco-vscode-markdown-math-default-extension'
import '@codingame/monaco-vscode-npm-default-extension'
import '@codingame/monaco-vscode-media-preview-default-extension'


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
import { getNativeApp } from './native'
import { ViewColumn, WorkspaceFolderPickOptions } from 'vscode'
import { updateUserConfiguration, getUserConfiguration } from '@codingame/monaco-vscode-configuration-service-override'

const isDev = import.meta.env.DEV;

vscode.window.onDidChangeActiveTextEditor(() => {
  meunSate.value = false
})

//已打开编辑器保存和恢复
onExtHostInitialized(async () => {
  console.log("恢复标签：", editorOpened.value.length);
  await getNativeApp()
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
onExtHostInitialized(async () => {
  await import('./setup_monaco')
  await getNativeApp()
  openNewFolder(rootPath.value)
})


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
