import {
    IFileSystemProviderWithFileReadWriteCapability,
    FileSystemProviderCapabilities,
    FileType, IFileChange, IStat, IFileOverwriteOptions, IFileWriteOptions,
    IWatchOptions, FileSystemProviderError, FileSystemProviderErrorCode
} from 'vscode/service-override/files'
import * as vscode from 'vscode'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { Base64 } from 'js-base64';
import { Emitter, Event } from 'vscode/dist/vscode/vs/base/common/event.js';

class File {
    name: string
    isFile: boolean
    subFiles: Array<File> = []
    content: string
    constructor(name: string, isFile: boolean = false, content: string = "") {
        this.name = name;
        this.isFile = isFile;
        this.content = content;
    }
    rename(name: string) {
        this.name = name
    }
}

class TestFilesystem implements IFileSystemProviderWithFileReadWriteCapability {

    capabilities: FileSystemProviderCapabilities;
    onDidChangeCapabilities: Event<void>;
    onDidChangeFile: Event<readonly IFileChange[]>;

    files: Map<string, File> = new Map()

    constructor() {
        this.capabilities = FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.PathCaseSensitive
        const onDidChangeCapabilities = new vscode.EventEmitter<void>()
        this.onDidChangeCapabilities = onDidChangeCapabilities.event
        const onDidChangeFile = new vscode.EventEmitter<IFileChange[]>()
        this.onDidChangeFile = onDidChangeFile.event
    }
    watch(resource: monaco.Uri, opts: IWatchOptions) {
        return {
            dispose: () => { }
        }
    }
    async stat(resource: monaco.Uri): Promise<IStat> {
        try {
            let file = this.files.get(resource.path)
            if (!file) throw new Error(`File ${resource.path}`)
            return {
                type: FileType.File,
                size: file.content.length,
                mtime: 0,
                ctime: 0
            }
        } catch (err) {
            const e = FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.FileNotFound)
            throw e;
        }
    }
    async mkdir(resource: monaco.Uri): Promise<void> {
        try {

        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unavailable)
        }
    }
    async rename(from: monaco.Uri, to: monaco.Uri, opts: IFileOverwriteOptions): Promise<void> {
        try {
            let file = this.files.get(from.path)
            if (!file) throw new Error(`File ${from.path} not found`)
            this.files.set(to.path, file)
            this.files.delete(from.path)
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unavailable)
        }
    }
    async writeFile(resource: monaco.Uri, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
        console.log('writeFile', resource.toString());
        try {
            let fileName = resource.path.split('\/')
            const file = new File(fileName[fileName.length - 1], true,
                Base64.fromUint8Array(content))
            this.files.set(resource.path, file)
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unknown)
        }
    }

    async readFile(resource: monaco.Uri): Promise<Uint8Array> {
        try {
            const file = this.files.get(resource.path)
            if (!file) throw new Error('File not found: ' + resource.path)
            return Base64.toUint8Array(Base64.encode(file.content))
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.FileNotFound)
        }
    }

    async delete(resource: monaco.Uri): Promise<void> {
        try {
            this.files.delete(resource.path)
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unknown)
        }
    }

    async readdir(dir: monaco.Uri): Promise<[string, FileType][]> {
        try {
            const dir: [string, FileType][] = [['test.js', FileType.File]]
            // console.log(files.map(file => file.name));
            for (const [key, val] of this.files) {
                dir.push([val.name, FileType.File])
            }
            return dir
        } catch (err) {
            throw FileSystemProviderError.create(err as Error, FileSystemProviderErrorCode.Unavailable)
        }
    }
}

export default TestFilesystem