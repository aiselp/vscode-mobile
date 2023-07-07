import EventEmitter from "eventemitter3";
import { createConfiguredEditor, createModelReference } from 'vscode/monaco'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import 'monaco-editor/esm/vs/editor/editor.all.js'

import 'vscode/default-extensions/theme-defaults'
import 'vscode/default-extensions/javascript'
import 'vscode/default-extensions/typescript-basics'
import 'vscode/default-extensions/json'
import 'vscode/default-extensions/theme-seti'
import 'vscode/default-extensions/references-view'
import 'vscode/default-extensions/search-result'
import { jsCode } from "./testdata";
import './setup'
import './features/filesystem'
import './features/notifications'
import './features/customView'
import './features/intellisense'

const modelRef = await createModelReference(monaco.Uri.file('/tmp/test.js'), jsCode)
const ee = new EventEmitter();
const isDev = import.meta.env.DEV;

let globalApp: monaco.editor.IStandaloneCodeEditor | null = null;

function init(dom: HTMLElement) {
  globalApp = createConfiguredEditor(dom, {
    model: modelRef.object.textEditorModel
  })
  //   if (isDev) {

  //}

  ee.emit("ready");
}


export default ee;
export { init };
