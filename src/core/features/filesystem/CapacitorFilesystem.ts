

import { Filesystem, Directory } from '@capacitor/filesystem'
import { Base64 } from 'js-base64';
import {
    FileType, FileSystemError, EventEmitter, Uri,
    Event, FileSystemProvider, FileChangeEvent, FileStat
} from 'vscode';


const directory = Directory.ExternalStorage

class FakeFileSystem implements FileSystemProvider {
    static readonly scheme: string = 'capFile'

    onDidChangeCapabilities: Event<void>;
    onDidChangeFile: Event<FileChangeEvent[]>;

    constructor() {

        const onDidChangeCapabilities = new EventEmitter<void>()
        this.onDidChangeCapabilities = onDidChangeCapabilities.event
        const onDidChangeFile = new EventEmitter<FileChangeEvent[]>()
        this.onDidChangeFile = onDidChangeFile.event
    }

    async stat(uri: Uri): Promise<FileStat> {
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


    watch(resource: Uri, opts: any) {
        return {
            dispose: () => { }
        }
    }
    async createDirectory(uri: Uri): Promise<void> {
        try {
            await Filesystem.mkdir({
                path: uri.path,
                directory
            })
        } catch (err) {
            throw FileSystemError.Unavailable(uri)
        }
    }
    async rename(from: Uri, to: Uri, opts: any): Promise<void> {
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
    async writeFile(resource: Uri, content: Uint8Array, opts: any): Promise<void> {
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

    async readFile(resource: Uri): Promise<Uint8Array> {
        try {
            const stat = await Filesystem.stat({ path: resource.path, directory })
            if (stat.size > 1024 * 1024 * 5) {
                throw new Error('file is too big')
            }
            const { data } = await Filesystem.readFile({
                path: resource.path,
                directory
            })
            if (data instanceof Blob) {
                return new Uint8Array(await data.arrayBuffer())
            } else return Base64.toUint8Array(data)
        } catch (err) {
            throw FileSystemError.FileNotFound(resource)
        }
    }

    async delete(resource: Uri): Promise<void> {
        try {
            await Filesystem.deleteFile({
                path: resource.path, directory
            })
        } catch (err) {
            throw FileSystemError.Unavailable(resource)
        }
    }

    async readDirectory(dir: Uri): Promise<[string, FileType][]> {
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
