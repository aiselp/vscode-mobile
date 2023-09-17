import { registerFileSystemOverlay, IFileSystemProviderWithFileReadWriteCapability } from 'vscode/service-override/files'
import { ref } from 'vue'
import CapacitorFilesystem from './CapacitorFilesystem'
import TestFilesystem from './TestFilesystem'

const defaultFileSystem = ref<IFileSystemProviderWithFileReadWriteCapability>(new TestFilesystem(false))
if (import.meta.env.DEV) {

} else {
    defaultFileSystem.value = new CapacitorFilesystem()
}
registerFileSystemOverlay(0, defaultFileSystem.value)

export default defaultFileSystem