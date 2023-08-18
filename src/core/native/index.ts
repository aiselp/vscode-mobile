import { closeApp } from '../app'
import { App } from '@capacitor/app';
import { useBackButton, useIonRouter } from '@ionic/vue';


useBackButton(0, async (processNextHandler) => {
    console.log('Handler was called!');
    try {
        await closeApp()
        App.exitApp();
    } catch {
        processNextHandler()
    }
});