// import {
//     registerFileSystemOverlay, RegisteredReadOnlyFile,
//     IFileSystemProviderWithFileReadWriteCapability
//     , RegisteredFileSystemProvider, RegisteredMemoryFile
// } from 'vscode/service-override/files'
import { ref } from 'vue'
import TestFilesystem from './TestFilesystem'
import { FileSystemProvider, Uri, workspace } from 'vscode'
import { getNativeApp } from '@/core/native'

// const fileSystemProvider = new RegisteredFileSystemProvider(false)
// const defaultFileSystem = ref<IFileSystemProviderWithFileReadWriteCapability>(fileSystemProvider)
// if (import.meta.env.DEV) {
//     fileSystemProvider.registerFile(new RegisteredReadOnlyFile(Uri.file('/tmp/test_readonly.js'), async () => 'This is a readonly static file'))
//     fileSystemProvider.registerFile(new RegisteredMemoryFile(Uri.file('/tmp/test_readonly2.js'), 'This is a readonly static file'))
//     fileSystemProvider.registerFile(new RegisteredMemoryFile(Uri.file('/tmp/test_readonly3.js'), 'This is a readonly static file'))
//     registerFileSystemOverlay(0, defaultFileSystem.value)

// }

let nativeFileSystem = ref<null | {
    scheme: string;
    fileSystem: FileSystemProvider;
}>(null)

getNativeApp().then(async (nativeApp) => {
    if (nativeApp) {
        nativeFileSystem.value = await nativeApp.getFileSystem()
    }
    console.log("Native load complete,fileSystem: " + nativeFileSystem.value?.scheme);
    const fileSystem = nativeFileSystem.value
    if (fileSystem) {
        workspace.registerFileSystemProvider(fileSystem.scheme, fileSystem.fileSystem)
    }
})

export default nativeFileSystem