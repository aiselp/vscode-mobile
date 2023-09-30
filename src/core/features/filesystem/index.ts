import {
    registerFileSystemOverlay, RegisteredReadOnlyFile,
    IFileSystemProviderWithFileReadWriteCapability
    , RegisteredFileSystemProvider, RegisteredMemoryFile
} from 'vscode/service-override/files'
import { ref } from 'vue'
import CapacitorFilesystem from './CapacitorFilesystem'
import TestFilesystem from './TestFilesystem'
import { Uri, workspace } from 'vscode'

const capFilesystem = new CapacitorFilesystem()
const fileSystemProvider = new RegisteredFileSystemProvider(false)
const defaultFileSystem = ref<IFileSystemProviderWithFileReadWriteCapability>(fileSystemProvider)
if (import.meta.env.DEV) {
    fileSystemProvider.registerFile(new RegisteredReadOnlyFile(Uri.file('/tmp/test_readonly.js'), async () => 'This is a readonly static file'))
    fileSystemProvider.registerFile(new RegisteredMemoryFile(Uri.file('/tmp/test_readonly2.js'), 'This is a readonly static file'))
    fileSystemProvider.registerFile(new RegisteredMemoryFile(Uri.file('/tmp/test_readonly3.js'), 'This is a readonly static file'))
    registerFileSystemOverlay(0, defaultFileSystem.value)

} else {
    workspace.registerFileSystemProvider(CapacitorFilesystem.scheme, capFilesystem)
}

export default capFilesystem