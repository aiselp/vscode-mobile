import * as monaco from 'monaco-editor'
import { editor } from 'monaco-editor'

const defaultOptions: editor.IEditorOptions = {
    lineNumbersMinChars: 3,
}

monaco.editor.onDidCreateEditor((codeEditor) => {
    console.log('Editor created');

    const options = codeEditor.getRawOptions()
    setTimeout(() => {
        codeEditor.updateOptions(Object.assign(options, defaultOptions))
    }, 500)
})