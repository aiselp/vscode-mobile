import EventEmitter from "eventemitter3";
import { createConfiguredEditor, createModelReference } from 'vscode/monaco'
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

import {
  updateUserConfiguration, configurationRegistry, getUserConfiguration
} from 'vscode/service-override/configuration'
import { Modal } from 'ant-design-vue';
import { createVNode, watch } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

import { meunSate, rootPath } from './appConfigs'
import { openNewFolder } from './shortcutFunctions'
import { keyboard } from './native/native_status'
// const modelRef = await createModelReference(monaco.Uri.file('/tmp/test.js'), jsCode)
const ee = new EventEmitter();
const isDev = import.meta.env.DEV;

vscode.window.onDidChangeActiveTextEditor(() => {
  meunSate.value = false
})
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

function init(dom: HTMLElement) {
  ee.emit("ready");
}
export async function closeApp() {
  const isChange = vscode.workspace.textDocuments.some(document => document.isDirty);
  if (isChange) {
    await new Promise((resolve, reject) => {
      Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '存在未保存文件，是否退出？',
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

export default ee;
export { init };
