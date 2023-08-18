import { registerFileSystemOverlay, IFileSystemProviderWithFileReadWriteCapability } from 'vscode/service-override/files'
import { ref } from 'vue'
import CapacitorFilesystem from './CapacitorFilesystem'
import TestFilesystem from './TestFilesystem'

const defaultFileSystem = ref<IFileSystemProviderWithFileReadWriteCapability>(new TestFilesystem())
if (import.meta.env.DEV) {

} else {
    defaultFileSystem.value = new CapacitorFilesystem()
}
registerFileSystemOverlay(defaultFileSystem.value)

export default defaultFileSystem