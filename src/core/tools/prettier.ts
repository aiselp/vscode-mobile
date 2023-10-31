import * as prettier from 'prettier'
import babel from 'prettier/plugins/babel'
import * as vscode from 'vscode'
import estree from 'prettier/plugins/estree'
import typescript from 'prettier/plugins/typescript'
import html from 'prettier/plugins/html'
import markdown from 'prettier/plugins/markdown'



export async function prettierFormat() {
    const editor = vscode.window.activeTextEditor
    if (!editor) return
    const options: prettier.Options = {
        // parser: 'babel',
        filepath: editor.document.fileName,
        plugins: [babel, estree, typescript, html, markdown]
    }
    const oldCode = editor.document.getText()
    if (await prettier.check(oldCode, options)) return
    const code = await prettier.format(oldCode, options)
    await editor.edit((builder) => {
        // 获取文本的范围
        const fullRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
        builder.replace(fullRange, code)
    })
}