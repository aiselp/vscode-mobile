import {
    IFileSystemProviderWithFileReadWriteCapability,
    FileSystemProviderCapabilities,
    FileType, IFileChange, IStat, IFileOverwriteOptions, IFileWriteOptions,
    IWatchOptions, FileSystemProviderError, FileSystemProviderErrorCode
} from 'vscode/service-override/files'
import * as vscode from 'vscode'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Base64 } from 'js-base64';
import { E as Event, a as IDisposable } from 'vscode/dist/event';

const directory = Directory.ExternalStorage

class FakeFileSystem implements IFileSystemProviderWithFileReadWriteCapability {

    capabilities: FileSystemProviderCapabilities;
    onDidChangeCapabilities: Event<void>;
    onDidChangeFile: Event<readonly IFileChange[]>;

    constructor() {
        this.capabilities = FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.PathCaseSensitive
        const onDidChangeCapabilities = new vscode.EventEmitter<void>()
        this.onDidChangeCapabilities = onDidChangeCapabilities.event
        const onDidChangeFile = new vscode.EventEmitter<IFileChange[]>()
        this.onDidChangeFile = onDidChangeFile.event
    }
    watch(resource: monaco.Uri, opts: IWatchOptions): IDisposable {
        return {
            dispose: () => { }
        }
    }
    async stat(resource: monaco.Uri): Promise<IStat> {
        try {
            const stat = await Filesystem.stat({
                path: resource.path,
                directory
            })
            return {
                type: stat.type === 'directory' ? FileType.Directory : FileType.File,
                mtime: stat.mtime,
                ctime: stat.mtime,
                size: stat.size
            }
        } catch (err) {
            const e = FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.FileNotFound)
            throw e;
        }
    }
    async mkdir(resource: monaco.Uri): Promise<void> {
        try {
            await Filesystem.mkdir({
                path: resource.path,
                directory
            })
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unavailable)
        }
    }
    async rename(from: monaco.Uri, to: monaco.Uri, opts: IFileOverwriteOptions): Promise<void> {
        try {
            await Filesystem.rename({
                from: from.path,
                to: to.path,
                directory
            })
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unavailable)
        }
    }
    async writeFile(resource: monaco.Uri, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
        console.log('writeFile', resource.toString());
        let stat, path = resource.path;
        try {
            stat = await Filesystem.stat({ path: resource.path, directory })
            if (!opts.overwrite) throw FileSystemProviderError.create('fileExists', FileSystemProviderErrorCode.FileExists)
        } catch (err2) {
            if (!opts.create) throw FileSystemProviderError.create(err2 as Error, FileSystemProviderErrorCode.FileNotFound);
        }
        if (opts.atomic) {
            path += '.vscodecache'
        }
        try {
            await Filesystem.writeFile({
                path, data: Base64.fromUint8Array(content), directory
            })
            if (opts.atomic) await Filesystem.rename({
                from: path, to: resource.path, directory
            })
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unknown)
        }
    }

    async readFile(resource: monaco.Uri): Promise<Uint8Array> {
        try {
            const stat = await Filesystem.stat({ path: resource.path, directory })
            if (stat.size > 1024 * 1024 * 5) {
                throw new Error('file is too big')
            }
            const { data } = await Filesystem.readFile({
                path: resource.fsPath,
                directory
            })
            return Base64.toUint8Array(data)
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.FileNotFound)
        }
    }

    async delete(resource: monaco.Uri): Promise<void> {
        try {
            await Filesystem.deleteFile({
                path: resource.fsPath, directory
            })
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unknown)
        }
    }

    async readdir(dir: monaco.Uri): Promise<[string, FileType][]> {
        try {
            const { files } = await Filesystem.readdir({
                path: dir.fsPath,
                directory
            })
            console.log(files.map(file => file.name));
            return files.map(file => {
                const type = file.type === 'directory' ? FileType.Directory : FileType.File
                return [file.name, type]
            })
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unavailable)
        }
    }
}

export default FakeFileSystem
