import * as vscode from 'vscode'
import { IonButton, toastController } from '@ionic/vue';
import { rootPath } from './appConfigs'
import { Modal } from 'ant-design-vue';

export async function execCommand(command: string) {
    await vscode.commands.executeCommand(command);
}
export async function save() {
    await vscode.window.activeTextEditor?.document.save()
    // const toast = await toastController.create({
    //     message: '保存成功！',
    //     duration: 1500,
    // });
    // await toast.present();
}
export async function undo() {
    await vscode.commands.executeCommand('undo');
}
export async function redo() {
    await vscode.commands.executeCommand('redo');
}
export async function gotoline() {
    await vscode.commands.executeCommand('workbench.action.gotoLine');
}
export async function find() {
    await vscode.commands.executeCommand('editor.action.nextMatchFindAction');
}
export async function gotoline2() {
    await vscode.commands.executeCommand('workbench.action.gotoLine');
}
export async function commentLine() {
    await vscode.commands.executeCommand('workbench.action.showCommands');
}
export async function formatDocument() {
    await vscode.commands.executeCommand('editor.action.formatDocument');
}
export async function openSearch() {
    await vscode.commands.executeCommand('workbench.view.search');
}
export async function openExplorer() {
    await vscode.commands.executeCommand('workbench.view.explorer');
}

export async function insertText(text: string) {
    const editor = vscode.window.activeTextEditor;
    await editor?.insertSnippet(new vscode.SnippetString(text));
    // vscode.commands.executeCommand('editor.action.triggerSuggest');
}

export async function moveCursorByOffset(lineOffset: number = 0, characterOffset: number = 0) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        // 获取当前光标位置
        const currentPosition = editor.selection.active;
        // 计算新的位置
        const newPosition = currentPosition.translate(lineOffset, characterOffset);
        // 移动光标到新的位置
        editor.selection = new vscode.Selection(newPosition, newPosition);
    }
}

export async function selection() {
    await vscode.commands.executeCommand('editor.action.smartSelect.expand');
}
export async function copySelection() {
    await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
    const toast = await toastController.create({
        message: '复制成功！',
        duration: 1500,
    });
    await toast.present();
}
export async function openSettings() {
    await vscode.commands.executeCommand('workbench.action.openSettings');
}
export async function openNewFolder(uri: string | vscode.Uri) {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors')
    vscode.workspace.updateWorkspaceFolders(0, vscode.workspace.workspaceFolders?.length, {
        uri: vscode.Uri.parse(uri.toString()),
    })
    rootPath.value = uri.toString();
}