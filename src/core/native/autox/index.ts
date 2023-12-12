import { FileSystemProvider, Uri, commands } from "vscode";
import PluginManager from "./PluginManager";
import getAutoxBridge, { } from "./bridge.d";
import AutoxFileSystemProvider, { IAutoxFileSystem } from "./filesystem";
import { IBaseApp } from "../native_interface";
import { ref } from "vue";
import AppController from "./AppController";

getAutoxBridge().then(async (autox) => {
    autox.registerHandler('app.openFile', (data) => {
        commands.executeCommand('vscode.open', Uri.parse(`autox://${data}`));
    })
    setTimeout(() => {
        autox.callHandler('app.init')
    }, 500)
    // console.log('Autox桥存在');
    // autox.callHandler('test', 'wwww', (data) => {
    //     console.log('auto回调：', data);
    // });
    // const fileSystem = new AutoxFileSystemProvider(await loadPlugin<IAutoxFileSystem>('FileSystem'))
    // const t = await fileSystem.readDirectory(Uri.file('/'))
    // console.log('readdir:');
    // console.log('size:', t.length);
    // console.log('0ss:', t[0][0]);

}).catch((err) => {
    // console.log('Autox桥不存在:', err);
})


export async function isSupported(): Promise<boolean> {
    try {
        await getAutoxBridge()
        return true
    } catch (e) {
        return false
    }
}
let pluginManager: PluginManager | null = null;
export async function loadPlugin<T>(pluginId: string): Promise<T> {
    if (pluginManager) {
        return await pluginManager.loadPlugin<T>(pluginId)
    } else {
        const bridge = await getAutoxBridge();
        pluginManager = new PluginManager(bridge)
        return await pluginManager.loadPlugin<T>(pluginId)
    }
}
export async function getAutoxApp() {
    const bridge = await getAutoxBridge()
    const fileSystenPlugin = await loadPlugin<IAutoxFileSystem>("FileSystem")
    const appController: AppController = await loadPlugin<AppController>('AppController')

    const autoxApp: IBaseApp = {
        exitApp: async function () {
            await appController.back();
        },
        keyboardStatus: ref<boolean>(false),
        getFileSystem: async function (): Promise<{ scheme: string; fileSystem: FileSystemProvider; }> {
            return {
                scheme: 'autox',
                fileSystem: new AutoxFileSystemProvider(fileSystenPlugin)
            }
        },
        onBackButton: function (priority: number, handler: (processNextHandler: () => void) => void): void {
            bridge.registerHandler("app.onBackButton", () => {
                console.log("onBackButton");
                handler(() => { })
            })
        },
        runCode: async function (doc) {
            await appController.runScript(doc.uri.path)
        }
    }
    bridge.registerHandler("app.onKeyboardDidShow", () => {
        console.log("app.onKeyboardDidShow");
        autoxApp.keyboardStatus.value = true
    })
    bridge.registerHandler("app.onKeyboardDidHide", () => {
        console.log("app.onKeyboardDidHide");
        autoxApp.keyboardStatus.value = false
    })

    return autoxApp
}