import { checkDocument } from '../app'
import * as capacitor from './capacitor'
import * as autox from './autox'
import { IBaseApp } from './native_interface';


export async function getNativeApp(): Promise<IBaseApp | null> {
    if (await capacitor.isSupported()) {
        return capacitor.getCapacitorApp()
    }
    if (await autox.isSupported()) {
        return autox.getAutoxApp()
    }
    return null
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