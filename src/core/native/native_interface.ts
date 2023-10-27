import { FileSystemProvider, EventEmitter } from "vscode";
import { Ref } from "vue";

export interface IBaseApp {
    exitApp: () => void;
    keyboardStatus: Ref<boolean>
    getFileSystem(): Promise<{ scheme: string, fileSystem: FileSystemProvider }>
    onBackButton(
        priority: number,
        handler: (processNextHandler: () => void) => void
    ): void
}