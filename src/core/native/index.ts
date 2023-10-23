import { checkDocument } from '../app'
import { App } from '@capacitor/app';
import { useBackButton, useIonRouter } from '@ionic/vue';


useBackButton(0, async (processNextHandler) => {
    console.log('Handler was called!');
    try {
        await checkDocument('存在未保存文件，是否退出？')
        setTimeout(() => {
            App.exitApp();
        }, 20)
    } catch {
        processNextHandler()
    }
});