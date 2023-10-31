
import {
    EventEmitter, FileSystemProvider, FileType,
    Uri, Event, FileChangeEvent, FileSystemError
} from 'vscode'
import { Base64 } from 'js-base64';

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

class TestFilesystem implements FileSystemProvider {


    onDidChangeCapabilities: Event<void>;
    onDidChangeFile: Event<FileChangeEvent[]>;

    files: Map<string, File> = new Map()

    constructor() {
        const onDidChangeCapabilities = new EventEmitter<void>()
        this.onDidChangeCapabilities = onDidChangeCapabilities.event
        const onDidChangeFile = new EventEmitter<FileChangeEvent[]>()
        this.onDidChangeFile = onDidChangeFile.event
    }

    async readDirectory(uri: Uri): Promise<[string, FileType][]> {
        try {
            const dir: [string, FileType][] = [['test.js', FileType.File]]
            // console.log(files.map(file => file.name));
            for (const [key, val] of this.files) {
                dir.push([val.name, FileType.File])
            }
            return dir
        } catch (err) {
            throw FileSystemError.FileNotFound(uri)
        }
    }
    async createDirectory(uri: Uri): Promise<void> {
        try {
        } catch (err) {
            throw FileSystemError.Unavailable(uri)
        }
    }
    copy?(source: Uri, destination: Uri, options: { readonly overwrite: boolean; }): void | Thenable<void> {
        throw new Error('Method not implemented.');
    }
    watch(resource: Uri) {
        return {
            dispose: () => { }
        }
    }
    async stat(resource: Uri) {
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
            const e = FileSystemError.FileNotFound(resource)
            throw e;
        }
    }
    async rename(from: Uri, to: Uri): Promise<void> {
        try {
            let file = this.files.get(from.path)
            if (!file) throw new Error(`File ${from.path} not found`)
            this.files.set(to.path, file)
            this.files.delete(from.path)
        } catch (err) {
            throw FileSystemError.Unavailable(from)
        }
    }
    async writeFile(resource: Uri, content: Uint8Array): Promise<void> {
        console.log('writeFile', resource.toString());
        try {
            let fileName = resource.path.split('\/')
            const file = new File(fileName[fileName.length - 1], true,
                Base64.fromUint8Array(content))
            this.files.set(resource.path, file)
        } catch (err) {
            throw FileSystemError.Unavailable(resource)
        }
    }

    async readFile(resource: Uri): Promise<Uint8Array> {
        try {
            const file = this.files.get(resource.path)
            if (!file) throw new Error('File not found: ' + resource.path)
            return Base64.toUint8Array(Base64.encode(file.content))
        } catch (err) {
            throw FileSystemError.FileExists(resource)
        }
    }

    async delete(resource: Uri): Promise<void> {
        try {
            this.files.delete(resource.path)
        } catch (err) {
            throw FileSystemError.Unavailable(resource)
        }
    }

}

export default TestFilesystem