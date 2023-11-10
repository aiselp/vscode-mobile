import * as prettier from 'prettier'
import * as vscode from 'vscode'
import userConfiguration from '../features/userConfiguration'
import { ref, watchEffect } from 'vue'
import { useStorage } from '@vueuse/core'

export const enable = useStorage<boolean>('prettier.enable', false)
const options: prettier.Options = {
    // parser: 'babel',
    // plugins: [babel, estree, typescript, html, markdown]
}

watchEffect(() => {
    const cnf = JSON.parse(userConfiguration.value)
    if (cnf['prettier.enable'] !== undefined) {
        enable.value = cnf['prettier.enable']
    }
    options.semi = cnf['prettier.semi']
    options.arrowParens = cnf['prettier.arrowParens']
    options.bracketSameLine = cnf['prettier.bracketSameLine']
    options.bracketSpacing = cnf['prettier.bracketSpacing']
    options.embeddedLanguageFormatting = cnf['prettier.embeddedLanguageFormatting']
    options.endOfLine = cnf['prettier.endOfLine']
    options.htmlWhitespaceSensitivity = cnf['prettier.htmlWhitespaceSensitivity']
    options.insertPragma = cnf['prettier.insertPragma']
    options.jsxSingleQuote = cnf['prettier.jsxSingleQuote']
    options.printWidth = cnf['prettier.printWidth']
    options.proseWrap = cnf['prettier.proseWrap']
    options.quoteProps = cnf['prettier.quoteProps']
    options.requirePragma = cnf['prettier.requirePragma']
    options.singleAttributePerLine = cnf['prettier.singleAttributePerLine']
    options.singleQuote = cnf['prettier.singleQuote']
    options.tabWidth = cnf['prettier.tabWidth']
    options.trailingComma = cnf['prettier.trailingComma']
    options.useTabs = cnf['prettier.useTabs']
    options.vueIndentScriptAndStyle = cnf['prettier.vueIndentScriptAndStyle']
})

async function install() {
    if (enable.value) {
        const plugins: any[] = [
            await import('prettier/plugins/babel'),
            await import('prettier/plugins/estree'),
            await import('prettier/plugins/typescript'),
            await import('prettier/plugins/html'),
            await import('prettier/plugins/markdown')
        ]
        options.plugins = plugins
    }
}

export async function prettierFormat() {
    const editor = vscode.window.activeTextEditor
    if (!editor) return
    await install()
    options.filepath = editor.document.fileName
    const oldCode = editor.document.getText()
    if (await prettier.check(oldCode, options)) return
    const code = await prettier.format(oldCode, options)
    await editor.edit((builder) => {
        // 获取文本的范围
        const fullRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
        builder.replace(fullRange, code)
    })
}
install()