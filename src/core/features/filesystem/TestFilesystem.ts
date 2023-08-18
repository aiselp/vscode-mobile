import { SimpleTextFileSystemProvider, FileType } from 'vscode/service-override/files'
import * as vscode from 'vscode'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { Directory } from '@capacitor/filesystem'

class TestFilesystem extends SimpleTextFileSystemProvider {
    private files: Record<string, string> = {
        [vscode.Uri.file('/test2.js').toString(true)]: 'This is another file'
    }

    protected override async getFileContent(resource: monaco.Uri): Promise<string | undefined> {
        return this.files[resource.toString(true)]
    }

    protected override async setFileContent(resource: monaco.Uri, content: string): Promise<void> {
        this.files[resource.toString(true)] = content
    }

    override async delete(): Promise<void> {
    }

    override async readdir(): Promise<[string, FileType][]> {
        const directory = arguments[0] as monaco.Uri
        if (directory.path === '/') {
            return [['test2.js', FileType.File], ['tmp', FileType.Directory]]
        }
        return []
    }
}

export default TestFilesystem