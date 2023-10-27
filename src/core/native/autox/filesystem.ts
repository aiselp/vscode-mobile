import {
    Uri, FileSystemProvider, Disposable, EventEmitter,
    Event, FileChangeEvent, FileStat, FileType
} from "vscode";
import { Base64 } from 'js-base64';


export interface IAutoxFileSystem {
    stat(data: string): Promise<string | undefined>
    readDirectory(data: string): Promise<string | undefined>
    createDirectory(data: string): Promise<string | undefined>
    readFile(data: string): Promise<string | undefined>
    writeFile(data: string): Promise<string | undefined>
    delete(data: string): Promise<string | undefined>
    rename(data: string): Promise<string | undefined>
    copy(data: string): Promise<string | undefined>
}
interface FileRequest {
    path: string
    data?: string
    encoding?: string
}
interface RenameFileRequest {
    form: string
    to: string
}
interface CopyFileRequest {
    form: string
    to: string
}
interface FileResult {

}
interface StatResult {
    name: string
    type: 'file' | 'directory'
    size: number
    ctime: number
    mtine: number
}
class AutoxFileSystemProvider implements FileSystemProvider {
    native: IAutoxFileSystem
    onDidChangeFile: Event<FileChangeEvent[]>;
    constructor(x: IAutoxFileSystem) {
        this.native = x
        const fileChangeEvent = new EventEmitter<FileChangeEvent[]>()
        this.onDidChangeFile = fileChangeEvent.event
    }

    watch(uri: Uri, options: { readonly recursive: boolean; readonly excludes: readonly string[]; }): Disposable {
        throw new Error("Method not implemented.");
    }
    async stat(uri: Uri): Promise<FileStat> {
        const fileRequest: FileRequest = {
            path: uri.path
        }
        const data = await this.native.stat(JSON.stringify(fileRequest))
        console.error(data);

        const nstat = JSON.parse(data!) as StatResult
        const stat: FileStat = {
            type: nstat.type === 'file' ? FileType.File : FileType.Directory,
            size: nstat.size,
            ctime: nstat.ctime,
            mtime: nstat.mtine,
        }
        return stat
    }
    async readDirectory(uri: Uri): Promise<[string, FileType][]> {
        const fileRequest: FileRequest = {
            path: uri.path
        }
        const data = await this.native.readDirectory(JSON.stringify(fileRequest))
        const statarr: StatResult[] = JSON.parse(data!) as StatResult[]
        return statarr.map((stat) => {
            return [stat.name, stat.type === 'file' ? FileType.File : FileType.Directory]
        })
    }
    async createDirectory(uri: Uri): Promise<void> {
        const fileRequest: FileRequest = {
            path: uri.path
        }
        await this.native.createDirectory(JSON.stringify(fileRequest))
    }
    async readFile(uri: Uri): Promise<Uint8Array> {
        const fileRequest: FileRequest = {
            path: uri.path
        }
        const data = await this.native.readFile(JSON.stringify(fileRequest))
        return Base64.toUint8Array(data!)
    }
    async writeFile(uri: Uri, content: Uint8Array, options: { readonly create: boolean; readonly overwrite: boolean; }): Promise<void> {
        const fileRequest: FileRequest = {
            path: uri.path,
            data: Base64.fromUint8Array(content)
        }
        await this.native.writeFile(JSON.stringify(fileRequest))
    }
    async delete(uri: Uri, options: { readonly recursive: boolean; }): Promise<void> {
        const fileRequest: FileRequest = {
            path: uri.path
        }
        await this.native.delete(JSON.stringify(fileRequest))
    }
    async rename(oldUri: Uri, newUri: Uri, options: { readonly overwrite: boolean; }): Promise<void> {
        const fileRequest: RenameFileRequest = {
            form: oldUri.path,
            to: newUri.path,
        }
        await this.native.rename(JSON.stringify(fileRequest))
    }
    async copy?(source: Uri, destination: Uri, options: { readonly overwrite: boolean; }): Promise<void> {
        const fileRequest: CopyFileRequest = {
            form: source.path,
            to: destination.path,
        }
        await this.native.copy(JSON.stringify(fileRequest))
    }

}

export default AutoxFileSystemProvider