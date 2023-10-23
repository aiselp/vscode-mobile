
import * as vscode from 'vscode'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Base64 } from 'js-base64';
import { Emitter, Event } from 'vscode/dist/vscode/vs/base/common/event.js';
import { FileType, FileSystemError } from 'vscode';


const directory = Directory.ExternalStorage

class FakeFileSystem implements vscode.FileSystemProvider {
    static readonly scheme: string = 'capFile'

    onDidChangeCapabilities: Event<void>;
    onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

    constructor() {

        const onDidChangeCapabilities = new vscode.EventEmitter<void>()
        this.onDidChangeCapabilities = onDidChangeCapabilities.event
        const onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>()
        this.onDidChangeFile = onDidChangeFile.event
    }

    async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
        try {
            const stat = await Filesystem.stat({
                path: uri.path,
                directory
            })
            return {
                type: stat.type === 'directory' ? FileType.Directory : FileType.File,
                mtime: stat.mtime,
                ctime: stat.mtime,
                size: stat.size
            }
        } catch (err) {
            const e = FileSystemError.FileNotFound(uri)
            throw e;
        }
    }


    watch(resource: monaco.Uri, opts: any) {
        return {
            dispose: () => { }
        }
    }
    async createDirectory(uri: vscode.Uri): Promise<void> {
        try {
            await Filesystem.mkdir({
                path: uri.path,
                directory
            })
        } catch (err) {
            throw FileSystemError.Unavailable(uri)
        }
    }
    async rename(from: monaco.Uri, to: monaco.Uri, opts: any): Promise<void> {
        try {
            await Filesystem.rename({
                from: from.path,
                to: to.path,
                directory
            })
        } catch (err) {
            throw FileSystemError.Unavailable((err as Error).message)
        }
    }
    async writeFile(resource: monaco.Uri, content: Uint8Array, opts: any): Promise<void> {
        console.log('writeFile', resource.toString());
        let stat, path = resource.path;
        try {
            stat = await Filesystem.stat({ path: resource.path, directory })
            if (!opts.overwrite) throw FileSystemError.FileExists(resource)
        } catch (err2) {
            if (!opts.create) throw FileSystemError.FileNotFound(resource)
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
            throw FileSystemError.Unavailable(resource)
        }
    }

    async readFile(resource: monaco.Uri): Promise<Uint8Array> {
        try {
            const stat = await Filesystem.stat({ path: resource.path, directory })
            if (stat.size > 1024 * 1024 * 5) {
                throw new Error('file is too big')
            }
            const { data } = await Filesystem.readFile({
                path: resource.path,
                directory
            })
            return Base64.toUint8Array(data)
        } catch (err) {
            throw FileSystemError.FileNotFound(resource)
        }
    }

    async delete(resource: monaco.Uri): Promise<void> {
        try {
            await Filesystem.deleteFile({
                path: resource.path, directory
            })
        } catch (err) {
            throw FileSystemError.Unavailable(resource)
        }
    }

    async readDirectory(dir: monaco.Uri): Promise<[string, vscode.FileType][]> {
        try {
            const { files } = await Filesystem.readdir({
                path: dir.path,
                directory
            })
            // console.log(files.map(file => file.name));
            return files.map(file => {
                const type = file.type === 'directory' ? FileType.Directory : FileType.File
                return [file.name, type]
            })
        } catch (err) {
            throw FileSystemError.Unavailable(dir)
        }
    }
}

export default FakeFileSystem
