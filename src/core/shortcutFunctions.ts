import * as vscode from 'vscode'
import { IonButton, toastController } from '@ionic/vue';


export async function save() {
    await vscode.window.activeTextEditor?.document.save()
    const toast = await toastController.create({
        message: '保存成功！',
        duration: 1500,
    });
    await toast.present();
}
export async function undo() {
    await vscode.commands.executeCommand('undo');
}
export async function redo() {
    await vscode.commands.executeCommand('redo');
    const commands = vscode.commands.getCommands();
    commands.then((allCommands: string[]) => {
        allCommands.forEach((command) => {
            console.log(command);
        });
    });
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