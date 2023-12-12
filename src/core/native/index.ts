import { checkDocument } from '../app'
import * as capacitor from './capacitor'
import * as autox from './autox'
import { IBaseApp } from './native_interface';


const nativeApp = (async () => {
    try {
        if (await capacitor.isSupported()) {
            return capacitor.getCapacitorApp()
        }
        if (await autox.isSupported()) {
            return autox.getAutoxApp()
        }
    } catch (e) {
        return null
    }
    return null
})()
export async function getNativeApp(): Promise<IBaseApp | null> {
    return await nativeApp
}

getNativeApp().then((native) => {
    if (native) {
        native.onBackButton(0, async (processNextHandler) => {
            try {
                await checkDocument('存在未保存文件，是否退出？')
                setTimeout(() => {
                    native.exitApp();
                }, 20)
            } catch {
                processNextHandler()
            }
        })
    }
})