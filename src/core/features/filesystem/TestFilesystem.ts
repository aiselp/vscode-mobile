import { RegisteredFileSystemProvider, FileType } from 'vscode/service-override/files'
import * as vscode from 'vscode'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { Directory } from '@capacitor/filesystem'

class TestFilesystem extends RegisteredFileSystemProvider {
    private files2: Record<string, string> = {
        [vscode.Uri.file('/test2.js').toString(true)]: 'This is another file'
    }

    async readFile(resource: monaco.Uri): Promise<Uint8Array> {
        return new TextEncoder().encode(this.files2[resource.toString(true)])
    }

    protected async setFileContent(resource: monaco.Uri, content: string): Promise<void> {
        this.files2[resource.toString(true)] = content
    }

    override async delete(): Promise<void> {
    }

    async readdir(): Promise<[string, FileType][]> {
        const directory = arguments[0] as monaco.Uri
        if (directory.path === '/') {
            return [['test2.js', FileType.File], ['tmp', FileType.Directory]]
        }
        return []
    }
}

export default TestFilesystem