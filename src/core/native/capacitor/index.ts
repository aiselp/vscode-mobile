import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard';
import { IBaseApp } from '../native_interface'
import { useBackButton } from '@ionic/vue';
import { FileSystemProvider, EventEmitter } from 'vscode'
import { App } from '@capacitor/app';
import { ref } from 'vue'
import CapacitorFilesystem from '@/core/features/filesystem/CapacitorFilesystem';

export function isSupported(): Promise<boolean> | boolean {
    return Capacitor.isNativePlatform()
}

const capacitorApp: IBaseApp = {
    exitApp: function (): void {
        App.exitApp();
    },
    getFileSystem: async function (): Promise<{ scheme: string; fileSystem: FileSystemProvider; }> {
        return {
            scheme: CapacitorFilesystem.scheme,
            fileSystem: new CapacitorFilesystem()
        };
    },
    keyboardStatus: ref<boolean>(false),
    onBackButton: function (priority: number, handler: (processNextHandler: () => void) => void): void {
        useBackButton(priority, handler)
    }
}

export async function getCapacitorApp(): Promise<IBaseApp> {
    if (!isSupported()) throw new Error('Not supported')
    Keyboard.addListener('keyboardDidHide', () => {
        capacitorApp.keyboardStatus.value = false
    });
    Keyboard.addListener('keyboardDidShow', () => {
        capacitorApp.keyboardStatus.value = true
    });

    return capacitorApp
}